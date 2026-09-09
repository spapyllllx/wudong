import { CoolController, BaseController } from '@cool-midway/core';
import { XingRouteItineraryEntity } from '../../entity/routeItinerary';
import { XingRouteItineraryService } from '../../service/routeItinerary';

/**
 * 路线行程-游客端
 */
@CoolController({
  api: ['info', 'list', 'page'],
  entity: XingRouteItineraryEntity,
  service: XingRouteItineraryService,
  pageQueryOp: {
    keyWordLikeFields: ['a.description'],
    fieldEq: ['a.routeId'],
  },
})
export class OpenXingRouteItineraryController extends BaseController {}
