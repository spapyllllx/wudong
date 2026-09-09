import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('xing_route_package')
export class XingRoutePackageEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商家ID（关联app_user.id）' })
  merchantId: number;

  @Column({ comment: '路线标题', length: 100 })
  title: string;

  @Column({ comment: '主图' })
  mainImage: string;

  @Column({ comment: '图片JSON数组', nullable: true, type: 'json', transformer: transformerJson })
  images: string[];

  @Column({ comment: '天数' })
  days: number;

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '包含项目', type: 'text', nullable: true })
  includes: string;

  @Column({ comment: '不包含项目', type: 'text', nullable: true })
  excludes: string;

  @Column({ comment: '出发地', nullable: true, length: 100 })
  departurePlace: string;

  @Column({ comment: '目的地', nullable: true, length: 100 })
  destination: string;

  @Column({ comment: '主题标签JSON', nullable: true, type: 'json', transformer: transformerJson })
  themeTags: string[];

  @Column({ comment: '路线介绍', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '库存', default: 999 })
  stock: number;

  @Column({ comment: '销量', default: 0 })
  sales: number;

  @Column({ comment: '评分', type: 'decimal', precision: 3, scale: 2, default: 5.00 })
  rating: number;

  @Column({ comment: '评价数', default: 0 })
  reviewCount: number;

  @Column({ comment: '状态', default: 'active' })
  status: string;

  @Column({ comment: '删除时间', nullable: true, type: 'datetime' })
  deleteTime: Date;
}