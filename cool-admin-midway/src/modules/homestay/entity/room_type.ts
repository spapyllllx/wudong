import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 房型表
 */
@Entity('room_type')
export class RoomTypeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '民宿ID' })
  homestayId: number;

  @Column({ comment: '房型名称' })
  name: string;

  @Column({ comment: '房型图片' })
  image: string;

  @Column({ comment: '房型图片（多张）', type: 'text', nullable: true })
  images: string;

  @Column({ comment: '房型描述', nullable: true })
  description: string;

  @Column({ comment: '面积（平方米）', nullable: true })
  area: number;

  @Column({ comment: '床型', nullable: true })
  bedType: string;

  @Column({ comment: '最多入住人数', default: 2 })
  maxGuests: number;

  @Column({ comment: '价格/晚', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '周末价格/晚', type: 'decimal', precision: 10, scale: 2, nullable: true })
  weekendPrice: number;

  @Column({ comment: '房间设施', type: 'text', nullable: true })
  facilities: string;

  @Column({ comment: '房间总数', default: 1 })
  totalRooms: number;

  @Index()
  @Column({ comment: '状态 0-下架 1-上架', default: 1 })
  status: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;
}
