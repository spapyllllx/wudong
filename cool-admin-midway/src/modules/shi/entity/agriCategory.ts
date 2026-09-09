import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shi_agri_category')
export class ShiAgriCategoryEntity extends BaseEntity {
  @Column({ comment: '分类名称', length: 50 })
  name: string;

  @Column({ comment: '分类图标', nullable: true })
  icon: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态', default: 'active' })
  status: string;
}