import { BaseEntity } from '../../base/entity/base';
import { Column, Entity } from 'typeorm';

/**
 * 景区表
 */
@Entity('xing_scenic')
export class XingScenicEntity extends BaseEntity {
  @Column({ comment: '景区名称', length: 100 })
  name: string;

  @Column({ comment: '封面图URL', nullable: true })
  coverImage: string;

  @Column({ comment: '景区描述', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '地址', length: 255, nullable: true })
  address: string;

  @Column({ comment: '纬度', type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ comment: '经度', type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ comment: '开放时间', type: 'time', nullable: true })
  openTime: string;

  @Column({ comment: '关闭时间', type: 'time', nullable: true })
  closeTime: string;

  @Column({ comment: '评分（满分5.0）', type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @Column({ comment: '销量', default: 0 })
  sales: number;

  @Column({ comment: '状态：0禁用 1启用', default: 1 })
  status: number;
}
