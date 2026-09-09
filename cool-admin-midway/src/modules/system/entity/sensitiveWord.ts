import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('sys_sensitive_word')
export class SysSensitiveWordEntity extends BaseEntity {
  @Column({ comment: '敏感词', length: 100 })
  word: string;

  @Column({ comment: '级别 1:警告 2:禁止', default: 1 })
  level: number;

  @Column({ comment: '状态', default: 'active' })
  status: string;

  @Index({ unique: true })
  @Column({ comment: '唯一键' })
  uniqueKey: string;
}