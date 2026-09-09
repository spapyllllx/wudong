import {
  BaseController,
  CoolController,
  CoolTag,
  CoolUrlTag,
  TagTypes,
} from '@cool-midway/core';
import { Body, Get, Inject, Post, Query } from '@midwayjs/core';
import { ProductEntity } from '../../entity/product';
import { ClothingFavoriteService } from '../../service/favorite';
import { ClothingProductService } from '../../service/product';
import { ClothingReviewService } from '../../service/review';

/**
 * 商品(前台,列表/详情/搜索/评价公开;收藏/评价需登录)
 */
@CoolUrlTag()
@CoolController({ api: [], entity: ProductEntity })
export class AppClothingProductController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  clothingProductService: ClothingProductService;

  @Inject()
  clothingFavoriteService: ClothingFavoriteService;

  @Inject()
  clothingReviewService: ClothingReviewService;

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/list', { summary: '商品分页列表' })
  async list(@Query() query) {
    return this.ok(await this.clothingProductService.appPage(query));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/search', { summary: '搜索商品' })
  async search(@Query() query) {
    return this.ok(await this.clothingProductService.appSearch(query));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/detail', { summary: '商品详情' })
  async detail(@Query('id') id: number) {
    return this.ok(await this.clothingProductService.appDetail(id));
  }

  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/reviews', { summary: '商品评价分页' })
  async reviews(@Query() query) {
    return this.ok(await this.clothingReviewService.reviewPage(query));
  }

  @Post('/favorite', { summary: '收藏/取消收藏(toggle)' })
  async favorite(@Body('productId') productId: number) {
    return this.ok(
      await this.clothingFavoriteService.toggle(this.ctx.user.id, productId)
    );
  }

  @Get('/my-favorites', { summary: '我的收藏(分页)' })
  async myFavorites(@Query() query) {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const size = Math.min(Math.max(parseInt(query.size) || 10, 1), 50);
    return this.ok(
      await this.clothingFavoriteService.myFavorites(this.ctx.user.id, page, size)
    );
  }

  @Post('/review', { summary: '提交评价' })
  async review(@Body() body) {
    return this.ok(await this.clothingReviewService.submit(this.ctx.user.id, body));
  }
}
