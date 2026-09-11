import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 票务订单表
 */
@Entity('ticket_order')
export class TicketOrderEntity extends BaseEntity {
  @Column({ comment: '订单号', unique: true })
  orderNo: string;

  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '景点ID' })
  attractionId: number;

  @Column({ comment: '景点名称' })
  attractionName: string;

  @Column({ comment: '票型ID' })
  ticketTypeId: number;

  @Column({ comment: '票型名称' })
  ticketTypeName: string;

  @Column({ comment: '购买数量' })
  quantity: number;

  @Index()
  @Column({ comment: '使用日期' })
  useDate: string;

  @Column({ comment: '联系人' })
  contactName: string;

  @Column({ comment: '联系电话' })
  contactPhone: string;

  @Column({ comment: '身份证号' })
  contactIdCard: string;

  @Column({ comment: '订单总金额', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ comment: '实付金额', type: 'decimal', precision: 10, scale: 2 })
  payAmount: number;

  @Column({ comment: '备注', nullable: true })
  remark: string;

  @Index()
  @Column({ comment: '状态 0-待付款 1-待使用 2-已使用 3-已完成 4-已取消 5-已退款', default: 0 })
  status: number;

  @Column({ comment: '支付状态 0-未支付 1-已支付', default: 0 })
  payStatus: number;

  @Column({ comment: '支付时间', nullable: true })
  payTime: string;

  @Column({ comment: '使用时间', nullable: true })
  useTime: string;

  @Column({ comment: '退款时间', nullable: true })
  refundTime: string;

  @Column({ comment: '退款原因', nullable: true })
  refundReason: string;

  @Column({ comment: '取消原因', nullable: true })
  cancelReason: string;

  @Column({ comment: '二维码', nullable: true })
  qrCode: string;
}
