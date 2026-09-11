import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品规格表
 */
@Entity('product_sku')
export class ProductSkuEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: '规格名称（如：红色-L）' })
  specName: string;

  @Column({ comment: '规格值JSON', type: 'json', nullable: true })
  specValue: any;

  @Column({ comment: 'SKU价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: 'SKU库存', default: 0 })
  stock: number;

  @Column({ comment: 'SKU编码', nullable: true })
  skuCode: string;

  @Column({ comment: 'SKU图片', nullable: true })
  image: string;

  @Index()
  @Column({ comment: '状态 0-禁用 1-启用', default: 1 })
  status: number;
}
