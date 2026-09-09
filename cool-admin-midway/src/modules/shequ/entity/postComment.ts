import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shequ_post_comment')
export class ShequPostCommentEntity extends BaseEntity {
  @Index()
  @Column({ comment: '游记ID' })
  postId: number;

  @Index()
  @Column({ comment: '用户ID（关联app_user.id）' })
  userId: number;

  @Column({ comment: '父评论ID，0为一级评论', default: 0 })
  parentId: number;

  @Column({ comment: '回复的用户ID', nullable: true })
  replyToUserId: number;

  @Column({ comment: '评论内容', length: 500 })
  content: string;

  @Column({ comment: '点赞数', default: 0 })
  likeCount: number;

  @Column({ comment: '状态', default: 'published' })
  status: string;

  @Column({ comment: '删除时间', nullable: true, type: 'datetime' })
  deleteTime: Date;
}