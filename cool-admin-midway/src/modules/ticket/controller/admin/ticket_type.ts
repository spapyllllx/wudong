import { Body, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { TicketTypeEntity } from '../../entity/ticket_type';
import { TicketTypeService } from '../../service/ticket_type';

/**
 * 票型管理（管理后台）
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: TicketTypeEntity,
  service: TicketTypeService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
  },
})
export class AdminTicketTypeController extends BaseController {
  @Inject()
  ticketTypeService: TicketTypeService;

  /**
   * 更新状态（上架/下架）
   */
  @Post('/updateStatus', { summary: '更新状态' })
  async updateStatus(@Body('id') id: number, @Body('status') status: number) {
    await this.ticketTypeService.updateStatus(id, status);
    return this.ok();
  }
}
