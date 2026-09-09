import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shi_restaurant')
export class ShiRestaurantEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商家ID（关联app_user.id）' })
  merchantId: number;

  @Column({ comment: '餐厅名称', length: 100 })
  name: string;

  @Column({ comment: '主图' })
  mainImage: string;

  @Column({ comment: '餐厅图片JSON数组', nullable: true, type: 'json', transformer: transformerJson })
  images: string[];

  @Column({ comment: '地址', length: 255 })
  address: string;

  @Column({ comment: '纬度', nullable: true, type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ comment: '经度', nullable: true, type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ comment: '联系电话', nullable: true, length: 20 })
  phone: string;

  @Column({ comment: '营业时间', nullable: true, length: 100 })
  businessHours: string;

  @Column({ comment: '容纳人数', default: 0 })
  capacity: number;

  @Column({ comment: '人均消费', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  avgPrice: number;

  @Column({ comment: '餐厅介绍', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '评分', type: 'decimal', precision: 3, scale: 2, default: 5.00 })
  rating: number;

  @Column({ comment: '评价数', default: 0 })
  reviewCount: number;

  @Column({ comment: '状态', default: 'active' })
  status: string;

  @Column({ comment: '删除时间', nullable: true, type: 'datetime' })
  deleteTime: Date;
}