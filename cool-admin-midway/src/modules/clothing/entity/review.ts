import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { transformerInt, transformerJson, transformerTime } from './common';

/**
 * 商品评价表 product_reviews
 * 对应技术文档 2026-09-08-wudong-tourist-platform-design.md 3.2.2
 */
@Entity('product_reviews')
export class ProductReviewEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: 'ID' })
  id: number;

  @Index('idx_order_id')
  @Column({
    name: 'order_id',
    type: 'bigint',
    transformer: transformerInt,
    comment: '订单ID',
  })
  orderId: number;

  @Index('idx_product_id')
  @Column({
    name: 'product_id',
    type: 'bigint',
    transformer: transformerInt,
    comment: '商品ID',
  })
  productId: number;

  @Index('idx_user_id')
  @Column({
    name: 'user_id',
    type: 'bigint',
    transformer: transformerInt,
    comment: '用户ID',
  })
  userId: number;

  @Column({ name: 'rating', type: 'tinyint', comment: '评分 1-5' })
  rating: number;

  @Column({
    name: 'content',
    length: 500,
    default: '',
    nullable: true,
    comment: '评价内容',
  })
  content: string;

  @Column({
    name: 'images',
    type: 'json',
    nullable: true,
    transformer: transformerJson,
    comment: '评价图片JSON数组',
  })
  images: any;

  @Column({
    name: 'reply_content',
    length: 500,
    nullable: true,
    comment: '商家回复',
  })
  replyContent: string;

  @Column({
    name: 'replied_at',
    type: 'datetime',
    nullable: true,
    transformer: transformerTime,
    comment: '回复时间',
  })
  repliedAt: Date;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: transformerTime,
    comment: '创建时间',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: transformerTime,
    comment: '更新时间',
  })
  updatedAt: Date;
}
