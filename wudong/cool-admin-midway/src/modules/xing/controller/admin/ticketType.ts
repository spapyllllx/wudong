import { CoolController, BaseController } from '@cool-midway/core';
import { XingTicketTypeEntity } from '../../entity/ticketType';
import { XingTicketTypeService } from '../../service/ticketType';

/**
 * 票种信息
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: XingTicketTypeEntity,
  service: XingTicketTypeService,
  pageQueryOp: {
    keyWordLikeFields: ['a.name'],
    fieldEq: ['a.status', 'a.scenicId'],
  },
})
export class AdminXingTicketTypeController extends BaseController {}
