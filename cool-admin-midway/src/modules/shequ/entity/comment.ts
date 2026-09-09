import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 帖子评论表
 */
@Entity('shequ_comment')
export class ShequCommentEntity extends BaseEntity {
  @Index()
  @Column({ comment: '帖子ID' })
  postId: number;

  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '用户昵称', nullable: true })
  userNickName: string;

  @Column({ comment: '用户头像', nullable: true })
  userAvatar: string;

  @Column({ comment: '评论内容', type: 'text' })
  content: string;

  @Column({ comment: '父评论ID（回复评论用）', nullable: true, default: null })
  parentId: number;

  @Column({ comment: '回复的用户ID', nullable: true })
  replyUserId: number;

  @Column({ comment: '回复的用户昵称', nullable: true })
  replyUserNickName: string;

  @Column({ comment: '点赞数', default: 0 })
  likeCount: number;

  @Column({ comment: '状态 0-待审核 1-已发布 2-已删除', default: 1 })
  status: number;

  // 不存数据库，查询时使用
  replies: ShequCommentEntity[]; // 子评论列表
  isLiked: boolean; // 当前用户是否点赞
}
