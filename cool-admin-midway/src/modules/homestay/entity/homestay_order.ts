import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 住宿订单表
 */
@Entity('homestay_order')
export class HomestayOrderEntity extends BaseEntity {
  @Column({ comment: '订单号', unique: true })
  orderNo: string;

  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '民宿ID' })
  homestayId: number;

  @Column({ comment: '民宿名称' })
  homestayName: string;

  @Column({ comment: '房型ID' })
  roomTypeId: number;

  @Column({ comment: '房型名称' })
  roomTypeName: string;

  @Index()
  @Column({ comment: '入住日期' })
  checkInDate: string;

  @Column({ comment: '退房日期' })
  checkOutDate: string;

  @Column({ comment: '入住天数' })
  nights: number;

  @Column({ comment: '房间数' })
  roomCount: number;

  @Column({ comment: '入住人数' })
  guestCount: number;

  @Column({ comment: '联系人' })
  contactName: string;

  @Column({ comment: '联系电话' })
  contactPhone: string;

  @Column({ comment: '订单总金额', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ comment: '实付金额', type: 'decimal', precision: 10, scale: 2 })
  payAmount: number;

  @Column({ comment: '备注', nullable: true })
  remark: string;

  @Index()
  @Column({ comment: '状态 0-待付款 1-待入住 2-已入住 3-已完成 4-已取消', default: 0 })
  status: number;

  @Column({ comment: '支付状态 0-未支付 1-已支付', default: 0 })
  payStatus: number;

  @Column({ comment: '支付时间', nullable: true })
  payTime: string;

  @Column({ comment: '取消原因', nullable: true })
  cancelReason: string;
}
