import { Post, Body, Inject, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
} from '@cool-midway/core';
import { TicketOrderService } from '../../service/ticket_order';

/**
 * 票务订单（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/ticket/order')
export class AppTicketOrderController extends BaseController {
  @Inject()
  ticketOrderService: TicketOrderService;

  @Inject()
  ctx;

  /**
   * 创建订单
   */
  @Post('/create', { summary: '创建订单' })
  async createOrder(@Body() data: any) {
    const userId = this.ctx.user?.id || 1;
    const order = await this.ticketOrderService.createOrder(userId, data);
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
    const result = await this.ticketOrderService.getOrderList(userId, page, size, status);
    return this.ok(result);
  }

  /**
   * 订单详情
   */
  @Post('/detail', { summary: '订单详情' })
  async orderDetail(@Body('orderNo') orderNo: string) {
    const userId = this.ctx.user?.id || 1;
    const order = await this.ticketOrderService.getOrderDetail(orderNo, userId);
    return this.ok(order);
  }

  /**
   * 取消订单
   */
  @Post('/cancel', { summary: '取消订单' })
  async cancelOrder(
    @Body('orderNo') orderNo: string,
    @Body('reason') reason: string = '不想购买了'
  ) {
    const userId = this.ctx.user?.id || 1;
    await this.ticketOrderService.cancelOrder(orderNo, userId, reason);
    return this.ok();
  }

  /**
   * 模拟支付
   */
  @Post('/mockPay', { summary: '模拟支付' })
  async mockPay(@Body('orderNo') orderNo: string) {
    const userId = this.ctx.user?.id || 1;
    await this.ticketOrderService.mockPay(orderNo, userId);
    return this.ok();
  }
}
