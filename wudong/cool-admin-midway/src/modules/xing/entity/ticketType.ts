import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 票种表
 */
@Entity('xing_ticket_type')
export class XingTicketTypeEntity extends BaseEntity {
  @Index()
  @Column({ comment: '所属景区ID' })
  scenicId: number;

  @Column({ comment: '票种名称，如：成人票、学生票', length: 100 })
  name: string;

  @Column({ comment: '售价（元）', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '原价（元），用于展示折扣', type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column({ comment: '库存，-1表示不限', default: -1 })
  stock: number;

  @Column({ comment: '有效天数，1=当日有效', default: 1 })
  validDays: number;

  @Column({ comment: '年龄限制说明', length: 50, nullable: true })
  ageLimit: string;

  @Column({ comment: '票种描述', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '票种展示图', nullable: true })
  coverImage: string;

  @Column({ comment: '状态：0禁用 1启用', default: 1 })
  status: number;
}
