import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('xing_scenic_spot')
export class XingScenicSpotEntity extends BaseEntity {
  @Column({ comment: '景区名称', length: 100 })
  name: string;

  @Column({ comment: '主图' })
  mainImage: string;

  @Column({ comment: '景区图片JSON数组', nullable: true, type: 'json', transformer: transformerJson })
  images: string[];

  @Column({ comment: '地址', length: 255 })
  address: string;

  @Column({ comment: '纬度', nullable: true, type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ comment: '经度', nullable: true, type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ comment: '开放时间', nullable: true, length: 100 })
  openingHours: string;

  @Column({ comment: '景区介绍', type: 'text', nullable: true })
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