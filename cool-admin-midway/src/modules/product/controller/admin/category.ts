import { Body, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ProductCategoryEntity } from '../../entity/category';
import { ProductCategoryService } from '../../service/category';

/**
 * 商品分类管理（管理后台）
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ProductCategoryEntity,
  service: ProductCategoryService,
  pageQueryOp: {
    keyWordLikeFields: ['name'],
  },
})
export class AdminProductCategoryController extends BaseController {
  @Inject()
  productCategoryService: ProductCategoryService;
}
