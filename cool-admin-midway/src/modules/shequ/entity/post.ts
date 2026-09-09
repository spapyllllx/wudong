import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 社区帖子表
 */
@Entity('shequ_post')
export class ShequPostEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '用户昵称', nullable: true })
  userNickName: string;

  @Column({ comment: '用户头像', nullable: true })
  userAvatar: string;

  @Column({ comment: '帖子内容', type: 'text' })
  content: string;

  @Column({ comment: '图片列表（JSON数组）', type: 'json', nullable: true })
  images: string[];

  @Column({ comment: '定位地址', nullable: true })
  location: string;

  @Column({ comment: '经度', type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @Column({ comment: '纬度', type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Index()
  @Column({ comment: '景点ID', nullable: true })
  scenicId: number;

  @Column({ comment: '景点名称', nullable: true })
  scenicName: string;

  @Column({ comment: '点赞数', default: 0 })
  likeCount: number;

  @Column({ comment: '评论数', default: 0 })
  commentCount: number;

  @Column({ comment: '浏览数', default: 0 })
  viewCount: number;

  @Column({ comment: '分享数', default: 0 })
  shareCount: number;

  @Column({ comment: '状态 0-待审核 1-已发布 2-已下架', default: 0 })
  status: number;

  @Column({ comment: '是否精华 0-否 1-是', default: 0 })
  isEssence: number;

  @Column({ comment: '是否置顶 0-否 1-是', default: 0 })
  isTop: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '审核备注', nullable: true })
  auditRemark: string;

  // 不存数据库，查询时关联
  isLiked: boolean; // 当前用户是否点赞
}
