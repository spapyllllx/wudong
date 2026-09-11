import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 菜品分类表
 */
@Entity('dish_category')
export class DishCategoryEntity extends BaseEntity {
  @Index()
  @Column({ comment: '餐厅ID' })
  restaurantId: number;

  @Column({ comment: '分类名称' })
  name: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;
}
