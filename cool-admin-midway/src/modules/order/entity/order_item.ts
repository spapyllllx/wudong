import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 订单商品表
 */
@Entity('order_item')
export class OrderItemEntity extends BaseEntity {
  @Index()
  @Column({ comment: '订单ID' })
  orderId: number;

  @Index()
  @Column({ comment: '订单号' })
  orderNo: string;

  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: '商品标题' })
  productTitle: string;

  @Column({ comment: '商品图片' })
  productImage: string;

  @Column({ comment: 'SKU ID', nullable: true })
  skuId: number;

  @Column({ comment: 'SKU名称', nullable: true })
  skuName: string;

  @Column({ comment: '商品单价', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '购买数量' })
  quantity: number;

  @Column({ comment: '小计金额', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;
}
