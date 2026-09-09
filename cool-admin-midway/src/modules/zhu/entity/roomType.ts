import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('zhu_homestay_room_type')
export class ZhuHomestayRoomTypeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '民宿ID' })
  homestayId: number;

  @Column({ comment: '房型名称', length: 100 })
  name: string;

  @Column({ comment: '主图' })
  mainImage: string;

  @Column({ comment: '图片JSON数组', nullable: true, type: 'json', transformer: transformerJson })
  images: string[];

  @Column({ comment: '床型', nullable: true, length: 50 })
  bedType: string;

  @Column({ comment: '面积(平米)', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  area: number;

  @Column({ comment: '可住人数' })
  capacity: number;

  @Column({ comment: '设施JSON数组', nullable: true, type: 'json', transformer: transformerJson })
  facilities: string[];

  @Column({ comment: '基础价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '房间总数' })
  totalRooms: number;

  @Column({ comment: '状态', default: 'active' })
  status: string;
}