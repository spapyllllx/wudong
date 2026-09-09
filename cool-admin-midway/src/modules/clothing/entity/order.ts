import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { transformerDecimal, transformerInt, transformerTime } from './common';

/**
 * 统一订单表 orders(设计文档 3.2.7)
 * 说明:属公共订单模块(核心组),衣模块在统一订单未交付前按设计文档先行落地,
 * 字段与 database/clothing_order_module.sql 一致;核心组交付后并入其模块。
 */
@Entity('orders')
export class ProductOrderEntity {
  @PrimaryColumn({
    type: 'bigint',
    transformer: transformerInt,
    comment: '订单号(雪花算法生成)',
  })
  id: number;

  @Index('idx_user_id')
  @Column({
    name: 'user_id',
    type: 'bigint',
    transformer: transformerInt,
    comment: '用户ID',
  })
  userId: number;

  @Index('idx_order_type')
  @Column({
    name: 'order_type',
    length: 20,
    comment: 'product/restaurant/homestay/ticket/route',
  })
  orderType: string;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: transformerDecimal,
    comment: '订单总金额',
  })
  totalAmount: number;

  @Column({
    name: 'paid_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: transformerDecimal,
    comment: '实付金额',
  })
  paidAmount: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: transformerDecimal,
    comment: '优惠金额',
  })
  discountAmount: number;

  @Column({
    name: 'payment_method',
    length: 50,
    nullable: true,
    comment: '支付方式: wechat/alipay',
  })
  paymentMethod: string;

  @Column({
    name: 'payment_no',
    length: 100,
    nullable: true,
    comment: '支付流水号',
  })
  paymentNo: string;

  @Index('idx_status')
  @Column({
    name: 'status',
    length: 20,
    default: 'pending',
    comment: 'pending/paid/cancelled/completed/refunded',
  })
  status: string;

  @Column({
    name: 'remark',
    length: 255,
    default: '',
    nullable: true,
    comment: '订单备注',
  })
  remark: string;

  @Column({
    name: 'paid_at',
    type: 'datetime',
    nullable: true,
    transformer: transformerTime,
    comment: '支付时间',
  })
  paidAt: Date;

  @Column({
    name: 'completed_at',
    type: 'datetime',
    nullable: true,
    transformer: transformerTime,
    comment: '完成时间',
  })
  completedAt: Date;

  @Column({
    name: 'cancelled_at',
    type: 'datetime',
    nullable: true,
    transformer: transformerTime,
    comment: '取消时间',
  })
  cancelledAt: Date;

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
