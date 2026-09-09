import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shi_restaurant_booking')
export class ShiRestaurantBookingEntity extends BaseEntity {
  @Column({ comment: '关联订单ID' })
  orderId: number;

  @Index()
  @Column({ comment: '餐厅ID' })
  restaurantId: number;

  @Column({ comment: '时段ID' })
  timeslotId: number;

  @Index()
  @Column({ comment: '用户ID（关联app_user.id）' })
  userId: number;

  @Column({ comment: '预订日期', type: 'date' })
  bookingDate: Date;

  @Column({ comment: '人数' })
  peopleCount: number;

  @Column({ comment: '预订人姓名', length: 50 })
  consignee: string;

  @Column({ comment: '联系电话', length: 11 })
  phone: string;

  @Column({ comment: '备注', length: 255, nullable: true })
  remark: string;

  @Column({ comment: '状态', default: 'pending' })
  status: string;
}