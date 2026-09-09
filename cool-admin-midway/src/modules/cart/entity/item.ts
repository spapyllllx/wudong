import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('cart_item')
export class CartItemEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID（关联app_user.id）' })
  userId: number;

  @Column({ comment: '商品类型：product/agri_product', length: 20 })
  itemType: string;

  @Column({ comment: '商品ID' })
  itemId: number;

  @Column({ comment: 'SKU ID', nullable: true })
  skuId: number;

  @Column({ comment: '数量' })
  quantity: number;

  @Column({ comment: '是否选中', default: 1 })
  selected: number;

  @Index({ unique: true })
  @Column({ comment: '唯一键' })
  uniqueKey: string;
}