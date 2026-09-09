import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shequ_post')
export class ShequPostEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID（关联app_user.id）' })
  userId: number;

  @Column({ comment: '标题', length: 255 })
  title: string;

  @Column({ comment: '文字内容', type: 'text' })
  content: string;

  @Column({ comment: '视频URL', nullable: true })
  videoUrl: string;

  @Column({ comment: '封面图', nullable: true })
  coverImage: string;

  @Column({ comment: '关联类型', nullable: true, length: 50 })
  relatedType: string;

  @Column({ comment: '关联ID', nullable: true })
  relatedId: number;

  @Column({ comment: '话题ID数组', nullable: true, type: 'json', transformer: transformerJson })
  topicIds: number[];

  @Column({ comment: '点赞数', default: 0 })
  likeCount: number;

  @Column({ comment: '评论数', default: 0 })
  commentCount: number;

  @Column({ comment: '收藏数', default: 0 })
  favoriteCount: number;

  @Column({ comment: '浏览数', default: 0 })
  viewCount: number;

  @Column({ comment: '状态', default: 'pending' })
  status: string;

  @Column({ comment: '拒绝原因', nullable: true, length: 255 })
  rejectReason: string;

  @Column({ comment: '发布时间', nullable: true, type: 'datetime' })
  publishedAt: Date;

  @Column({ comment: '删除时间', nullable: true, type: 'datetime' })
  deleteTime: Date;

  @Index()
  @Column({ comment: '唯一键' })
  uniqueKey: string;
}