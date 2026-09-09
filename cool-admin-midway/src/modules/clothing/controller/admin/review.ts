import { CoolController, BaseController } from '@cool-midway/core';
import { Body, Inject, Post } from '@midwayjs/core';
import { ProductReviewEntity } from '../../entity/review';
import { ClothingReviewService } from '../../service/review';

/**
 * 商品评价管理(admin)
 */
@CoolController({
  api: ['page', 'info', 'delete'],
  entity: ProductReviewEntity,
  pageQueryOp: {
    fieldEq: [
      { column: 'a.product_id', requestParam: 'productId' },
      { column: 'a.rating', requestParam: 'rating' },
    ],
    keyWordLikeFields: ['a.content'],
    addOrderBy: { id: 'DESC' },
  },
})
export class AdminClothingReviewController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  clothingReviewService: ClothingReviewService;

  @Post('/reply', { summary: '商家回复评价' })
  async reply(@Body('id') id: number, @Body('replyContent') replyContent: string) {
    await this.clothingReviewService.reply(id, replyContent);
    return this.ok();
  }
}
