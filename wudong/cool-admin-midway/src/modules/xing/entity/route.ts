import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 路线套餐表
 */
@Entity('xing_route')
export class XingRouteEntity extends BaseEntity {
  @Column({ comment: '路线标题', length: 100 })
  title: string;

  @Column({ comment: '天数' })
  days: number;

  @Column({ comment: '封面图URL', nullable: true })
  coverImage: string;

  @Column({ comment: '售价（元）', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '原价（元）', type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column({ comment: '路线描述', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '包含内容，逗号分隔', length: 500, nullable: true })
  includeItems: string;

  @Column({ comment: '注意事项', length: 500, nullable: true })
  note: string;

  @Column({ comment: '评分', type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ comment: '销量', default: 0 })
  sales: number;

  @Column({ comment: '状态：0禁用 1启用', default: 1 })
  status: number;
}
