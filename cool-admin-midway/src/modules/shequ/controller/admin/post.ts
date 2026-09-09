import { Body, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ShequPostEntity } from '../../entity/post';
import { ShequPostService } from '../../service/post';

/**
 * 帖子管理（管理后台）
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ShequPostEntity,
  service: ShequPostService,
  pageQueryOp: {
    keyWordLikeFields: ['content', 'location'],
  },
})
export class AdminShequPostController extends BaseController {
  @Inject()
  shequPostService: ShequPostService;

  /**
   * 审核帖子
   */
  @Post('/updateStatus', { summary: '审核帖子' })
  async updateStatus(
    @Body('id') id: number,
    @Body('status') status: number,
    @Body('auditRemark') auditRemark: string
  ) {
    await this.shequPostService.updateStatus(id, status, auditRemark);
    return this.ok();
  }

  /**
   * 设置精华
   */
  @Post('/setEssence', { summary: '设置精华' })
  async setEssence(@Body('id') id: number, @Body('isEssence') isEssence: number) {
    await this.shequPostService.setEssence(id, isEssence);
    return this.ok();
  }

  /**
   * 设置置顶
   */
  @Post('/setTop', { summary: '设置置顶' })
  async setTop(@Body('id') id: number, @Body('isTop') isTop: number) {
    await this.shequPostService.setTop(id, isTop);
    return this.ok();
  }
}
