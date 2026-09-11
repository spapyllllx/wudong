import { Body, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { TicketOrderEntity } from '../../entity/ticket_order';
import { TicketOrderService } from '../../service/ticket_order';

/**
 * 票务订单管理（管理后台）
 */
@Provide()
@CoolController({
  api: ['delete', 'info', 'list', 'page'],
  entity: TicketOrderEntity,
  service: TicketOrderService,
  pageQueryOp: {
    keyWordLikeFields: ['orderNo', 'contactName', 'contactPhone'],
    fieldEq: ['status', 'payStatus'],
  },
})
export class AdminTicketOrderController extends BaseController {
  @Inject()
  ticketOrderService: TicketOrderService;

  /**
   * 核销（使用门票）
   */
  @Post('/verify', { summary: '核销门票' })
  async verify(@Body('id') id: number) {
    await this.ticketOrderService.verifyTicket(id);
    return this.ok();
  }

  /**
   * 退款
   */
  @Post('/refund', { summary: '退款' })
  async refund(@Body('id') id: number, @Body('reason') reason: string) {
    await this.ticketOrderService.refundTicket(id, reason);
    return this.ok();
  }

  /**
   * 取消订单
   */
  @Post('/cancel', { summary: '取消订单' })
  async cancel(@Body('id') id: number, @Body('reason') reason: string) {
    await this.ticketOrderService.cancelTicket(id, reason);
    return this.ok();
  }
}
