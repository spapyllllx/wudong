import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 票型表
 */
@Entity('ticket_type')
export class TicketTypeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '景点ID' })
  attractionId: number;

  @Column({ comment: '票型名称' })
  name: string;

  @Column({ comment: '票型描述' })
  description: string;

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '原价', type: 'decimal', precision: 10, scale: 2 })
  originalPrice: number;

  @Column({ comment: '库存', default: 999 })
  stock: number;

  @Column({ comment: '有效天数', default: 1 })
  validDays: number;

  @Column({ comment: '退改规则' })
  refundRule: string;

  @Column({ comment: '使用规则' })
  useRule: string;

  @Index()
  @Column({ comment: '状态 0-下架 1-上架', default: 1 })
  status: number;

  @Column({ comment: '排序', default: 0 })
  sort: number;
}
