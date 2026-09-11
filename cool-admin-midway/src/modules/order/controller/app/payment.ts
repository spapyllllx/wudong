import { Post, Body, Inject, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
} from '@cool-midway/core';
import { PaymentService } from '../../service/payment';

/**
 * 支付（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/payment')
export class AppPaymentController extends BaseController {
  @Inject()
  paymentService: PaymentService;

  @Inject()
  ctx;

  /**
   * 模拟支付
   */
  @Post('/mock', { summary: '模拟支付' })
  async mockPay(@Body('orderNo') orderNo: string) {
    const userId = this.ctx.user?.id || 1;
    await this.paymentService.mockPay(orderNo, userId);
    return this.ok();
  }
}
