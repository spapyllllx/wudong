import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 餐厅预订表
 */
@Entity('restaurant_booking')
export class RestaurantBookingEntity extends BaseEntity {
  @Column({ comment: '预订号', unique: true })
  bookingNo: string;

  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '餐厅ID' })
  restaurantId: number;

  @Column({ comment: '餐厅名称' })
  restaurantName: string;

  @Column({ comment: '预订日期' })
  bookingDate: string;

  @Column({ comment: '预订时间' })
  bookingTime: string;

  @Column({ comment: '就餐人数' })
  peopleCount: number;

  @Column({ comment: '联系人' })
  contactName: string;

  @Column({ comment: '联系电话' })
  contactPhone: string;

  @Column({ comment: '备注', nullable: true })
  remark: string;

  @Index()
  @Column({ comment: '状态 0-待确认 1-已确认 2-已完成 3-已取消', default: 0 })
  status: number;

  @Column({ comment: '取消原因', nullable: true })
  cancelReason: string;
}
