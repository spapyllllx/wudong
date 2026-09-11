import { Post, Body, Inject, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
} from '@cool-midway/core';
import { OrderService } from '../../service/order';

/**
 * 订单（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/order')
export class AppOrderController extends BaseController {
  @Inject()
  orderService: OrderService;

  @Inject()
  ctx;

  /**
   * 创建订单
   */
  @Post('/create', { summary: '创建订单' })
  async createOrder(@Body() data: any) {
    const userId = this.ctx.user?.id || 1;
    const order = await this.orderService.createOrder(userId, data);
    return this.ok(order);
  }

  /**
   * 订单列表
   */
  @Post('/list', { summary: '订单列表' })
  async orderList(
    @Body('page') page: number = 1,
    @Body('size') size: number = 10,
    @Body('status') status?: number
  ) {
    const userId = this.ctx.user?.id || 1;
    const result = await this.orderService.getOrderList(userId, page, size, status);
    return this.ok(result);
  }

  /**
   * 订单详情
   */
  @Post('/detail', { summary: '订单详情' })
  async orderDetail(@Body('orderNo') orderNo: string) {
    const userId = this.ctx.user?.id || 1;
    const order = await this.orderService.getOrderDetail(orderNo, userId);
    return this.ok(order);
  }

  /**
   * 取消订单
   */
  @Post('/cancel', { summary: '取消订单' })
  async cancelOrder(
    @Body('orderNo') orderNo: string,
    @Body('reason') reason: string = '不想要了'
  ) {
    const userId = this.ctx.user?.id || 1;
    await this.orderService.cancelOrder(orderNo, userId, reason);
    return this.ok();
  }

  /**
   * 确认收货
   */
  @Post('/confirmReceipt', { summary: '确认收货' })
  async confirmReceipt(@Body('orderNo') orderNo: string) {
    const userId = this.ctx.user?.id || 1;
    await this.orderService.confirmReceipt(orderNo, userId);
    return this.ok();
  }

  /**
   * 删除订单
   */
  @Post('/delete', { summary: '删除订单' })
  async deleteOrder(@Body('orderNo') orderNo: string) {
    const userId = this.ctx.user?.id || 1;
    await this.orderService.deleteOrder(orderNo, userId);
    return this.ok();
  }

  /**
   * 订单统计
   */
  @Post('/stats', { summary: '订单统计' })
  async orderStats() {
    const userId = this.ctx.user?.id || 1;
    const stats = await this.orderService.getOrderStats(userId);
    return this.ok(stats);
  }
}
