import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 点赞表
 */
@Entity('shequ_like')
export class ShequLikeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Index()
  @Column({ comment: '目标ID（帖子ID或评论ID）' })
  targetId: number;

  @Index()
  @Column({ comment: '类型 1-帖子 2-评论' })
  type: number;
}
