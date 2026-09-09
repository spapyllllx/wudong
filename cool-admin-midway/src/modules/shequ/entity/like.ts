import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shequ_like')
export class ShequLikeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID（关联app_user.id）' })
  userId: number;

  @Column({ comment: '目标类型：post/comment', length: 50 })
  targetType: string;

  @Column({ comment: '目标ID' })
  targetId: number;

  @Index({ unique: true })
  @Column({ comment: '唯一键' })
  uniqueKey: string;
}