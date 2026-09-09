import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品
 */
@Entity('yi_product')
export class YiProductEntity extends BaseEntity {
  @Index()
  @Column({ comment: '分类ID' })
  categoryId: number;

  @Index()
  @Column({ comment: '商家ID（关联app_user.id）' })
  merchantId: number;

  @Column({ comment: '商品标题', length: 255 })
  title: string;

  @Column({ comment: '副标题', nullable: true })
  subtitle: string;

  @Column({ comment: '主图' })
  mainImage: string;

  @Column({ comment: '售价', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '市场价', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  marketPrice: number;

  @Column({ comment: '总库存', default: 0 })
  stock: number;

  @Column({ comment: '销量', default: 0 })
  sales: number;

  @Column({ comment: '商品详情', type: 'text', nullable: true })
  detail: string;

  @Column({ comment: '工艺介绍', type: 'text', nullable: true })
  craftIntro: string;

  @Column({ comment: '传承人ID', nullable: true })
  inheritorId: number;

  @Column({ comment: '状态: on_sale/off_sale', default: 'on_sale' })
  status: string;

  @Column({ comment: '删除时间', nullable: true, type: 'datetime' })
  deleteTime: Date;
}