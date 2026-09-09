import { CoolController, BaseController } from '@cool-midway/core';
import { XingTicketTypeEntity } from '../../entity/ticketType';
import { XingTicketTypeService } from '../../service/ticketType';

/**
 * 票种信息-游客端
 */
@CoolController({
  api: ['info', 'list', 'page'],
  entity: XingTicketTypeEntity,
  service: XingTicketTypeService,
  pageQueryOp: {
    keyWordLikeFields: ['a.name'],
    fieldEq: ['a.status', 'a.scenicId'],
  },
})
export class OpenXingTicketTypeController extends BaseController {}
