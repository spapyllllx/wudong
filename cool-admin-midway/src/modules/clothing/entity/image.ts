import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { transformerInt, transformerTime } from './common';

/**
 * 商品图片表 product_images
 * 对应技术文档 2026-09-08-wudong-tourist-platform-design.md 3.2.2
 */
@Entity('product_images')
export class ProductImageEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: 'ID' })
  id: number;

  @Index('idx_product_id')
  @Column({
    name: 'product_id',
    type: 'bigint',
    transformer: transformerInt,
    comment: '商品ID',
  })
  productId: number;

  @Column({ name: 'url', length: 255, comment: '图片URL' })
  url: string;

  @Column({ name: 'sort', type: 'int', default: 0, comment: '排序' })
  sort: number;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: transformerTime,
    comment: '创建时间',
  })
  createdAt: Date;
}
