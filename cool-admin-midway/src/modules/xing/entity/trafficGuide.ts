import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('xing_traffic_guide')
export class XingTrafficGuideEntity extends BaseEntity {
  @Column({ comment: '标题', length: 100 })
  title: string;

  @Column({ comment: '出发地', length: 100 })
  departurePlace: string;

  @Column({ comment: '目的地', length: 100 })
  destination: string;

  @Column({ comment: '交通方式', length: 50 })
  transportationType: string;

  @Column({ comment: '时长', nullable: true, length: 50 })
  duration: string;

  @Column({ comment: '费用', nullable: true, length: 50 })
  cost: string;

  @Column({ comment: '详细说明', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '图片JSON数组', nullable: true, type: 'json', transformer: transformerJson })
  images: string[];

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '状态', default: 'active' })
  status: string;

  @Index()
  @Column({ comment: '唯一键' })
  uniqueKey: string;
}