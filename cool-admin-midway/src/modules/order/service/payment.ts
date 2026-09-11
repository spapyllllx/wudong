import { Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entity/order';
import { OrderLogEntity } from '../entity/order_log';

/**
 * 支付服务
 */
@Provide()
export class PaymentService extends BaseService {
  @InjectEntityModel(OrderEntity)
  orderEntity: Repository<OrderEntity>;

  @InjectEntityModel(OrderLogEntity)
  orderLogEntity: Repository<OrderLogEntity>;

  @Inject()
  ctx;

  /**
   * 模拟支付
   */
  async mockPay(orderNo: string, userId: number) {
    // 查询订单
    const order = await this.orderEntity.findOne({
      where: { orderNo, userId },
    });

    if (!order) {
      throw new Error('订单不存在');
    }

    if (order.status !== 0) {
      throw new Error('订单状态不正确，无法支付');
    }

    if (order.payStatus === 1) {
      throw new Error('订单已支付');
    }

    // 更新订单状态
    order.payStatus = 1; // 已支付
    order.status = 1; // 待发货
    order.payType = 'mock'; // 模拟支付
    order.payTime = new Date().toISOString();

    await this.orderEntity.save(order);

    // 记录订单日志
    await this.orderLogEntity.save({
      orderId: order.id,
      orderNo: order.orderNo,
      operateType: '支付订单',
      operateContent: '用户完成支付（模拟）',
      operatorId: userId,
      operatorName: '用户',
    });

    return order;
  }
}
