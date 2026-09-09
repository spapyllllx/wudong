import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { transformerDecimal, transformerJson, transformerTime } from './common';

/**
 * 商品SKU表 product_skus
 * 对应技术文档 2026-09-08-wudong-tourist-platform-design.md 3.2.2
 */
@Entity('product_skus')
export class ProductSkuEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: 'ID' })
  id: number;

  @Index('idx_product_id')
  @Column({ name: 'product_id', type: 'bigint', comment: '商品ID' })
  productId: number;

  @Column({
    name: 'sku_name',
    length: 100,
    comment: 'SKU名称，如"银饰-手镯-中号"',
  })
  skuName: string;

  @Column({
    name: 'image',
    length: 255,
    nullable: true,
    comment: 'SKU图片',
  })
  image: string;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: transformerDecimal,
    comment: '价格',
  })
  price: number;

  @Column({ name: 'stock', type: 'int', default: 0, comment: '库存' })
  stock: number;

  @Column({ name: 'sales', type: 'int', default: 0, comment: '销量' })
  sales: number;

  @Column({
    name: 'attrs',
    type: 'json',
    nullable: true,
    transformer: transformerJson,
    comment: 'SKU属性JSON，如{"尺寸":"中号","颜色":"银色"}',
  })
  attrs: any;

  @Column({ name: 'status', length: 20, default: 'active', comment: '状态' })
  status: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    transformer: transformerTime,
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    transformer: transformerTime,
    comment: '更新时间',
  })
  updatedAt: Date;
}
