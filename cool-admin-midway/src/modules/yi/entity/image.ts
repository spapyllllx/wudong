import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品图片
 */
@Entity('yi_product_image')
export class YiProductImageEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: '图片URL' })
  url: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;
}