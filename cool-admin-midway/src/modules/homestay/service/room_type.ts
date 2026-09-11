import { Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { RoomTypeEntity } from '../entity/room_type';

/**
 * 房型服务
 */
@Provide()
export class RoomTypeService extends BaseService {
  @InjectEntityModel(RoomTypeEntity)
  roomTypeEntity: Repository<RoomTypeEntity>;

  /**
   * 管理端：更新状态
   */
  async updateStatus(id: number, status: number) {
    await this.roomTypeEntity.update(id, { status });
  }
}
