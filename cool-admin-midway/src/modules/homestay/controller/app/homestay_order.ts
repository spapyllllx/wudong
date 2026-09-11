import { Post, Body, Inject, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
} from '@cool-midway/core';
import { HomestayOrderService } from '../../service/homestay_order';

/**
 * 住宿订单（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/homestay/order')
export class AppHomestayOrderController extends BaseController {
  @Inject()
  homestayOrderService: HomestayOrderService;

  @Inject()
  ctx;

  /**
   * 创建订单
   */
  @Post('/create', { summary: '创建订单' })
  async createOrder(@Body() data: any) {
    const userId = this.ctx.user?.id || 1;
    const order = await this.homestayOrderService.createOrder(userId, data);
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
    const result = await this.homestayOrderService.getOrderList(userId, page, size, status);
    return this.ok(result);
  }

  /**
   * 订单详情
   */
  @Post('/detail', { summary: '订单详情' })
  async orderDetail(@Body('orderNo') orderNo: string) {
    const userId = this.ctx.user?.id || 1;
    const order = await this.homestayOrderService.getOrderDetail(orderNo, userId);
    return this.ok(order);
  }

  /**
   * 取消订单
   */
  @Post('/cancel', { summary: '取消订单' })
  async cancelOrder(
    @Body('orderNo') orderNo: string,
    @Body('reason') reason: string = '不想入住了'
  ) {
    const userId = this.ctx.user?.id || 1;
    await this.homestayOrderService.cancelOrder(orderNo, userId, reason);
    return this.ok();
  }

  /**
   * 模拟支付
   */
  @Post('/mockPay', { summary: '模拟支付' })
  async mockPay(@Body('orderNo') orderNo: string) {
    const userId = this.ctx.user?.id || 1;
    await this.homestayOrderService.mockPay(orderNo, userId);
    return this.ok();
  }
}
