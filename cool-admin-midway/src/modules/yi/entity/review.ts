import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品评价
 */
@Entity('yi_product_review')
export class YiProductReviewEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单ID' })
  orderId: number;

  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Index()
  @Column({ comment: '用户ID（关联app_user.id）' })
  userId: number;

  @Column({ comment: '评分 1-5' })
  rating: number;

  @Column({ comment: '评价内容', length: 500, nullable: true })
  content: string;

  @Column({ comment: '评价图片JSON数组', nullable: true, type: 'json', transformer: transformerJson })
  images: string[];

  @Column({ comment: '商家回复', length: 500, nullable: true })
  replyContent: string;

  @Column({ comment: '回复时间', nullable: true, type: 'datetime' })
  repliedAt: Date;
}