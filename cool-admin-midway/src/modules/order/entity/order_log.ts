import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 订单日志表
 */
@Entity('order_log')
export class OrderLogEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单ID' })
  orderId: number;

  @Index()
  @Column({ comment: '订单号' })
  orderNo: string;

  @Column({ comment: '操作类型' })
  operateType: string;

  @Column({ comment: '操作内容' })
  operateContent: string;

  @Column({ comment: '操作人ID', nullable: true })
  operatorId: number;

  @Column({ comment: '操作人姓名', nullable: true })
  operatorName: string;
}
