import { CoolController, BaseController } from '@cool-midway/core';
import { XingScenicEntity } from '../../entity/scenic';
import { XingScenicService } from '../../service/scenic';

/**
 * 景区信息-游客端
 */
@CoolController({
  api: ['info', 'list', 'page'],
  entity: XingScenicEntity,
  service: XingScenicService,
  pageQueryOp: {
    keyWordLikeFields: ['a.name', 'a.address', 'a.description'],
    fieldEq: ['a.status'],
  },
})
export class OpenXingScenicController extends BaseController {}
