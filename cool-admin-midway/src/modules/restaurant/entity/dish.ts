import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 菜品表
 */
@Entity('dish')
export class DishEntity extends BaseEntity {
  @Index()
  @Column({ comment: '餐厅ID' })
  restaurantId: number;

  @Index()
  @Column({ comment: '分类ID' })
  categoryId: number;

  @Column({ comment: '菜品名称' })
  name: string;

  @Column({ comment: '菜品图片' })
  image: string;

  @Column({ comment: '菜品描述', nullable: true })
  description: string;

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '原价', type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column({ comment: '单位', default: '份' })
  unit: string;

  @Column({ comment: '标签', nullable: true })
  tags: string;

  @Column({ comment: '是否推荐', default: 0 })
  isRecommend: number;

  @Column({ comment: '库存', default: 999 })
  stock: number;

  @Column({ comment: '销量', default: 0 })
  sales: number;

  @Index()
  @Column({ comment: '状态 0-下架 1-上架', default: 1 })
  status: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;
}
