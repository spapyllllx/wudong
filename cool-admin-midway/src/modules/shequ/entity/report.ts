import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shequ_report')
export class ShequReportEntity extends BaseEntity {
  @Index()
  @Column({ comment: '举报人ID（关联app_user.id）' })
  reporterId: number;

  @Column({ comment: '目标类型：post/comment', length: 50 })
  targetType: string;

  @Column({ comment: '目标ID' })
  targetId: number;

  @Column({ comment: '举报原因', length: 500 })
  reason: string;

  @Column({ comment: '状态', default: 'pending' })
  status: string;

  @Column({ comment: '处理人ID（关联base_sys_user.id）', nullable: true })
  handlerId: number;

  @Column({ comment: '处理结果', nullable: true, length: 255 })
  handleResult: string;

  @Column({ comment: '处理时间', nullable: true, type: 'datetime' })
  handledAt: Date;
}