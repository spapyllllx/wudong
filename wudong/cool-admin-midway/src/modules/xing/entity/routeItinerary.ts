import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 路线行程表
 */
@Entity('xing_route_itinerary')
export class XingRouteItineraryEntity extends BaseEntity {
  @Index()
  @Column({ comment: '所属路线ID' })
  routeId: number;

  @Column({ comment: '第几天（从1起）' })
  dayNumber: number;

  @Column({ comment: '行程描述', type: 'text' })
  description: string;
}
