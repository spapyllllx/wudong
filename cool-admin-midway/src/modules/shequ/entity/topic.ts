import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shequ_topic')
export class ShequTopicEntity extends BaseEntity {
  @Column({ comment: '话题名', length: 50 })
  name: string;

  @Column({ comment: '话题简介', length: 255, nullable: true })
  description: string;

  @Column({ comment: '封面图', nullable: true })
  coverImage: string;

  @Column({ comment: '关注数', default: 0 })
  followCount: number;

  @Column({ comment: '游记数', default: 0 })
  postCount: number;

  @Column({ comment: '是否热门', default: 0 })
  isHot: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态', default: 'active' })
  status: string;

  @Index({ unique: true })
  @Column({ comment: '唯一键' })
  uniqueKey: string;
}