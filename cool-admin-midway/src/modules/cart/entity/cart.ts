import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 购物车表
 */
@Entity('cart')
export class CartEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: 'SKU ID', nullable: true })
  skuId: number;

  @Column({ comment: '数量', default: 1 })
  quantity: number;

  @Column({ comment: '是否选中 0-否 1-是', default: 1 })
  selected: number;

  // 不存数据库，查询时关联
  productTitle?: string;
  productImage?: string;
  productPrice?: number;
  productStock?: number;
  skuName?: string;
  skuPrice?: number;
  skuStock?: number;
  skuImage?: string;
}
