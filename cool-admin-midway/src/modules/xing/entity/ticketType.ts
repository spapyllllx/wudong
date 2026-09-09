import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('xing_ticket_type')
export class XingTicketTypeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '景区ID' })
  scenicSpotId: number;

  @Column({ comment: '票种名称', length: 100 })
  name: string;

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '有效天数', default: 1 })
  validityDays: number;

  @Column({ comment: '说明', length: 255, nullable: true })
  description: string;

  @Column({ comment: '库存', default: 9999 })
  stock: number;

  @Column({ comment: '销量', default: 0 })
  sales: number;

  @Column({ comment: '状态', default: 'active' })
  status: string;
}