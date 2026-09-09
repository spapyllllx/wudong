import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('zhu_homestay_room_calendar')
export class ZhuHomestayRoomCalendarEntity extends BaseEntity {
  @Index()
  @Column({ comment: '房型ID' })
  roomTypeId: number;

  @Column({ comment: '日期', type: 'date' })
  date: Date;

  @Column({ comment: '当日价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '可用房间数' })
  availableCount: number;

  @Index({ unique: true })
  @Column({ comment: '唯一键' })
  uniqueKey: string;
}