import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { transformerDecimal, transformerInt, transformerTime } from './common';

/**
 * 商品订单明细表 product_order_items(设计文档 3.2.7)
 * 下单时对商品/SKU 信息做快照,订单表先落地(公共模块,见 entity/order.ts 注释)。
 */
@Entity('product_order_items')
export class ProductOrderItemEntity {
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

  @Column({
    name: 'sku_id',
    type: 'bigint',
    nullable: true,
    transformer: transformerInt,
    comment: 'SKU ID',
  })
  skuId: number;

  @Column({ name: 'product_name', length: 255, comment: '商品名称(快照)' })
  productName: string;

  @Column({
    name: 'sku_name',
    length: 100,
    nullable: true,
    comment: 'SKU名称(快照)',
  })
  skuName: string;

  @Column({
    name: 'image',
    length: 255,
    nullable: true,
    comment: '商品主图(快照)',
  })
  image: string;

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: transformerDecimal,
    comment: '单价(快照)',
  })
  price: number;

  @Column({ name: 'quantity', type: 'int', comment: '数量' })
  quantity: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: transformerDecimal,
    comment: '小计',
  })
  totalAmount: number;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: transformerTime,
    comment: '创建时间',
  })
  createdAt: Date;
}
