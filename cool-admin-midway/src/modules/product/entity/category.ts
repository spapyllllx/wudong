import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品分类表
 */
@Entity('product_category')
export class ProductCategoryEntity extends BaseEntity {
  @Column({ comment: '分类名称' })
  name: string;

  @Index()
  @Column({ comment: '父分类ID，0为一级分类', default: 0 })
  parentId: number;

  @Column({ comment: '分类图标', nullable: true })
  icon: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态 0-禁用 1-启用', default: 1 })
  status: number;

  // 不存数据库，查询时使用
  children?: ProductCategoryEntity[]; // 子分类列表
}
