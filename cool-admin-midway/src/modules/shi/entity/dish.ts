import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shi_restaurant_dish')
export class ShiRestaurantDishEntity extends BaseEntity {
  @Index()
  @Column({ comment: '餐厅ID' })
  restaurantId: number;

  @Column({ comment: '菜品名称', length: 100 })
  name: string;

  @Column({ comment: '菜品图片', nullable: true })
  image: string;

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '菜品介绍', length: 255, nullable: true })
  description: string;

  @Column({ comment: '是否招牌菜', default: 0 })
  isSignature: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态', default: 'active' })
  status: string;
}