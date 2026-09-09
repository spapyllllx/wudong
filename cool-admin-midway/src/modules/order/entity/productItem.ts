import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('order_product_item')
export class OrderProductItemEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单ID' })
  orderId: number;

  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: 'SKU ID', nullable: true })
  skuId: number;

  @Column({ comment: '商品名称', length: 255 })
  productName: string;

  @Column({ comment: 'SKU名称', nullable: true, length: 100 })
  skuName: string;

  @Column({ comment: '商品图片', nullable: true })
  image: string;

  @Column({ comment: '单价', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '数量' })
  quantity: number;

  @Column({ comment: '小计', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;
}