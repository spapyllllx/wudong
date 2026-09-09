import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { transformerTime } from './common';

/**
 * 商品收藏表 product_favorites
 * 对应技术文档 2026-09-08-wudong-tourist-platform-design.md 3.2.2
 */
@Entity('product_favorites')
@Index('uk_user_product', ['userId', 'productId'], { unique: true })
export class ProductFavoriteEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: 'ID' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', comment: '用户ID' })
  userId: number;

  @Index('idx_product_id')
  @Column({ name: 'product_id', type: 'bigint', comment: '商品ID' })
  productId: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    transformer: transformerTime,
    comment: '创建时间',
  })
  createdAt: Date;
}
