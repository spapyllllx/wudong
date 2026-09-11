import { Body, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { AttractionEntity } from '../../entity/attraction';
import { AttractionService } from '../../service/attraction';

/**
 * 景点/活动管理（管理后台）
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: AttractionEntity,
  service: AttractionService,
  pageQueryOp: {
    keyWordLikeFields: ['name', 'address'],
  },
})
export class AdminAttractionController extends BaseController {
  @Inject()
  attractionService: AttractionService;

  /**
   * 更新状态（上架/下架）
   */
  @Post('/updateStatus', { summary: '更新状态' })
  async updateStatus(@Body('id') id: number, @Body('status') status: number) {
    await this.attractionService.updateStatus(id, status);
    return this.ok();
  }
}
