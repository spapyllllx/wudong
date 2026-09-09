import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { transformerDecimal, transformerTime } from './common';

/**
 * 商品表 products
 * 对应技术文档 2026-09-08-wudong-tourist-platform-design.md 3.2.2
 */
@Entity('products')
@Index('idx_category', ['categoryId', 'status'])
@Index('ft_title', ['title'], { fulltext: true })
export class ProductEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: 'ID' })
  id: number;

  @Column({ name: 'category_id', type: 'bigint', comment: '分类ID' })
  categoryId: number;

  @Index('idx_merchant')
  @Column({ name: 'merchant_id', type: 'bigint', comment: '商家ID' })
  merchantId: number;

  @Column({ name: 'title', length: 255, comment: '商品标题' })
  title: string;

  @Column({
    name: 'subtitle',
    length: 255,
    default: '',
    nullable: true,
    comment: '副标题',
  })
  subtitle: string;

  @Column({ name: 'main_image', length: 255, comment: '主图' })
  mainImage: string;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: transformerDecimal,
    comment: '售价',
  })
  price: number;

  @Column({
    name: 'market_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: transformerDecimal,
    comment: '市场价',
  })
  marketPrice: number;

  @Column({ name: 'stock', type: 'int', default: 0, comment: '总库存' })
  stock: number;

  @Index('idx_sales')
  @Column({ name: 'sales', type: 'int', default: 0, comment: '销量' })
  sales: number;

  @Column({ name: 'detail', type: 'text', nullable: true, comment: '商品详情(富文本)' })
  detail: string;

  @Column({ name: 'craft_intro', type: 'text', nullable: true, comment: '工艺介绍' })
  craftIntro: string;

  @Column({
    name: 'inheritor_id',
    type: 'bigint',
    nullable: true,
    comment: '传承人ID(可选)',
  })
  inheritorId: number;

  @Column({
    name: 'status',
    length: 20,
    default: 'on_sale',
    comment: '状态: on_sale/off_sale',
  })
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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'datetime',
    nullable: true,
    comment: '删除时间(软删除)',
  })
  deletedAt: Date;
}
