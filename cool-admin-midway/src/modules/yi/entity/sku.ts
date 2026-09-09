import { BaseEntity, transformerJson } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 商品SKU
 */
@Entity('yi_product_sku')
export class YiProductSkuEntity extends BaseEntity {
  @Index()
  @Column({ comment: '商品ID' })
  productId: number;

  @Column({ comment: 'SKU名称', length: 100 })
  skuName: string;

  @Column({ comment: 'SKU图片', nullable: true })
  image: string;

  @Column({ comment: '价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ comment: '库存', default: 0 })
  stock: number;

  @Column({ comment: '销量', default: 0 })
  sales: number;

  @Column({ comment: 'SKU属性JSON', nullable: true, type: 'json', transformer: transformerJson })
  attrs: any;

  @Column({ comment: '状态', default: 'active' })
  status: string;
}