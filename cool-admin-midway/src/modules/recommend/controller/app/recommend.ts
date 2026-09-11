import { Post, Inject, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
} from '@cool-midway/core';
import { RecommendService } from '../../service/recommend';

/**
 * 推荐（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/recommend')
export class AppRecommendController extends BaseController {
  @Inject()
  recommendService: RecommendService;

  @Inject()
  ctx;

  /**
   * 首页推荐
   */
  @Post('/home', { summary: '首页推荐' })
  async homeRecommend() {
    const result = await this.recommendService.getHomeRecommend();
    return this.ok(result);
  }
}
