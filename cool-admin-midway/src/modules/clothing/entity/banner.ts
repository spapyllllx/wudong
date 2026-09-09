import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { transformerTime } from './common';

/**
 * 轮播图表 banners(设计文档 3.2.9)
 * 平台运营公共表,衣模块按设计文档先行落地(见 clothing_common_module.sql 注释)。
 */
@Entity('banners')
export class BannerEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: 'ID' })
  id: number;

  @Column({ name: 'title', length: 100, comment: '标题' })
  title: string;

  @Column({ name: 'image', length: 255, comment: '图片URL' })
  image: string;

  @Column({
    name: 'link_type',
    length: 50,
    nullable: true,
    comment: '跳转类型: url/product/post等',
  })
  linkType: string;

  @Column({
    name: 'link_value',
    length: 255,
    nullable: true,
    comment: '跳转值',
  })
  linkValue: string;

  @Column({
    name: 'position',
    length: 50,
    default: 'home',
    comment: '位置: home/category等',
  })
  position: string;

  @Column({ name: 'sort', type: 'int', default: 0, comment: '排序' })
  sort: number;

  @Column({
    name: 'status',
    length: 20,
    default: 'active',
    comment: '状态',
  })
  status: string;

  @Column({
    name: 'start_time',
    type: 'datetime',
    nullable: true,
    transformer: transformerTime,
    comment: '生效开始',
  })
  startTime: Date;

  @Column({
    name: 'end_time',
    type: 'datetime',
    nullable: true,
    transformer: transformerTime,
    comment: '生效结束',
  })
  endTime: Date;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: transformerTime,
    comment: '创建时间',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: transformerTime,
    comment: '更新时间',
  })
  updatedAt: Date;
}
