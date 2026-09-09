import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { transformerTime } from './common';

/**
 * 商品分类表 product_categories
 * 对应技术文档 2026-09-08-wudong-tourist-platform-design.md 3.2.2
 */
@Entity('product_categories')
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: 'ID' })
  id: number;

  @Index('idx_parent_id')
  @Column({
    name: 'parent_id',
    type: 'bigint',
    default: 0,
    comment: '父分类ID，0为顶级',
  })
  parentId: number;

  @Column({ name: 'name', length: 50, comment: '分类名称' })
  name: string;

  @Column({ name: 'icon', length: 255, default: '', nullable: true, comment: '分类图标' })
  icon: string;

  @Index('idx_sort')
  @Column({ name: 'sort', type: 'int', default: 0, comment: '排序' })
  sort: number;

  @Column({
    name: 'status',
    length: 20,
    default: 'active',
    comment: '状态: active/inactive',
  })
  status: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    transformer: transformerTime,
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    transformer: transformerTime,
    comment: '更新时间',
  })
  updatedAt: Date;
}
