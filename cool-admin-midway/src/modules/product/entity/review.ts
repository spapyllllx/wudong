import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品评价表
 */
@Entity('product_review')
export class ProductReviewEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '用户昵称', nullable: true })
  userNickName: string;

  @Column({ comment: '用户头像', nullable: true })
  userAvatar: string;

  @Column({ comment: '订单ID', nullable: true })
  orderId: number;

  @Column({ comment: '评分（1-5）', type: 'tinyint' })
  rating: number;

  @Column({ comment: '评价内容', type: 'text' })
  content: string;

  @Column({ comment: '评价图片（JSON数组）', type: 'json', nullable: true })
  images: string[];

  @Column({ comment: '购买的规格', nullable: true })
  skuName: string;

  @Column({ comment: '点赞数', default: 0 })
  likeCount: number;

  @Index()
  @Column({ comment: '状态 0-待审核 1-已发布 2-已删除', default: 1 })
  status: number;

  @Column({ comment: '商家回复', type: 'text', nullable: true })
  replyContent: string;

  @Column({ comment: '回复时间', nullable: true })
  replyTime: string;

  // 不存数据库，查询时使用
  isLiked?: boolean; // 当前用户是否点赞
}
