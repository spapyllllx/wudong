import { CoolController, BaseController } from '@cool-midway/core';
import { XingRouteEntity } from '../../entity/route';
import { XingRouteService } from '../../service/route';

/**
 * 路线套餐-游客端
 */
@CoolController({
  api: ['info', 'list', 'page'],
  entity: XingRouteEntity,
  service: XingRouteService,
  pageQueryOp: {
    keyWordLikeFields: ['a.title', 'a.description'],
    fieldEq: ['a.status'],
  },
})
export class OpenXingRouteController extends BaseController {}
