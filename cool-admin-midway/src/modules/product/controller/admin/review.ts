import { Body, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ProductReviewEntity } from '../../entity/review';
import { ProductReviewService } from '../../service/review';

/**
 * 商品评价管理（管理后台）
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ProductReviewEntity,
  service: ProductReviewService,
  pageQueryOp: {
    keyWordLikeFields: ['content'],
  },
})
export class AdminProductReviewController extends BaseController {
  @Inject()
  productReviewService: ProductReviewService;

  /**
   * 审核评价
   */
  @Post('/updateStatus', { summary: '审核评价' })
  async updateStatus(
    @Body('id') id: number,
    @Body('status') status: number,
    @Body('replyContent') replyContent?: string
  ) {
    await this.productReviewService.updateStatus(id, status, replyContent);
    return this.ok();
  }

  /**
   * 商家回复评价
   */
  @Post('/replyReview', { summary: '回复评价' })
  async replyReview(
    @Body('id') id: number,
    @Body('replyContent') replyContent: string
  ) {
    await this.productReviewService.replyReview(id, replyContent);
    return this.ok();
  }
}
