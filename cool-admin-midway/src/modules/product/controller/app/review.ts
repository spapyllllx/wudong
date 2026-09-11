import { Post, Body, Inject, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolTag,
  TagTypes,
  CoolUrlTag,
} from '@cool-midway/core';
import { ProductReviewService } from '../../service/review';

/**
 * 商品评价（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/product/review')
export class AppProductReviewController extends BaseController {
  @Inject()
  productReviewService: ProductReviewService;

  @Inject()
  ctx;

  /**
   * 评价列表 - 允许游客访问
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/reviewList', { summary: '评价列表' })
  async reviewList(
    @Body('productId') productId: number,
    @Body('page') page: number = 1,
    @Body('size') size: number = 10
  ) {
    const result = await this.productReviewService.getReviewList(
      productId,
      page,
      size
    );
    return this.ok(result);
  }

  /**
   * 发布评价
   */
  @Post('/publishReview', { summary: '发布评价' })
  async publishReview(@Body() data: any) {
    const userId = this.ctx.user?.id || 1;
    const result = await this.productReviewService.publishReview({
      ...data,
      userId,
    });
    return this.ok(result);
  }

  /**
   * 点赞评价
   */
  @Post('/likeReview', { summary: '点赞评价' })
  async likeReview(@Body('reviewId') reviewId: number) {
    const userId = this.ctx.user?.id || 1;
    await this.productReviewService.likeReview(reviewId, userId);
    return this.ok();
  }

  /**
   * 取消点赞
   */
  @Post('/unlikeReview', { summary: '取消点赞评价' })
  async unlikeReview(@Body('reviewId') reviewId: number) {
    const userId = this.ctx.user?.id || 1;
    await this.productReviewService.unlikeReview(reviewId, userId);
    return this.ok();
  }
}
