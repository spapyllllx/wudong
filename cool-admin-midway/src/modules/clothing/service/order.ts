import {
  BaseService,
  CoolCommException,
  CoolTransaction,
} from '@cool-midway/core';
import { Init, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { ProductEntity } from '../entity/product';
import { ProductSkuEntity } from '../entity/sku';
import { ProductOrderEntity } from '../entity/order';
import { ProductOrderItemEntity } from '../entity/orderItem';
import { ProductOrderLogisticsEntity } from '../entity/orderLogistics';

/**
 * 商品订单(衣)
 * 设计文档 3.2.7 统一订单先行落地(product 类型),状态机:
 * pending →(模拟支付)paid →(商家发货)shipped →(确认收货)completed
 * pending 可取消→cancelled(回补库存);paid/completed 可申请退款(同意→refunded 并回补库存)
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

  /** 数值列原子累加(并发安全;替代"读旧值写绝对值",防丢更新) */
  private async incrCols(
    mgr: EntityManager,
    entity: any,
    id: number,
    cols: { stock?: number; sales?: number }
  ) {
    const set: any = {};
    if (cols.stock !== undefined) set.stock = () => `stock + ${cols.stock}`;
    if (cols.sales !== undefined) set.sales = () => `sales + ${cols.sales}`;
    if (!Object.keys(set).length) return;
    await mgr
      .createQueryBuilder()
      .update(entity)
      .set(set)
      .where('id = :id', { id })
      .execute();
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
    // 长度/格式防线(实体列有长度,超长会抛英文 DB 报错,这里提前给中文提示)
    const cname = String(consignee).trim();
    const phoneStr = String(phone).trim();
    const detailStr = String(detail).trim();
    if (!/^1\d{10}$/.test(phoneStr)) {
      throw new CoolCommException('手机号格式不正确(需 11 位数字)');
    }
    if (cname.length > 50 || detailStr.length > 255) {
      throw new CoolCommException('收货人或详细地址过长');
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
      // 商品行同样加行锁,避免不同 SKU 并发下单时总库存丢更新
      const product = await mgr.findOne(ProductEntity, {
        where: { id: sku.productId, status: 'on_sale' },
        lock: { mode: 'pessimistic_write' },
      });
      if (!product) throw new CoolCommException('商品不存在或已下架');
      if (sku.stock < qty) {
        throw new CoolCommException(`「${sku.skuName}」库存不足,剩余 ${sku.stock}`);
      }
      // 总库存下限防线(正常与 SKU 之和同步;防管理端未同步时扣成负数)
      if (product.stock < qty) {
        throw new CoolCommException(`「${product.title}」库存不足,请联系管理员`);
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
    // 收货信息快照(长度与实体列对齐)
    const pad = (v: string) => String(v || '').trim().slice(0, 50);
    await mgr.insert(ProductOrderLogisticsEntity, {
      orderId,
      consignee: cname,
      phone: phoneStr,
      province: pad(province),
      city: pad(city),
      district: pad(district),
      detail: detailStr,
      shippingFee: 0,
    } as any);
    return orderId;
  }

  /** 模拟支付(演示):pending → paid,累计销量(条件更新防重复/并发) */
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
    // 条件更新:仅当仍为 pending 才置 paid;并发重复请求只有一个成功
    const res = await mgr
      .createQueryBuilder()
      .update(ProductOrderEntity)
      .set({
        status: 'paid',
        paidAmount: order.totalAmount,
        paymentMethod: 'wechat',
        paymentNo: 'MOCK' + Date.now(),
        paidAt: new Date(),
      })
      .where('id = :id AND status = :st', { id: orderId, st: 'pending' })
      .execute();
    if (!res.affected) {
      throw new CoolCommException('订单状态已变更,请刷新后重试');
    }
    // 支付成功累加销量(SQL 自增,防并发丢更新;行不存在时自然跳过)
    const items = await mgr.findBy(ProductOrderItemEntity, { orderId });
    for (const it of items) {
      if (it.skuId) {
        await this.incrCols(mgr, ProductSkuEntity, it.skuId, {
          sales: it.quantity,
        });
      }
      await this.incrCols(mgr, ProductEntity, it.productId, {
        sales: it.quantity,
      });
    }
  }

  /** 取消订单:仅 pending 可取消,回补库存(条件更新防重复回补) */
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
    const res = await mgr
      .createQueryBuilder()
      .update(ProductOrderEntity)
      .set({ status: 'cancelled', cancelledAt: new Date() })
      .where('id = :id AND status = :st', { id: orderId, st: 'pending' })
      .execute();
    if (!res.affected) {
      throw new CoolCommException('订单状态已变更,请刷新后重试');
    }
    // 回补库存(SQL 自增,只回补这一次取消真正生效的数量)
    const items = await mgr.findBy(ProductOrderItemEntity, { orderId });
    for (const it of items) {
      if (it.skuId) {
        await this.incrCols(mgr, ProductSkuEntity, it.skuId, {
          stock: it.quantity,
        });
      }
      await this.incrCols(mgr, ProductEntity, it.productId, {
        stock: it.quantity,
      });
    }
  }

  /** 确认收货:shipped → completed,同时落物流收货时间(商家发货后才可确认) */
  @CoolTransaction({ connectionName: 'default' })
  async confirm(userId: number, orderId: number, queryRunner?: QueryRunner) {
    const mgr = queryRunner.manager;
    const order = await mgr.findOneBy(ProductOrderEntity, { id: orderId });
    if (!order || order.userId !== userId) {
      throw new CoolCommException('订单不存在');
    }
    if (order.status !== 'shipped') {
      throw new CoolCommException('订单发货后才能确认收货');
    }
    const res = await mgr
      .createQueryBuilder()
      .update(ProductOrderEntity)
      .set({ status: 'completed', completedAt: new Date() })
      .where('id = :id AND status = :st', { id: orderId, st: 'shipped' })
      .execute();
    if (!res.affected) {
      throw new CoolCommException('订单状态已变更,请刷新后重试');
    }
    // 同步物流表收货时间(此前 shipped_at/received_at 收发货闭环不完整)
    await mgr
      .createQueryBuilder()
      .update(ProductOrderLogisticsEntity)
      .set({ receivedAt: new Date() })
      .where('orderId = :orderId', { orderId })
      .execute();
  }

  /**
   * 商家发货(admin):写物流公司/单号与发货时间,并将订单推进到 shipped
   * (修复:此前只写物流表不推状态,订单停在 paid,发货对买家/状态机均不可见)
   */
  @CoolTransaction({ connectionName: 'default' })
  async ship(
    orderId: number,
    logisticsCompany: string,
    logisticsNo: string,
    queryRunner?: QueryRunner
  ) {
    const mgr = queryRunner.manager;
    const order = await mgr.findOneBy(ProductOrderEntity, { id: orderId });
    if (!order || order.orderType !== 'product') {
      throw new CoolCommException('订单不存在');
    }
    if (order.status !== 'paid') {
      throw new CoolCommException('仅已支付订单可发货');
    }
    const logi = await mgr.findOneBy(ProductOrderLogisticsEntity, { orderId });
    if (!logi) throw new CoolCommException('订单收货信息缺失');
    // 服务端校验物流信息非空(此前空串直接写 NULL,仅前端挡)
    const company = logisticsCompany?.trim();
    const no = logisticsNo?.trim();
    if (!company || !no) {
      throw new CoolCommException('请填写物流公司与物流单号');
    }
    await mgr.update(
      ProductOrderLogisticsEntity,
      logi.id,
      {
        logisticsCompany: company,
        logisticsNo: no,
        shippedAt: new Date(),
      }
    );
    // 推进状态:paid → shipped(条件更新防并发重复发货)
    const res = await mgr
      .createQueryBuilder()
      .update(ProductOrderEntity)
      .set({ status: 'shipped' })
      .where('id = :id AND status = :st', { id: orderId, st: 'paid' })
      .execute();
    if (!res.affected) {
      throw new CoolCommException('订单状态已变更,请刷新后重试');
    }
  }

  /** 我的订单(分页,含明细与收货摘要) */
  async myList(userId: number, page: number, size: number) {
    const offset = (page - 1) * size;
    const rows: any[] = await this.nativeQuery(
      `SELECT id, order_type, total_amount, status, remark,
              DATE_FORMAT(paid_at, '%Y-%m-%d %H:%i:%s') paid_at,
              DATE_FORMAT(cancelled_at, '%Y-%m-%d %H:%i:%s') cancelled_at,
              DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') created_at
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
      // 收货地址 + 物流轨迹(修复:此前只查收货地址,发货后物流信息买家不可见)
      const logistics: any[] = await this.nativeQuery(
        `SELECT consignee, phone, province, city, district, detail,
                logistics_company, logistics_no,
                DATE_FORMAT(shipped_at, '%Y-%m-%d %H:%i:%s') shipped_at,
                DATE_FORMAT(received_at, '%Y-%m-%d %H:%i:%s') received_at
         FROM product_order_logistics WHERE order_id = ?`,
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
