import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('xing_e_ticket')
export class XingETicketEntity extends BaseEntity {
  @Column({ comment: '订单ID' })
  orderId: number;

  @Index()
  @Column({ comment: '用户ID（关联app_user.id）' })
  userId: number;

  @Column({ comment: '票种类型：scenic/route', length: 20 })
  ticketType: string;

  @Column({ comment: '票种ID', nullable: true })
  ticketTypeId: number;

  @Column({ comment: '路线套餐ID', nullable: true })
  routePackageId: number;

  @Column({ comment: '票号（唯一）', length: 50 })
  ticketNo: string;

  @Column({ comment: '二维码图片URL' })
  qrCode: string;

  @Column({ comment: '有效日期', type: 'date' })
  validDate: Date;

  @Column({ comment: '游客姓名', length: 50 })
  visitorName: string;

  @Column({ comment: '游客电话', nullable: true, length: 11 })
  visitorPhone: string;

  @Column({ comment: '游客身份证号', nullable: true, length: 18 })
  visitorIdCard: string;

  @Column({ comment: '状态', default: 'unused' })
  status: string;

  @Column({ comment: '核销时间', nullable: true, type: 'datetime' })
  usedAt: Date;

  @Index({ unique: true })
  @Column({ comment: '唯一键' })
  uniqueKey: string;
}