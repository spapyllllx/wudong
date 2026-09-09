import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品分类
 */
@Entity('yi_product_category')
export class YiProductCategoryEntity extends BaseEntity {
  @Index()
  @Column({ comment: '父分类ID，0为顶级', default: 0 })
  parentId: number;

  @Column({ comment: '分类名称', length: 50 })
  name: string;

  @Column({ comment: '分类图标', nullable: true })
  icon: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态: active/inactive', default: 'active' })
  status: string;
}