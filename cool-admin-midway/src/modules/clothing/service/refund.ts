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
 * 状态:pending → approved(订单置 refunded,回补库存、回退销量)→ 终态
 *              → rejected(可重新申请)
 * 当前实现为"仅支持全额退款"(approve 即视为退款完成,无退货寄回分支)。
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
    // 仅支持全额退款:缺省按实付全额;显式传金额必须等于实付,否则拒绝
    // (此前允许任意部分金额,但审核按全额回补库存/置 refunded,三方不一致)
    const paidAmount = Number(order.paidAmount) || 0;
    let refundAmount = paidAmount;
    if (amount !== undefined && amount !== null && amount !== '') {
      const given = Number(amount);
      if (!Number.isFinite(given) || given <= 0) {
        throw new CoolCommException('退款金额不正确');
      }
      if (Math.abs(Number(given.toFixed(2)) - paidAmount) > 0.001) {
        throw new CoolCommException('当前仅支持全额退款');
      }
      refundAmount = paidAmount;
    }
    const res = await mgr.insert(ProductRefundEntity, {
      orderId,
      userId,
      refundAmount,
      reason: reason.trim().slice(0, 500),
      status: 'pending',
    } as any);
    return res.identifiers[0].id;
  }

  /** 我的退款申请列表 */
  async myList(userId: number, page: number, size: number) {
    const offset = (page - 1) * size;
    const rows: any[] = await this.nativeQuery(
      `SELECT id, order_id, refund_amount, reason, status, reject_reason,
              DATE_FORMAT(handled_at, '%Y-%m-%d %H:%i:%s') handled_at,
              DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') created_at
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

  /** 数值列原子累加(与订单服务一致的并发安全写法) */
  private async incrCols(
    mgr: QueryRunner['manager'],
    entity: any,
    id: number,
    cols: { stock?: number; sales?: number }
  ) {
    const set: any = {};
    if (cols.stock !== undefined) set.stock = () => `stock + ${cols.stock}`;
    if (cols.sales !== undefined) {
      // 销量回退不允出现负数(与支付累加对称)
      set.sales = () => `GREATEST(sales - ${cols.sales}, 0)`;
    }
    if (!Object.keys(set).length) return;
    await mgr
      .createQueryBuilder()
      .update(entity)
      .set(set)
      .where('id = :id', { id })
      .execute();
  }

  /** 商家/平台审核通过:订单置 refunded、回补库存、回退销量(条件更新防并发重复审核) */
  @CoolTransaction({ connectionName: 'default' })
  async approve(id: number, handlerId: number, queryRunner?: QueryRunner) {
    const mgr = queryRunner.manager;
    const refund = await mgr.findOneBy(ProductRefundEntity, { id });
    if (!refund || refund.status !== 'pending') {
      throw new CoolCommException('退款单不存在或已处理');
    }
    // 条件更新:仅 pending → approved,并发重复审核只有一个成功
    const res = await mgr
      .createQueryBuilder()
      .update(ProductRefundEntity)
      .set({
        status: 'approved',
        handlerId,
        handledAt: new Date(),
        refundNo: 'RF' + Date.now(),
        refundedAt: new Date(),
      })
      .where('id = :id AND status = :st', { id, st: 'pending' })
      .execute();
    if (!res.affected) {
      throw new CoolCommException('退款单已处理,请勿重复操作');
    }
    // 订单置为已退款(仅 paid/completed 可迁移)
    const r2 = await mgr
      .createQueryBuilder()
      .update(ProductOrderEntity)
      .set({ status: 'refunded' })
      .where('id = :id AND status IN (:...sts)', {
        id: refund.orderId,
        sts: ['paid', 'completed'],
      })
      .execute();
    if (!r2.affected) {
      throw new CoolCommException('订单状态已变更,退款失败');
    }
    // 回补库存 + 回退销量(SQL 自增/下限保护,SKU 与商品同步)
    const items = await mgr.findBy(ProductOrderItemEntity, { orderId: refund.orderId });
    for (const it of items) {
      if (it.skuId) {
        await this.incrCols(mgr, ProductSkuEntity, it.skuId, {
          stock: it.quantity,
          sales: it.quantity,
        });
      }
      await this.incrCols(mgr, ProductEntity, it.productId, {
        stock: it.quantity,
        sales: it.quantity,
      });
    }
  }

  /** 审核驳回(原因截断到实体列长度,防 DB 报错) */
  @CoolTransaction({ connectionName: 'default' })
  async reject(id: number, handlerId: number, reason: string, queryRunner?: QueryRunner) {
    const mgr = queryRunner.manager;
    const refund = await mgr.findOneBy(ProductRefundEntity, { id });
    if (!refund || refund.status !== 'pending') {
      throw new CoolCommException('退款单不存在或已处理');
    }
    const res = await mgr
      .createQueryBuilder()
      .update(ProductRefundEntity)
      .set({
        status: 'rejected',
        handlerId,
        handledAt: new Date(),
        rejectReason: (reason?.trim() || '未通过审核').slice(0, 255),
      })
      .where('id = :id AND status = :st', { id, st: 'pending' })
      .execute();
    if (!res.affected) {
      throw new CoolCommException('退款单已处理,请勿重复操作');
    }
  }
}
