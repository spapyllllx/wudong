import { CoolController, BaseController } from '@cool-midway/core';
import { ProductCategoryEntity } from '../../entity/category';

/**
 * 商品分类管理(admin)
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ProductCategoryEntity,
  pageQueryOp: {
    fieldEq: [
      'a.status',
      { column: 'a.parent_id', requestParam: 'parentId' },
    ],
    keyWordLikeFields: ['a.name'],
    addOrderBy: { sort: 'ASC' },
  },
})
export class AdminClothingCategoryController extends BaseController {}
