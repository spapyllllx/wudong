import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

@Entity('order_product_logistics')
export class OrderProductLogisticsEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '订单ID' })
  orderId: number;

  @Column({ comment: '收货人', length: 50 })
  consignee: string;

  @Column({ comment: '联系电话', length: 11 })
  phone: string;

  @Column({ comment: '省', length: 50 })
  province: string;

  @Column({ comment: '市', length: 50 })
  city: string;

  @Column({ comment: '区', length: 50 })
  district: string;

  @Column({ comment: '详细地址', length: 255 })
  detail: string;

  @Column({ comment: '运费', type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingFee: number;

  @Column({ comment: '物流公司', nullable: true, length: 50 })
  logisticsCompany: string;

  @Column({ comment: '物流单号', nullable: true, length: 100 })
  logisticsNo: string;

  @Column({ comment: '发货时间', nullable: true, type: 'datetime' })
  shippedAt: Date;

  @Column({ comment: '收货时间', nullable: true, type: 'datetime' })
  receivedAt: Date;
}