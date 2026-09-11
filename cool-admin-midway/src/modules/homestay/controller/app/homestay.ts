import { Post, Body, Inject, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
} from '@cool-midway/core';
import { HomestayService } from '../../service/homestay';

/**
 * 民宿（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/homestay')
export class AppHomestayController extends BaseController {
  @Inject()
  homestayService: HomestayService;

  @Inject()
  ctx;

  /**
   * 民宿列表
   */
  @Post('/list', { summary: '民宿列表' })
  async getList(
    @Body('page') page: number = 1,
    @Body('size') size: number = 10,
    @Body() params: any
  ) {
    const result = await this.homestayService.getHomestayList(page, size, params);
    return this.ok(result);
  }

  /**
   * 民宿详情
   */
  @Post('/detail', { summary: '民宿详情' })
  async detail(@Body('id') id: number) {
    const homestay = await this.homestayService.getHomestayDetail(id);
    return this.ok(homestay);
  }

  /**
   * 推荐民宿
   */
  @Post('/recommend', { summary: '推荐民宿' })
  async recommend(@Body('limit') limit: number = 4) {
    const list = await this.homestayService.getRecommendHomestays(limit);
    return this.ok(list);
  }
}
