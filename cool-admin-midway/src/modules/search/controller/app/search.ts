import { Post, Body, Inject, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
} from '@cool-midway/core';
import { SearchService } from '../../service/search';

/**
 * 搜索（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/search')
export class AppSearchController extends BaseController {
  @Inject()
  searchService: SearchService;

  @Inject()
  ctx;

  /**
   * 全局搜索
   */
  @Post('/global', { summary: '全局搜索' })
  async globalSearch(
    @Body('keyword') keyword: string,
    @Body('type') type?: string
  ) {
    const result = await this.searchService.globalSearch(keyword, type);
    return this.ok(result);
  }

  /**
   * 搜索建议
   */
  @Post('/suggest', { summary: '搜索建议' })
  async searchSuggest(@Body('keyword') keyword: string) {
    const result = await this.searchService.searchSuggest(keyword);
    return this.ok(result);
  }
}
