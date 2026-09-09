import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

@Entity('sys_banner')
export class SysBannerEntity extends BaseEntity {
  @Column({ comment: '标题', length: 100 })
  title: string;

  @Column({ comment: '图片URL' })
  image: string;

  @Column({ comment: '跳转类型', nullable: true, length: 50 })
  linkType: string;

  @Column({ comment: '跳转值', nullable: true, length: 255 })
  linkValue: string;

  @Column({ comment: '位置', default: 'home' })
  position: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态', default: 'active' })
  status: string;

  @Column({ comment: '开始时间', nullable: true, type: 'datetime' })
  startTime: Date;

  @Column({ comment: '结束时间', nullable: true, type: 'datetime' })
  endTime: Date;
}