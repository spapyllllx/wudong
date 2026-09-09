import {
  BaseController,
  CoolController,
  CoolUrlTag,
} from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { ProductRefundEntity } from '../../entity/refund';
import { ClothingRefundService } from '../../service/refund';

/**
 * 退款(前台,需 C 端登录)
 */
@CoolUrlTag()
@CoolController({ api: [], entity: ProductRefundEntity })
export class AppClothingRefundController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  clothingRefundService: ClothingRefundService;

  @Post('/apply', { summary: '申请退款' })
  async apply(@Body() body) {
    return this.ok(await this.clothingRefundService.apply(this.ctx.user.id, body));
  }

  @Get('/list', { summary: '我的退款申请' })
  async refundList(@Query() query) {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const size = Math.min(Math.max(parseInt(query.size) || 10, 1), 50);
    return this.ok(
      await this.clothingRefundService.myList(this.ctx.user.id, page, size)
    );
  }
}
