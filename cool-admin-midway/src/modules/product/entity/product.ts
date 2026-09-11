import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品表
 */
@Entity('product')
export class ProductEntity extends BaseEntity {
  @Index()
  @Column({ comment: '分类ID' })
  categoryId: number;

  @Column({ comment: '商品标题' })
  title: string;

  @Column({ comment: '副标题', nullable: true })
  subtitle: string;

  @Column({ comment: '主图' })
  mainImage: string;

  @Column({ comment: '图片列表（JSON数组）', type: 'json', nullable: true })
  images: string[];

  @Column({ comment: '商品详情（富文本）', type: 'text', nullable: true })
  detail: string;

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    comment: '原价',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  originalPrice: number;

  @Column({ comment: '总库存', default: 0 })
  stock: number;

  @Index()
  @Column({ comment: '销量', default: 0 })
  sales: number;

  @Column({
    comment: '评分（1-5）',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 5.0,
  })
  rating: number;

  @Column({ comment: '评价数', default: 0 })
  reviewCount: number;

  @Column({ comment: '收藏数', default: 0 })
  favoriteCount: number;

  @Column({ comment: '浏览数', default: 0 })
  viewCount: number;

  @Index()
  @Column({ comment: '状态 0-下架 1-上架', default: 1 })
  status: number;

  @Column({ comment: '是否推荐 0-否 1-是', default: 0 })
  isRecommend: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  // 不存数据库，查询时使用
  isFavorited?: boolean; // 当前用户是否收藏
  categoryName?: string; // 分类名称
}
