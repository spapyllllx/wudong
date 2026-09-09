import { BaseService, CoolCommException, CoolTransaction } from '@cool-midway/core';
import { Init, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { ProductEntity } from '../entity/product';
import { ProductSkuEntity } from '../entity/sku';
import { ProductOrderEntity } from '../entity/order';
import { ProductOrderItemEntity } from '../entity/orderItem';
import { ProductRefundEntity } from '../entity/refund';

/**
 * 退款(衣订单)
 * 状态:pending → approved(订单置 refunded,回补库存)→ completed
 *              → rejected(可重新申请)
 */
@Provide()
export class ClothingRefundService extends BaseService {
  @InjectEntityModel(ProductRefundEntity)
  refundEntity: Repository<ProductRefundEntity>;

  @InjectEntityModel(ProductOrderEntity)
  orderEntity: Repository<ProductOrderEntity>;

  @InjectEntityModel(ProductOrderItemEntity)
  itemEntity: Repository<ProductOrderItemEntity>;

  @InjectEntityModel(ProductEntity)
  productEntity: Repository<ProductEntity>;

  @InjectEntityModel(ProductSkuEntity)
  skuEntity: Repository<ProductSkuEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.refundEntity);
  }

  /** 用户申请退款(paid/completed 订单,已有申请中/通过的单不可重复) */
  @CoolTransaction({ connectionName: 'default' })
  async apply(userId: number, body: any, queryRunner?: QueryRunner) {
    const { orderId, reason, amount } = body || {};
    if (!orderId || !reason?.trim()) {
      throw new CoolCommException('请填写退款原因');
    }
    const mgr = queryRunner.manager;
    const order = await mgr.findOneBy(ProductOrderEntity, { id: orderId });
    if (!order || order.userId !== userId) {
      throw new CoolCommException('订单不存在或不属于当前用户');
    }
    if (!['paid', 'completed'].includes(order.status)) {
      throw new CoolCommException('当前状态不可申请退款');
    }
    const exists = await mgr.findOneBy(ProductRefundEntity, {
      orderId,
      status: 'pending',
    });
    if (exists) throw new CoolCommException('退款申请处理中,请勿重复提交');
    const approved = await mgr.findOneBy(ProductRefundEntity, {
      orderId,
      status: 'approved',
    });
    if (approved) throw new CoolCommException('该订单已在退款流程中');
    const refundAmount = Number(amount) > 0 ? Number(Number(amount).toFixed(2)) : Number(order.paidAmount);
    if (refundAmount <= 0 || refundAmount > Number(order.paidAmount)) {
      throw new CoolCommException('退款金额不正确');
    }
    const res = await mgr.insert(ProductRefundEntity, {
      orderId,
      userId,
      refundAmount,
      reason: reason.trim(),
      status: 'pending',
    } as any);
    return res.identifiers[0].id;
  }

  /** 我的退款申请列表 */
  async myList(userId: number, page: number, size: number) {
    const offset = (page - 1) * size;
    const rows: any[] = await this.nativeQuery(
      `SELECT id, order_id, refund_amount, reason, status, reject_reason, handled_at, created_at
       FROM order_refunds WHERE user_id = ? ORDER BY id DESC LIMIT ?,?`,
      [userId, offset, size]
    );
    const totalRows: any[] = await this.nativeQuery(
      `SELECT COUNT(*) total FROM order_refunds WHERE user_id = ?`,
      [userId]
    );
    return {
      list: rows.map((r: any) => ({
        id: Number(r.id),
        order_id: Number(r.order_id),
        refund_amount: Number(r.refund_amount),
        reason: r.reason,
        status: r.status,
        reject_reason: r.reject_reason,
        handled_at: r.handled_at,
        created_at: r.created_at,
      })),
      pagination: { page, size, total: Number(totalRows[0]?.total || 0) },
    };
  }

  /** 商家/平台审核通过:订单置 refunded 并回补库存 */
  @CoolTransaction({ connectionName: 'default' })
  async approve(id: number, handlerId: number, queryRunner?: QueryRunner) {
    const mgr = queryRunner.manager;
    const refund = await mgr.findOneBy(ProductRefundEntity, { id });
    if (!refund || refund.status !== 'pending') {
      throw new CoolCommException('退款单不存在或已处理');
    }
    await mgr.update(
      ProductRefundEntity,
      { id },
      {
        status: 'approved',
        handlerId,
        handledAt: new Date(),
        refundNo: 'RF' + Date.now(),
        refundedAt: new Date(),
      }
    );
    // 订单置为已退款
    const order = await mgr.findOneBy(ProductOrderEntity, { id: refund.orderId });
    if (order && order.status !== 'cancelled') {
      await mgr.update(ProductOrderEntity, { id: order.id }, { status: 'refunded' });
    }
    // 回补库存(SKU + 商品)
    const items = await mgr.findBy(ProductOrderItemEntity, { orderId: refund.orderId });
    for (const it of items) {
      if (it.skuId) {
        const sku = await mgr.findOneBy(ProductSkuEntity, { id: it.skuId });
        if (sku) {
          await mgr.update(ProductSkuEntity, { id: sku.id }, { stock: sku.stock + it.quantity });
        }
      }
      const product = await mgr.findOneBy(ProductEntity, { id: it.productId });
      if (product) {
        await mgr.update(ProductEntity, { id: product.id }, { stock: product.stock + it.quantity });
      }
    }
  }

  /** 审核驳回 */
  @CoolTransaction({ connectionName: 'default' })
  async reject(id: number, handlerId: number, reason: string, queryRunner?: QueryRunner) {
    const mgr = queryRunner.manager;
    const refund = await mgr.findOneBy(ProductRefundEntity, { id });
    if (!refund || refund.status !== 'pending') {
      throw new CoolCommException('退款单不存在或已处理');
    }
    await mgr.update(
      ProductRefundEntity,
      { id },
      {
        status: 'rejected',
        handlerId,
        handledAt: new Date(),
        rejectReason: reason?.trim() || '未通过审核',
      }
    );
  }
}
