import { Body, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { HomestayEntity } from '../../entity/homestay';
import { HomestayService } from '../../service/homestay';

/**
 * 民宿管理（管理后台）
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: HomestayEntity,
  service: HomestayService,
  pageQueryOp: {
    keyWordLikeFields: ['name', 'address'],
  },
})
export class AdminHomestayController extends BaseController {
  @Inject()
  homestayService: HomestayService;

  /**
   * 更新状态（上架/下架）
   */
  @Post('/updateStatus', { summary: '更新状态' })
  async updateStatus(@Body('id') id: number, @Body('status') status: number) {
    await this.homestayService.updateStatus(id, status);
    return this.ok();
  }
}
