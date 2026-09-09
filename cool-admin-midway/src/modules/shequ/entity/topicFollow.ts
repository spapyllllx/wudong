import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shequ_topic_follow')
export class ShequTopicFollowEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID（关联app_user.id）' })
  userId: number;

  @Index()
  @Column({ comment: '话题ID' })
  topicId: number;

  @Index({ unique: true })
  @Column({ comment: '唯一键' })
  uniqueKey: string;
}