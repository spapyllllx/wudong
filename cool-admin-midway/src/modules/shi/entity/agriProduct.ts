import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('shi_agri_product')
export class ShiAgriProductEntity extends BaseEntity {
  @Index()
  @Column({ comment: '分类ID' })
  categoryId: number;

  @Index()
  @Column({ comment: '商家ID（关联app_user.id）' })
  merchantId: number;

  @Column({ comment: '商品名称', length: 100 })
  name: string;

  @Column({ comment: '主图' })
  mainImage: string;

  @Column({ comment: '详情图片JSON数组', nullable: true, type: 'json', transformer: transformerJson })
  images: string[];

  @Column({ comment: '售价', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '市场价', nullable: true, type: 'decimal', precision: 10, scale: 2 })
  marketPrice: number;

  @Column({ comment: '库存', default: 0 })
  stock: number;

  @Column({ comment: '销量', default: 0 })
  sales: number;

  @Column({ comment: '单位', default: '件' })
  unit: string;

  @Column({ comment: '产地', nullable: true, length: 100 })
  origin: string;

  @Column({ comment: '保质期', nullable: true, length: 50 })
  shelfLife: string;

  @Column({ comment: '商品详情', type: 'text', nullable: true })
  detail: string;

  @Column({ comment: '状态', default: 'on_sale' })
  status: string;

  @Column({ comment: '删除时间', nullable: true, type: 'datetime' })
  deleteTime: Date;
}