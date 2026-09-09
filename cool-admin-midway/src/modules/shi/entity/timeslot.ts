import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shi_restaurant_timeslot')
export class ShiRestaurantTimeslotEntity extends BaseEntity {
  @Index()
  @Column({ comment: '餐厅ID' })
  restaurantId: number;

  @Column({ comment: '时段名称', length: 50 })
  name: string;

  @Column({ comment: '开始时间', type: 'time' })
  startTime: Date;

  @Column({ comment: '结束时间', type: 'time' })
  endTime: Date;

  @Column({ comment: '最大预订数' })
  maxBookings: number;

  @Column({ comment: '状态', default: 'active' })
  status: string;
}