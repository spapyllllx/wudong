import {
  BaseController,
  CoolController,
  CoolUrlTag,
} from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { ProductOrderEntity } from '../../entity/order';
import { ClothingOrderService } from '../../service/order';

/**
 * 商品订单(前台,需 C 端登录)
 * 说明:统一订单(核心组)未交付前,衣模块按设计文档 3.2.7 先行落地 product 订单。
 */
@CoolUrlTag()
@CoolController({ api: [], entity: ProductOrderEntity })
export class AppClothingOrderController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  clothingOrderService: ClothingOrderService;

  @Post('/create', { summary: '创建订单(立即购买)' })
  async create(@Body() body) {
    return this.ok(await this.clothingOrderService.create(this.ctx.user.id, body));
  }

  @Post('/pay', { summary: '模拟支付(pending→paid)' })
  async pay(@Body('orderId') orderId: number) {
    await this.clothingOrderService.payMock(this.ctx.user.id, orderId);
    return this.ok();
  }

  @Post('/cancel', { summary: '取消订单(回补库存)' })
  async cancel(@Body('orderId') orderId: number) {
    await this.clothingOrderService.cancel(this.ctx.user.id, orderId);
    return this.ok();
  }

  @Post('/confirm', { summary: '确认收货(paid→completed)' })
  async confirm(@Body('orderId') orderId: number) {
    await this.clothingOrderService.confirm(this.ctx.user.id, orderId);
    return this.ok();
  }

  @Get('/list', { summary: '我的订单(分页)' })
  async orderList(@Query() query) {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const size = Math.min(Math.max(parseInt(query.size) || 10, 1), 50);
    return this.ok(await this.clothingOrderService.myList(this.ctx.user.id, page, size));
  }
}
