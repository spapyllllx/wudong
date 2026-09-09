import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shequ_post_favorite')
export class ShequPostFavoriteEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID（关联app_user.id）' })
  userId: number;

  @Index()
  @Column({ comment: '游记ID' })
  postId: number;

  @Index({ unique: true })
  @Column({ comment: '唯一键' })
  uniqueKey: string;
}