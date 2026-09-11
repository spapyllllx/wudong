import { Body, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { ProductEntity } from '../../entity/product';
import { ProductService } from '../../service/product';

/**
 * 商品管理（管理后台）
 */
@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ProductEntity,
  service: ProductService,
  pageQueryOp: {
    keyWordLikeFields: ['title', 'subtitle'],
  },
})
export class AdminProductController extends BaseController {
  @Inject()
  productService: ProductService;

  /**
   * 更新商品状态（上架/下架）
   */
  @Post('/updateStatus', { summary: '更新商品状态' })
  async updateStatus(
    @Body('id') id: number,
    @Body('status') status: number
  ) {
    await this.productService.updateStatus(id, status);
    return this.ok();
  }

  /**
   * 设置推荐商品
   */
  @Post('/setRecommend', { summary: '设置推荐' })
  async setRecommend(
    @Body('id') id: number,
    @Body('isRecommend') isRecommend: number
  ) {
    await this.productService.setRecommend(id, isRecommend);
    return this.ok();
  }
}
