import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('order_refund')
export class OrderRefundEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单ID' })
  orderId: number;

  @Index()
  @Column({ comment: '用户ID（关联app_user.id）' })
  userId: number;

  @Column({ comment: '退款金额', type: 'decimal', precision: 10, scale: 2 })
  refundAmount: number;

  @Column({ comment: '退款原因', length: 500 })
  reason: string;

  @Column({ comment: '凭证图片JSON数组', nullable: true, type: 'json', transformer: transformerJson })
  images: string[];

  @Column({ comment: '状态', default: 'pending' })
  status: string;

  @Column({ comment: '拒绝原因', nullable: true, length: 255 })
  rejectReason: string;

  @Column({ comment: '处理人ID（关联base_sys_user.id）', nullable: true })
  handlerId: number;

  @Column({ comment: '处理时间', nullable: true, type: 'datetime' })
  handledAt: Date;

  @Column({ comment: '退款流水号', nullable: true, length: 100 })
  refundNo: string;

  @Column({ comment: '退款时间', nullable: true, type: 'datetime' })
  refundedAt: Date;
}