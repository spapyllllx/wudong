import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 订单表
 */
@Entity('order')
export class OrderEntity extends BaseEntity {
  @Column({ comment: '订单号', unique: true })
  orderNo: string;

  @Index()
  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '订单总金额', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ comment: '实付金额', type: 'decimal', precision: 10, scale: 2 })
  payAmount: number;

  @Column({ comment: '运费', type: 'decimal', precision: 10, scale: 2, default: 0 })
  freight: number;

  @Column({ comment: '优惠金额', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Index()
  @Column({ comment: '订单状态 0-待付款 1-待发货 2-待收货 3-已完成 4-已取消 5-已关闭', default: 0 })
  status: number;

  @Column({ comment: '支付状态 0-未支付 1-已支付', default: 0 })
  payStatus: number;

  @Column({ comment: '支付方式 wechat-微信 alipay-支付宝', nullable: true })
  payType: string;

  @Column({ comment: '支付时间', nullable: true })
  payTime: string;

  @Column({ comment: '发货时间', nullable: true })
  shipTime: string;

  @Column({ comment: '完成时间', nullable: true })
  finishTime: string;

  @Column({ comment: '取消时间', nullable: true })
  cancelTime: string;

  @Column({ comment: '取消原因', nullable: true })
  cancelReason: string;

  @Column({ comment: '订单备注', nullable: true })
  remark: string;

  @Column({ comment: '收货人姓名' })
  receiverName: string;

  @Column({ comment: '收货人电话' })
  receiverPhone: string;

  @Column({ comment: '省' })
  receiverProvince: string;

  @Column({ comment: '市' })
  receiverCity: string;

  @Column({ comment: '区' })
  receiverDistrict: string;

  @Column({ comment: '详细地址' })
  receiverAddress: string;

  // 不存数据库，查询时使用
  items?: any[]; // 订单商品列表
  logs?: any[]; // 订单日志
}
