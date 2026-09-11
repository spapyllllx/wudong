import { Post, Body, Inject, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
} from '@cool-midway/core';
import { RestaurantService } from '../../service/restaurant';

/**
 * 餐厅（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/restaurant')
export class AppRestaurantController extends BaseController {
  @Inject()
  restaurantService: RestaurantService;

  @Inject()
  ctx;

  /**
   * 餐厅列表
   */
  @Post('/list', { summary: '餐厅列表' })
  async getList(
    @Body('page') page: number = 1,
    @Body('size') size: number = 10,
    @Body() params: any
  ) {
    const result = await this.restaurantService.getRestaurantList(page, size, params);
    return this.ok(result);
  }

  /**
   * 餐厅详情
   */
  @Post('/detail', { summary: '餐厅详情' })
  async detail(@Body('id') id: number) {
    const restaurant = await this.restaurantService.getRestaurantDetail(id);
    return this.ok(restaurant);
  }

  /**
   * 推荐餐厅
   */
  @Post('/recommend', { summary: '推荐餐厅' })
  async recommend(@Body('limit') limit: number = 4) {
    const list = await this.restaurantService.getRecommendRestaurants(limit);
    return this.ok(list);
  }
}
