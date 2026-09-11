import { Body, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { RoomTypeEntity } from '../../entity/room_type';
import { RoomTypeService } from '../../service/room_type';

/**
 * 房型管理（管理后台）
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: RoomTypeEntity,
  service: RoomTypeService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
  },
})
export class AdminRoomTypeController extends BaseController {
  @Inject()
  roomTypeService: RoomTypeService;

  /**
   * 更新状态（上架/下架）
   */
  @Post('/updateStatus', { summary: '更新状态' })
  async updateStatus(@Body('id') id: number, @Body('status') status: number) {
    await this.roomTypeService.updateStatus(id, status);
    return this.ok();
  }
}
