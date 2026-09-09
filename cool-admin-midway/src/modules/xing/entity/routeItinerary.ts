import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('xing_route_itinerary')
export class XingRouteItineraryEntity extends BaseEntity {
  @Index()
  @Column({ comment: '路线套餐ID' })
  routePackageId: number;

  @Column({ comment: '第几天' })
  day: number;

  @Column({ comment: '当天标题', length: 100 })
  title: string;

  @Column({ comment: '行程描述', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '游览景点JSON数组', nullable: true, type: 'json', transformer: transformerJson })
  attractions: any[];

  @Column({ comment: '用餐安排JSON', nullable: true, type: 'json', transformer: transformerJson })
  meals: any;

  @Column({ comment: '住宿安排', nullable: true, length: 255 })
  accommodation: string;

  @Column({ comment: '交通方式', nullable: true, length: 255 })
  transportation: string;
}