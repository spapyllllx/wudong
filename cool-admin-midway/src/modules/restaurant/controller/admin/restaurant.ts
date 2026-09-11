import { Body, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { RestaurantEntity } from '../../entity/restaurant';
import { RestaurantService } from '../../service/restaurant';

/**
 * 餐厅管理（管理后台）
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: RestaurantEntity,
  service: RestaurantService,
  pageQueryOp: {
    keyWordLikeFields: ['name', 'address'],
  },
})
export class AdminRestaurantController extends BaseController {
  @Inject()
  restaurantService: RestaurantService;

  /**
   * 更新状态（上架/下架）
   */
  @Post('/updateStatus', { summary: '更新状态' })
  async updateStatus(@Body('id') id: number, @Body('status') status: number) {
    await this.restaurantService.updateStatus(id, status);
    return this.ok();
  }
}
