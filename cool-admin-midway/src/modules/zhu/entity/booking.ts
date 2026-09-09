import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('zhu_homestay_booking')
export class ZhuHomestayBookingEntity extends BaseEntity {
  @Column({ comment: '关联订单ID' })
  orderId: number;

  @Index()
  @Column({ comment: '民宿ID' })
  homestayId: number;

  @Column({ comment: '房型ID' })
  roomTypeId: number;

  @Index()
  @Column({ comment: '用户ID（关联app_user.id）' })
  userId: number;

  @Column({ comment: '入住日期', type: 'date' })
  checkInDate: Date;

  @Column({ comment: '离店日期', type: 'date' })
  checkOutDate: Date;

  @Column({ comment: '入住天数' })
  days: number;

  @Column({ comment: '房间数' })
  roomCount: number;

  @Column({ comment: '入住人姓名', length: 50 })
  guestName: string;

  @Column({ comment: '联系电话', length: 11 })
  guestPhone: string;

  @Column({ comment: '身份证号', nullable: true, length: 18 })
  guestIdCard: string;

  @Column({ comment: '备注', length: 255, nullable: true })
  remark: string;

  @Column({ comment: '入住码', nullable: true, length: 50 })
  checkInCode: string;

  @Column({ comment: '状态', default: 'pending' })
  status: string;
}