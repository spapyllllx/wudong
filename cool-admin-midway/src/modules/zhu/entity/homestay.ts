import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('zhu_homestay')
export class ZhuHomestayEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商家ID（关联app_user.id）' })
  merchantId: number;

  @Column({ comment: '民宿名称', length: 100 })
  name: string;

  @Column({ comment: '主图' })
  mainImage: string;

  @Column({ comment: '民宿图片JSON数组', nullable: true, type: 'json', transformer: transformerJson })
  images: string[];

  @Column({ comment: '地址', length: 255 })
  address: string;

  @Column({ comment: '纬度', nullable: true, type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ comment: '经度', nullable: true, type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ comment: '联系电话', nullable: true, length: 20 })
  phone: string;

  @Column({ comment: '风格标签JSON', nullable: true, type: 'json', transformer: transformerJson })
  styleTags: string[];

  @Column({ comment: '设施标签JSON', nullable: true, type: 'json', transformer: transformerJson })
  facilityTags: string[];

  @Column({ comment: '民宿介绍', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '入住时间', default: '14:00' })
  checkInTime: string;

  @Column({ comment: '离店时间', default: '12:00' })
  checkOutTime: string;

  @Column({ comment: '入住须知', type: 'text', nullable: true })
  policies: string;

  @Column({ comment: '评分', type: 'decimal', precision: 3, scale: 2, default: 5.00 })
  rating: number;

  @Column({ comment: '评价数', default: 0 })
  reviewCount: number;

  @Column({ comment: '状态', default: 'active' })
  status: string;

  @Column({ comment: '删除时间', nullable: true, type: 'datetime' })
  deleteTime: Date;
}