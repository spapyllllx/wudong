import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { transformerDecimal, transformerInt, transformerJson, transformerTime } from './common';

/**
 * 退款申请表 order_refunds(设计文档 3.2.7)
 * 公共订单配套,衣模块先行落地(见 clothing_common_module.sql 注释)。
 */
@Entity('order_refunds')
export class ProductRefundEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: 'ID' })
  id: number;

  @Index('idx_order_id')
  @Column({
    name: 'order_id',
    type: 'bigint',
    transformer: transformerInt,
    comment: '订单ID',
  })
  orderId: number;

  @Index('idx_user_id')
  @Column({
    name: 'user_id',
    type: 'bigint',
    transformer: transformerInt,
    comment: '用户ID',
  })
  userId: number;

  @Column({
    name: 'refund_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: transformerDecimal,
    comment: '退款金额',
  })
  refundAmount: number;

  @Column({ name: 'reason', length: 500, comment: '退款原因' })
  reason: string;

  @Column({
    name: 'images',
    type: 'json',
    nullable: true,
    transformer: transformerJson,
    comment: '凭证图片',
  })
  images: any;

  @Index('idx_status')
  @Column({
    name: 'status',
    length: 20,
    default: 'pending',
    comment: 'pending/approved/rejected/completed',
  })
  status: string;

  @Column({
    name: 'reject_reason',
    length: 255,
    nullable: true,
    comment: '驳回原因',
  })
  rejectReason: string;

  @Column({
    name: 'handler_id',
    type: 'bigint',
    nullable: true,
    transformer: transformerInt,
    comment: '处理人ID',
  })
  handlerId: number;

  @Column({
    name: 'handled_at',
    type: 'datetime',
    nullable: true,
    transformer: transformerTime,
    comment: '处理时间',
  })
  handledAt: Date;

  @Column({
    name: 'refund_no',
    length: 100,
    nullable: true,
    comment: '退款流水号',
  })
  refundNo: string;

  @Column({
    name: 'refunded_at',
    type: 'datetime',
    nullable: true,
    transformer: transformerTime,
    comment: '退款完成时间',
  })
  refundedAt: Date;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: transformerTime,
    comment: '创建时间',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: transformerTime,
    comment: '更新时间',
  })
  updatedAt: Date;
}
