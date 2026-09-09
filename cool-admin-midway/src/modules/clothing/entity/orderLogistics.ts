import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';
import {
  transformerDecimal,
  transformerInt,
  transformerTime,
} from './common';

/**
 * 商品订单物流表 product_order_logistics(设计文档 3.2.7)
 * 收货信息快照,一单一物流;订单表先落地(公共模块,见 entity/order.ts 注释)。
 */
@Entity('product_order_logistics')
@Unique('uk_order_id', ['orderId'])
export class ProductOrderLogisticsEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', comment: 'ID' })
  id: number;

  @Column({
    name: 'order_id',
    type: 'bigint',
    transformer: transformerInt,
    comment: '订单ID(唯一)',
  })
  orderId: number;

  @Column({ name: 'consignee', length: 50, comment: '收货人' })
  consignee: string;

  @Column({ name: 'phone', length: 11, comment: '联系电话' })
  phone: string;

  @Column({ name: 'province', length: 50, comment: '省' })
  province: string;

  @Column({ name: 'city', length: 50, comment: '市' })
  city: string;

  @Column({ name: 'district', length: 50, comment: '区县' })
  district: string;

  @Column({ name: 'detail', length: 255, comment: '详细地址' })
  detail: string;

  @Column({
    name: 'shipping_fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: transformerDecimal,
    comment: '运费',
  })
  shippingFee: number;

  @Column({
    name: 'logistics_company',
    length: 50,
    nullable: true,
    comment: '物流公司',
  })
  logisticsCompany: string;

  @Column({
    name: 'logistics_no',
    length: 100,
    nullable: true,
    comment: '物流单号',
  })
  logisticsNo: string;

  @Column({
    name: 'shipped_at',
    type: 'datetime',
    nullable: true,
    transformer: transformerTime,
    comment: '发货时间',
  })
  shippedAt: Date;

  @Column({
    name: 'received_at',
    type: 'datetime',
    nullable: true,
    transformer: transformerTime,
    comment: '收货时间',
  })
  receivedAt: Date;

  @Column({
    name: 'created_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: transformerTime,
    comment: '创建时间',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    transformer: transformerTime,
    comment: '更新时间',
  })
  updatedAt: Date;
}
