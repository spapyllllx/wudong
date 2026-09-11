import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 民宿表
 */
@Entity('homestay')
export class HomestayEntity extends BaseEntity {
  @Column({ comment: '民宿名称' })
  name: string;

  @Column({ comment: '封面图' })
  cover: string;

  @Column({ comment: '民宿图片（多张）', type: 'text', nullable: true })
  images: string;

  @Column({ comment: '民宿简介', type: 'text', nullable: true })
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

  @Column({ comment: '最低价格', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minPrice: number;

  @Column({ comment: '评分', type: 'decimal', precision: 3, scale: 1, default: 5.0 })
  rating: number;

  @Column({ comment: '标签', nullable: true })
  tags: string;

  @Column({ comment: '设施服务', type: 'text', nullable: true })
  facilities: string;

  @Column({ comment: '入住时间', nullable: true })
  checkInTime: string;

  @Column({ comment: '退房时间', nullable: true })
  checkOutTime: string;

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
