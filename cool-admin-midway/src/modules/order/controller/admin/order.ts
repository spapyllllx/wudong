import { Body, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { OrderEntity } from '../../entity/order';
import { OrderService } from '../../service/order';

/**
 * 订单管理（管理后台）
 */
@Provide()
@CoolController({
  api: ['delete', 'info', 'list', 'page'],
  entity: OrderEntity,
  service: OrderService,
  pageQueryOp: {
    keyWordLikeFields: ['orderNo', 'receiverName', 'receiverPhone'],
    fieldEq: ['status', 'payStatus'],
  },
})
export class AdminOrderController extends BaseController {
  @Inject()
  orderService: OrderService;

  /**
   * 订单详情（含商品和日志）
   */
  @Post('/detail', { summary: '订单详情' })
  async detail(@Body('id') id: number) {
    const data = await this.orderService.getAdminOrderDetail(id);
    return this.ok(data);
  }

  /**
   * 发货
   */
  @Post('/ship', { summary: '订单发货' })
  async ship(@Body('id') id: number) {
    await this.orderService.shipOrder(id);
    return this.ok();
  }

  /**
   * 取消订单
   */
  @Post('/cancel', { summary: '取消订单' })
  async cancel(@Body('id') id: number, @Body('reason') reason: string) {
    await this.orderService.adminCancelOrder(id, reason);
    return this.ok();
  }
}
