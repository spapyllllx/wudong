import { Post, Body, Inject, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
} from '@cool-midway/core';
import { CartService } from '../../service/cart';

/**
 * 购物车（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/cart')
export class AppCartController extends BaseController {
  @Inject()
  cartService: CartService;

  @Inject()
  ctx;

  /**
   * 添加到购物车
   */
  @Post('/add', { summary: '添加到购物车' })
  async addToCart(@Body() data: any) {
    const userId = this.ctx.user?.id || 1;
    const result = await this.cartService.addToCart(userId, data);
    return this.ok(result);
  }

  /**
   * 购物车列表
   */
  @Post('/list', { summary: '购物车列表' })
  async cartList() {
    const userId = this.ctx.user?.id || 1;
    const list = await this.cartService.getCartList(userId);
    return this.ok(list);
  }

  /**
   * 更新数量
   */
  @Post('/updateQuantity', { summary: '更新数量' })
  async updateQuantity(
    @Body('id') id: number,
    @Body('quantity') quantity: number
  ) {
    const userId = this.ctx.user?.id || 1;
    await this.cartService.updateQuantity(id, userId, quantity);
    return this.ok();
  }

  /**
   * 更新选中状态
   */
  @Post('/updateSelected', { summary: '更新选中状态' })
  async updateSelected(
    @Body('id') id: number,
    @Body('selected') selected: number
  ) {
    const userId = this.ctx.user?.id || 1;
    await this.cartService.updateSelected(id, userId, selected);
    return this.ok();
  }

  /**
   * 全选/取消全选
   */
  @Post('/selectAll', { summary: '全选/取消全选' })
  async selectAll(@Body('selected') selected: number) {
    const userId = this.ctx.user?.id || 1;
    await this.cartService.selectAll(userId, selected);
    return this.ok();
  }

  /**
   * 删除购物车商品
   */
  @Post('/remove', { summary: '删除购物车商品' })
  async removeFromCart(@Body('id') id: number) {
    const userId = this.ctx.user?.id || 1;
    await this.cartService.removeFromCart(id, userId);
    return this.ok();
  }

  /**
   * 批量删除
   */
  @Post('/batchRemove', { summary: '批量删除' })
  async batchRemove(@Body('ids') ids: number[]) {
    const userId = this.ctx.user?.id || 1;
    await this.cartService.batchRemove(ids, userId);
    return this.ok();
  }

  /**
   * 清空购物车
   */
  @Post('/clear', { summary: '清空购物车' })
  async clearCart() {
    const userId = this.ctx.user?.id || 1;
    await this.cartService.clearCart(userId);
    return this.ok();
  }

  /**
   * 购物车数量
   */
  @Post('/count', { summary: '购物车数量' })
  async cartCount() {
    const userId = this.ctx.user?.id || 1;
    const count = await this.cartService.getCartCount(userId);
    return this.ok(count);
  }

  /**
   * 获取选中的商品
   */
  @Post('/selectedItems', { summary: '获取选中的商品' })
  async selectedItems() {
    const userId = this.ctx.user?.id || 1;
    const items = await this.cartService.getSelectedItems(userId);
    return this.ok(items);
  }
}
