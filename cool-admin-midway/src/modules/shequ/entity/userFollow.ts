import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shequ_user_follow')
export class ShequUserFollowEntity extends BaseEntity {
  @Index()
  @Column({ comment: '关注者ID（关联app_user.id）' })
  followerId: number;

  @Index()
  @Column({ comment: '被关注者ID（关联app_user.id）' })
  followeeId: number;

  @Index({ unique: true })
  @Column({ comment: '唯一键' })
  uniqueKey: string;
}