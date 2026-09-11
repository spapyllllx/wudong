import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 餐厅表
 */
@Entity('restaurant')
export class RestaurantEntity extends BaseEntity {
  @Column({ comment: '餐厅名称' })
  name: string;

  @Column({ comment: '封面图' })
  cover: string;

  @Column({ comment: '餐厅图片（多张）', type: 'text', nullable: true })
  images: string;

  @Column({ comment: '餐厅简介', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '详细地址' })
  address: string;

  @Column({ comment: '省' })
  province: string;

  @Column({ comment: '市' })
  city: string;

  @Column({ comment: '区' })
  district: string;

  @Column({ comment: '联系电话' })
  phone: string;

  @Column({ comment: '营业时间', nullable: true })
  businessHours: string;

  @Column({ comment: '人均消费', type: 'decimal', precision: 10, scale: 2, default: 0 })
  avgPrice: number;

  @Column({ comment: '评分', type: 'decimal', precision: 3, scale: 1, default: 5.0 })
  rating: number;

  @Column({ comment: '标签', nullable: true })
  tags: string;

  @Column({ comment: '设施服务', type: 'text', nullable: true })
  facilities: string;

  @Index()
  @Column({ comment: '状态 0-下架 1-上架', default: 1 })
  status: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '浏览量', default: 0 })
  viewCount: number;

  @Column({ comment: '订单量', default: 0 })
  orderCount: number;
}
