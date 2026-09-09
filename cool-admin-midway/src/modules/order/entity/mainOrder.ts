import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('order_main')
export class OrderMainEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID（关联app_user.id）' })
  userId: number;

  @Column({ comment: '订单类型：product/restaurant/homestay/ticket/route', length: 20 })
  orderType: string;

  @Column({ comment: '订单总金额', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ comment: '实付金额', type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ comment: '优惠金额', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ comment: '支付方式', nullable: true, length: 50 })
  paymentMethod: string;

  @Column({ comment: '支付流水号', nullable: true, length: 100 })
  paymentNo: string;

  @Column({ comment: '状态', default: 'pending' })
  status: string;

  @Column({ comment: '订单备注', nullable: true, length: 255 })
  remark: string;

  @Column({ comment: '支付时间', nullable: true, type: 'datetime' })
  paidAt: Date;

  @Column({ comment: '完成时间', nullable: true, type: 'datetime' })
  completedAt: Date;

  @Column({ comment: '取消时间', nullable: true, type: 'datetime' })
  cancelledAt: Date;
}