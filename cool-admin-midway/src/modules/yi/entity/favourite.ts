import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品收藏
 */
@Entity('yi_product_favorite')
export class YiProductFavoriteEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID（关联app_user.id）' })
  userId: number;

  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Index({ unique: true })
  @Column({ comment: '唯一键' })
  uniqueKey: string;
}