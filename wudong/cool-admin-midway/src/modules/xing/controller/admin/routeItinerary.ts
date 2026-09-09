import { CoolController, BaseController } from '@cool-midway/core';
import { XingRouteItineraryEntity } from '../../entity/routeItinerary';
import { XingRouteItineraryService } from '../../service/routeItinerary';

/**
 * 路线行程
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: XingRouteItineraryEntity,
  service: XingRouteItineraryService,
  pageQueryOp: {
    keyWordLikeFields: ['a.description'],
    fieldEq: ['a.routeId'],
  },
})
export class AdminXingRouteItineraryController extends BaseController {}
