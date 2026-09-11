import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 评价点赞表
 */
@Entity('product_review_like')
export class ProductReviewLikeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '评价ID' })
  reviewId: number;
}
