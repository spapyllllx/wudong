import { Post, Body, Inject, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
} from '@cool-midway/core';
import { AttractionService } from '../../service/attraction';

/**
 * 景点（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/ticket/attraction')
export class AppAttractionController extends BaseController {
  @Inject()
  attractionService: AttractionService;

  @Inject()
  ctx;

  /**
   * 景点列表
   */
  @Post('/list', { summary: '景点列表' })
  async getList(
    @Body('page') page: number = 1,
    @Body('size') size: number = 10,
    @Body() params: any
  ) {
    const result = await this.attractionService.getAttractionList(page, size, params);
    return this.ok(result);
  }

  /**
   * 景点详情
   */
  @Post('/detail', { summary: '景点详情' })
  async detail(@Body('id') id: number) {
    const attraction = await this.attractionService.getAttractionDetail(id);
    return this.ok(attraction);
  }

  /**
   * 推荐景点
   */
  @Post('/recommend', { summary: '推荐景点' })
  async recommend(@Body('limit') limit: number = 4) {
    const list = await this.attractionService.getRecommendAttractions(limit);
    return this.ok(list);
  }
}
