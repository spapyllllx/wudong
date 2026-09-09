import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('merchant_application')
export class MerchantApplicationEntity extends BaseEntity {
  @Index()
  @Column({ comment: '申请用户ID（关联app_user.id）' })
  userId: number;

  @Column({ comment: '店铺名称', length: 100 })
  shopName: string;

  @Column({ comment: '模块类型: yi/shi/zhu/xing', length: 20 })
  moduleType: string;

  @Column({ comment: '联系人', length: 50 })
  contactName: string;

  @Column({ comment: '联系电话', length: 11 })
  contactPhone: string;

  @Column({ comment: '营业执照图片', nullable: true })
  businessLicense: string;

  @Column({ comment: '身份证正面', nullable: true })
  idCardFront: string;

  @Column({ comment: '身份证背面', nullable: true })
  idCardBack: string;

  @Column({ comment: '申请说明', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '状态', default: 'pending' })
  status: string;

  @Column({ comment: '拒绝原因', nullable: true, length: 255 })
  rejectReason: string;

  @Column({ comment: '审核人ID（关联base_sys_user.id）', nullable: true })
  reviewedBy: number;

  @Column({ comment: '审核时间', nullable: true, type: 'datetime' })
  reviewedAt: Date;
}