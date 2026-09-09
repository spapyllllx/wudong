import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shequ_post_image')
export class ShequPostImageEntity extends BaseEntity {
  @Index()
  @Column({ comment: '游记ID' })
  postId: number;

  @Column({ comment: '图片URL' })
  url: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;
}