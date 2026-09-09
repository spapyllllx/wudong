import { CoolController, BaseController } from '@cool-midway/core';
import { BannerEntity } from '../../entity/banner';

/**
 * 轮播图管理(admin)
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: BannerEntity,
  pageQueryOp: {
    fieldEq: ['a.status', { column: 'a.position', requestParam: 'position' }],
    addOrderBy: { sort: 'ASC' },
  },
})
export class AdminClothingBannerController extends BaseController {}
