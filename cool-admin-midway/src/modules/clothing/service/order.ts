import {
  BaseService,
  CoolCommException,
  CoolTransaction,
} from '@cool-midway/core';
import { Init, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { ProductEntity } from '../entity/product';
import { ProductSkuEntity } from '../entity/sku';
import { ProductOrderEntity } from '../entity/order';
import { ProductOrderItemEntity } from '../entity/orderItem';
import { ProductOrderLogisticsEntity } from '../entity/orderLogistics';

/**
 * 商品订单(衣)
 * 设计文档 3.2.7 统一订单先行落地(product 类型),状态机:
 * pending →(模拟支付)paid →(确认收货)completed;pending 可取消→cancelled(回补库存)
 */
@Provide()
export class ClothingOrderService extends BaseService {
  @InjectEntityModel(ProductOrderEntity)
  orderEntity: Repository<ProductOrderEntity>;

  @InjectEntityModel(ProductOrderItemEntity)
  itemEntity: Repository<ProductOrderItemEntity>;

  @InjectEntityModel(ProductOrderLogisticsEntity)
  logisticsEntity: Repository<ProductOrderLogisticsEntity>;

  @InjectEntityModel(ProductEntity)
  productEntity: Repository<ProductEntity>;

  @InjectEntityModel(ProductSkuEntity)
  skuEntity: Repository<ProductSkuEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.orderEntity);
  }

  /** 简易订单号:时间戳+随机,< 2^53 安全 */
  private genOrderId(): number {
    return Date.now() * 100 + Math.floor(Math.random() * 100);
  }

  /**
   * 创建商品订单(事务,支持多 SKU 结算)
   * body: { items:[{skuId, quantity}], consignee, phone, province, city, district, detail, remark? }
   * 兼容旧格式 { skuId, quantity, ... }
   * 校验 SKU 所属商品在售;扣 SKU 库存与商品总库存
   */
  @CoolTransaction({ connectionName: 'default' })
  async create(userId: number, body: any, queryRunner?: QueryRunner) {
    const {
      consignee,
      phone,
      province,
      city,
      district,
      detail,
      remark = '',
    } = body || {};
    if (!consignee || !phone || !detail) {
      throw new CoolCommException('请填写收货人/电话/详细地址');
    }
    // 规格行:多 SKU(items)或单 SKU(skuId)兼容
    const rawItems = Array.isArray(body?.items)
      ? body.items
      : body?.skuId
        ? [{ skuId: body.skuId, quantity: body.quantity }]
        : [];
    if (!rawItems.length) {
      throw new CoolCommException('请选择商品规格与数量');
    }
    const mgr = queryRunner.manager;
    // 逐行校验(行锁防并发超卖)并扣库存
    let totalAmount = 0;
    const snapshots: any[] = [];
    for (const it of rawItems) {
      const qty = Number(it.quantity);
      const skuId = Number(it.skuId);
      if (!skuId || !Number.isInteger(qty) || qty <= 0) {
        throw new CoolCommException('商品规格或数量错误');
      }
      const sku = await mgr.findOne(ProductSkuEntity, {
        where: { id: skuId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!sku || sku.status !== 'active') {
        throw new CoolCommException('商品规格不存在');
      }
      const product = await mgr.findOne(ProductEntity, {
        where: { id: sku.productId, status: 'on_sale' },
      });
      if (!product) throw new CoolCommException('商品不存在或已下架');
      if (sku.stock < qty) {
        throw new CoolCommException(`「${sku.skuName}」库存不足,剩余 ${sku.stock}`);
      }
      totalAmount += Number((Number(sku.price) * qty).toFixed(2));
      snapshots.push({ sku, product, qty });
      await mgr.update(ProductSkuEntity, { id: sku.id }, { stock: sku.stock - qty });
      await mgr.update(
        ProductEntity,
        { id: product.id },
        { stock: product.stock - qty }
      );
    }
    totalAmount = Number(totalAmount.toFixed(2));
    // 创建订单(雪花式 ID 手工生成)
    const orderId = this.genOrderId();
    await mgr.insert(ProductOrderEntity, {
      id: orderId,
      userId,
      orderType: 'product',
      totalAmount,
      paidAmount: 0,
      discountAmount: 0,
      status: 'pending',
      remark,
    } as any);
    // 明细快照(逐行)
    for (const s of snapshots) {
      const subTotal = Number((Number(s.sku.price) * s.qty).toFixed(2));
      await mgr.insert(ProductOrderItemEntity, {
        orderId,
        productId: s.product.id,
        skuId: s.sku.id,
        productName: s.product.title,
        skuName: s.sku.skuName,
        image: s.product.mainImage,
        price: s.sku.price,
        quantity: s.qty,
        totalAmount: subTotal,
      } as any);
    }
    // 收货信息快照
    await mgr.insert(ProductOrderLogisticsEntity, {
      orderId,
      consignee,
      phone,
      province: province || '',
      city: city || '',
      district: district || '',
      detail,
      shippingFee: 0,
    } as any);
    return orderId;
  }

  /** 模拟支付(演示):pending → paid,累计销量 */
  @CoolTransaction({ connectionName: 'default' })
  async payMock(userId: number, orderId: number, queryRunner?: QueryRunner) {
    const mgr = queryRunner.manager;
    const order = await mgr.findOneBy(ProductOrderEntity, { id: orderId });
    if (!order || order.userId !== userId) {
      throw new CoolCommException('订单不存在');
    }
    if (order.status !== 'pending') {
      throw new CoolCommException('当前状态不可支付');
    }
    await mgr.update(
      ProductOrderEntity,
      { id: orderId },
      {
        status: 'paid',
        paidAmount: order.totalAmount,
        paymentMethod: 'wechat',
        paymentNo: 'MOCK' + Date.now(),
        paidAt: new Date(),
      }
    );
    // 支付成功累加销量
    const items = await mgr.findBy(ProductOrderItemEntity, { orderId });
    for (const it of items) {
      if (it.skuId) {
        const sku = await mgr.findOneBy(ProductSkuEntity, { id: it.skuId });
        if (sku) {
          await mgr.update(
            ProductSkuEntity,
            { id: sku.id },
            { sales: sku.sales + it.quantity }
          );
        }
      }
      const product = await mgr.findOneBy(ProductEntity, { id: it.productId });
      if (product) {
        await mgr.update(
          ProductEntity,
          { id: product.id },
          { sales: product.sales + it.quantity }
        );
      }
    }
  }

  /** 取消订单:仅 pending 可取消,回补库存 */
  @CoolTransaction({ connectionName: 'default' })
  async cancel(userId: number, orderId: number, queryRunner?: QueryRunner) {
    const mgr = queryRunner.manager;
    const order = await mgr.findOneBy(ProductOrderEntity, { id: orderId });
    if (!order || order.userId !== userId) {
      throw new CoolCommException('订单不存在');
    }
    if (order.status !== 'pending') {
      throw new CoolCommException('当前状态不可取消');
    }
    await mgr.update(
      ProductOrderEntity,
      { id: orderId },
      { status: 'cancelled', cancelledAt: new Date() }
    );
    // 回补库存
    const items = await mgr.findBy(ProductOrderItemEntity, { orderId });
    for (const it of items) {
      if (it.skuId) {
        const sku = await mgr.findOneBy(ProductSkuEntity, { id: it.skuId });
        if (sku) {
          await mgr.update(
            ProductSkuEntity,
            { id: sku.id },
            { stock: sku.stock + it.quantity }
          );
        }
      }
      const product = await mgr.findOneBy(ProductEntity, { id: it.productId });
      if (product) {
        await mgr.update(
          ProductEntity,
          { id: product.id },
          { stock: product.stock + it.quantity }
        );
      }
    }
  }

  /** 确认收货:paid → completed */
  @CoolTransaction({ connectionName: 'default' })
  async confirm(userId: number, orderId: number, queryRunner?: QueryRunner) {
    const mgr = queryRunner.manager;
    const order = await mgr.findOneBy(ProductOrderEntity, { id: orderId });
    if (!order || order.userId !== userId) {
      throw new CoolCommException('订单不存在');
    }
    if (order.status !== 'paid') {
      throw new CoolCommException('当前状态不可确认收货');
    }
    await mgr.update(
      ProductOrderEntity,
      { id: orderId },
      { status: 'completed', completedAt: new Date() }
    );
  }

  /** 我的订单(分页,含明细与收货摘要) */
  async myList(userId: number, page: number, size: number) {
    const offset = (page - 1) * size;
    const rows: any[] = await this.nativeQuery(
      `SELECT id, order_type, total_amount, status, remark, paid_at, cancelled_at, created_at
       FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT ?,?`,
      [userId, offset, size]
    );
    const totalRows: any[] = await this.nativeQuery(
      `SELECT COUNT(*) total FROM orders WHERE user_id = ?`,
      [userId]
    );
    const list: any[] = [];
    for (const r of rows) {
      const items: any[] = await this.nativeQuery(
        `SELECT product_id, sku_id, product_name, sku_name, image, price, quantity, total_amount
         FROM product_order_items WHERE order_id = ?`,
        [r.id]
      );
      const logistics: any[] = await this.nativeQuery(
        `SELECT consignee, phone, detail FROM product_order_logistics WHERE order_id = ?`,
        [r.id]
      );
      list.push({
        id: Number(r.id),
        order_type: r.order_type,
        total_amount: Number(r.total_amount),
        status: r.status,
        remark: r.remark,
        paid_at: r.paid_at,
        cancelled_at: r.cancelled_at,
        created_at: r.created_at,
        items: items.map((i) => ({
          ...i,
          product_id: Number(i.product_id),
          sku_id: i.sku_id === null || i.sku_id === undefined ? null : Number(i.sku_id),
          price: Number(i.price),
          total_amount: Number(i.total_amount),
        })),
        logistics: logistics[0] || null,
      });
    }
    return {
      list,
      pagination: { page, size, total: Number(totalRows[0]?.total || 0) },
    };
  }
}
