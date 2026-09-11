import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 景点/活动表
 */
@Entity('attraction')
export class AttractionEntity extends BaseEntity {
  @Column({ comment: '景点/活动名称' })
  name: string;

  @Column({ comment: '封面图' })
  cover: string;

  @Column({ comment: '景点图片（多张）', type: 'text' })
  images: string;

  @Column({ comment: '景点简介', type: 'text' })
  description: string;

  @Column({ comment: '详细介绍', type: 'text', nullable: true })
  detailContent: string;

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

  @Column({ comment: '开放时间' })
  openTime: string;

  @Column({ comment: '最低价格', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minPrice: number;

  @Column({ comment: '评分', type: 'decimal', precision: 3, scale: 1, default: 5.0 })
  rating: number;

  @Column({ comment: '标签' })
  tags: string;

  @Column({ comment: '游玩贴士', type: 'text', nullable: true })
  tips: string;

  @Column({ comment: '交通指南', type: 'text', nullable: true })
  traffic: string;

  @Index()
  @Column({ comment: '类型 1-景点 2-活动', default: 1 })
  type: number;

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
