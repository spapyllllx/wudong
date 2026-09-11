import { Get, Post, Body, Inject, Provide, Query } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolTag,
  TagTypes,
  CoolUrlTag,
} from '@cool-midway/core';
import { ProductService } from '../../service/product';
import { ProductCategoryService } from '../../service/category';

/**
 * 商品（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/product')
export class AppProductController extends BaseController {
  @Inject()
  productService: ProductService;

  @Inject()
  productCategoryService: ProductCategoryService;

  @Inject()
  ctx;

  /**
   * 商品列表 - 允许游客访问
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/productList', { summary: '商品列表' })
  async productList(
    @Body('page') page: number = 1,
    @Body('size') size: number = 10,
    @Body('categoryId') categoryId?: number,
    @Body('keyword') keyword?: string,
    @Body('minPrice') minPrice?: number,
    @Body('maxPrice') maxPrice?: number,
    @Body('sort') sort?: string // sales: 销量, price-asc: 价格升序, price-desc: 价格降序
  ) {
    const result = await this.productService.getProductList(
      page,
      size,
      categoryId,
      keyword,
      sort,
      minPrice,
      maxPrice
    );
    return this.ok(result);
  }

  /**
   * 商品详情 - 允许游客访问
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/productDetail', { summary: '商品详情' })
  async productDetail(@Query('id') id: number) {
    const product = await this.productService.getProductDetail(id);
    return this.ok(product);
  }

  /**
   * 分类树 - 允许游客访问
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Get('/categoryTree', { summary: '分类树' })
  async categoryTree() {
    const tree = await this.productCategoryService.getCategoryTree();
    return this.ok(tree);
  }

  /**
   * 收藏商品
   */
  @Post('/favoriteProduct', { summary: '收藏商品' })
  async favoriteProduct(@Body('productId') productId: number) {
    const userId = this.ctx.user?.id || 1;
    await this.productService.favoriteProduct(productId, userId);
    return this.ok();
  }

  /**
   * 取消收藏
   */
  @Post('/unfavoriteProduct', { summary: '取消收藏' })
  async unfavoriteProduct(@Body('productId') productId: number) {
    const userId = this.ctx.user?.id || 1;
    await this.productService.unfavoriteProduct(productId, userId);
    return this.ok();
  }

  /**
   * 我的收藏列表
   */
  @Post('/myFavorites', { summary: '我的收藏列表' })
  async myFavorites(
    @Body('page') page: number = 1,
    @Body('size') size: number = 10
  ) {
    const userId = this.ctx.user?.id;
    if (!userId) {
      throw new Error('用户未登录');
    }
    const result = await this.productService.getMyFavorites(userId, page, size);
    return this.ok(result);
  }
}
