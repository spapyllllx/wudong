import {
  BaseController,
  CoolController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { Get, Inject } from '@midwayjs/core';
import { ProductCategoryEntity } from '../../entity/category';
import { ClothingCategoryService } from '../../service/category';

/**
 * 商品分类(前台,公开)
 */
@CoolUrlTag()
@CoolController({ api: [], entity: ProductCategoryEntity })
export class AppClothingCategoryController extends BaseController {
  @Inject()
  clothingCategoryService: ClothingCategoryService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '分类列表(仅启用)' })
  async list() {
    return this.ok(await this.clothingCategoryService.activeList());
  }
}
