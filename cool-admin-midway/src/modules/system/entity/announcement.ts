import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

@Entity('sys_announcement')
export class SysAnnouncementEntity extends BaseEntity {
  @Column({ comment: '标题', length: 255 })
  title: string;

  @Column({ comment: '内容', type: 'text' })
  content: string;

  @Column({ comment: '类型', default: 'system', length: 50 })
  type: string;

  @Column({ comment: '状态', default: 'published' })
  status: string;

  @Column({ comment: '发布时间', nullable: true, type: 'datetime' })
  publishedAt: Date;
}