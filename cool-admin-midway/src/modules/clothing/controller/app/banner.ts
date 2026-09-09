import {
  BaseController,
  CoolController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { Get, Inject, Query } from '@midwayjs/core';
import { BannerEntity } from '../../entity/banner';
import { ClothingBannerService } from '../../service/banner';

/**
 * 轮播图(前台,公开)
 */
@CoolUrlTag()
@CoolController({ api: [], entity: BannerEntity })
export class AppClothingBannerController extends BaseController {
  @Inject()
  clothingBannerService: ClothingBannerService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '轮播图列表(公开)' })
  async bannerList(@Query('position') position: string) {
    return this.ok(await this.clothingBannerService.activeList(position || 'home'));
  }
}
