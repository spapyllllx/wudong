import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TicketTypeEntity } from '../entity/ticket_type';

/**
 * 票型服务
 */
@Provide()
export class TicketTypeService extends BaseService {
  @InjectEntityModel(TicketTypeEntity)
  ticketTypeEntity: Repository<TicketTypeEntity>;

  /**
   * 管理端：更新状态
   */
  async updateStatus(id: number, status: number) {
    await this.ticketTypeEntity.update(id, { status });
  }
}
