import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { transformerInt, transformerTime } from './common';

/**
 * 购物车表 carts(设计文档 3.2.8)
 * 公共表(核心组)未交付前由衣模块按设计文档先行落地,详见 clothing_cart_module.sql 注释。
 */
@Entity('carts')
@Unique('uk_user_item', ['userId', 'itemType', 'itemId', 'skuId'])
export class CartEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: 'ID' })
  id: number;

  @Index('idx_user_id')
  @Column({
    name: 'user_id',
    type: 'bigint',
    transformer: transformerInt,
    comment: '用户ID',
  })
  userId: number;

  @Column({
    name: 'item_type',
    length: 20,
    default: 'product',
    comment: 'product/agri_product',
  })
  itemType: string;

  @Column({
    name: 'item_id',
    type: 'bigint',
    transformer: transformerInt,
    comment: '商品ID',
  })
  itemId: number;

  @Column({
    name: 'sku_id',
    type: 'bigint',
    nullable: true,
    transformer: transformerInt,
    comment: 'SKU ID',
  })
  skuId: number;

  @Column({ name: 'quantity', type: 'int', comment: '数量' })
  quantity: number;

  @Column({
    name: 'selected',
    type: 'tinyint',
    default: 1,
    comment: '是否选中',
  })
  selected: number;

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
