import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('app_user')
export class AppUserEntity extends BaseEntity {
  @Column({ comment: '手机号', nullable: true, length: 11 })
  phone: string;

  @Column({ comment: '密码哈希', nullable: true, length: 255 })
  password: string;

  @Column({ comment: '昵称', default: '' })
  nickname: string;

  @Column({ comment: '头像URL', default: '' })
  avatar: string;

  @Column({ comment: '性别 0:未知 1:男 2:女', default: 0 })
  gender: number;

  @Column({ comment: '生日', nullable: true, type: 'date' })
  birthday: Date;

  @Column({ comment: '所在地区', default: '' })
  region: string;

  @Column({ comment: '个人简介', default: '' })
  bio: string;

  @Column({ comment: '微信openid', nullable: true, length: 100 })
  openid: string;

  @Column({ comment: '微信unionid', nullable: true, length: 100 })
  unionid: string;

  @Column({ comment: '角色: user/merchant/admin', default: 'user' })
  role: string;

  @Column({ comment: '状态: active/banned', default: 'active' })
  status: string;

  @Column({ comment: '最后登录时间', nullable: true, type: 'datetime' })
  lastLoginAt: Date;

  @Column({ comment: '删除时间', nullable: true, type: 'datetime' })
  deleteTime: Date;

  @Index({ unique: true })
  @Column({ comment: '唯一键' })
  uniqueKey: string;
}