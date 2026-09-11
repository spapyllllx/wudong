import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 用户地址表
 */
@Entity('user_address')
export class UserAddressEntity extends BaseEntity {
  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '收货人姓名' })
  receiverName: string;

  @Column({ comment: '收货人电话' })
  receiverPhone: string;

  @Column({ comment: '省' })
  province: string;

  @Column({ comment: '市' })
  city: string;

  @Column({ comment: '区' })
  district: string;

  @Column({ comment: '详细地址' })
  address: string;

  @Column({ comment: '是否默认 0-否 1-是', default: 0 })
  isDefault: number;
}
