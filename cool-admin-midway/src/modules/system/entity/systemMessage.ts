import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('sys_system_message')
export class SysSystemMessageEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID，NULL表示全局消息（关联app_user.id）', nullable: true })
  userId: number;

  @Column({ comment: '类型', length: 50 })
  type: string;

  @Column({ comment: '标题', length: 255 })
  title: string;

  @Column({ comment: '内容', type: 'text' })
  content: string;

  @Column({ comment: '跳转类型', nullable: true, length: 50 })
  linkType: string;

  @Column({ comment: '跳转值', nullable: true, length: 255 })
  linkValue: string;

  @Column({ comment: '是否已读', default: 0 })
  isRead: number;
}