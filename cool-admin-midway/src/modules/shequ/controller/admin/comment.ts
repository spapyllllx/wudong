import { Inject, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ShequCommentEntity } from '../../entity/comment';
import { ShequCommentService } from '../../service/comment';

/**
 * 评论管理（管理后台）
 */
@Provide()
@CoolController({
  api: ['delete', 'list', 'page'],
  entity: ShequCommentEntity,
  service: ShequCommentService,
  pageQueryOp: {
    keyWordLikeFields: ['content'],
    fieldEq: ['status'],
  },
})
export class AdminShequCommentController extends BaseController {
  @Inject()
  shequCommentService: ShequCommentService;
}
