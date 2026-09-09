import {
  BaseController,
  CoolController,
  CoolUrlTag,
} from '@cool-midway/core';
import { Body, Get, Inject, Post } from '@midwayjs/core';
import { CartEntity } from '../../entity/cart';
import { ClothingCartService } from '../../service/cart';

/**
 * 购物车(前台,需 C 端登录)
 */
@CoolUrlTag()
@CoolController({ api: [], entity: CartEntity })
export class AppClothingCartController extends BaseController {
  @Inject()
  ctx;

  @Inject()
  clothingCartService: ClothingCartService;

  @Post('/add', { summary: '加入购物车' })
  async addCartItem(@Body('skuId') skuId: number, @Body('quantity') quantity: number) {
    return this.ok(
      await this.clothingCartService.addCart(this.ctx.user.id, skuId, quantity || 1)
    );
  }

  @Post('/update', { summary: '修改数量' })
  async updateCartItem(
    @Body('id') id: number,
    @Body('quantity') quantity: number
  ) {
    await this.clothingCartService.updateQuantity(this.ctx.user.id, id, quantity);
    return this.ok();
  }

  @Post('/remove', { summary: '删除(批量)' })
  async remove(@Body('ids') ids: number[]) {
    await this.clothingCartService.remove(this.ctx.user.id, ids);
    return this.ok();
  }

  @Get('/list', { summary: '购物车列表' })
  async cartList() {
    return this.ok(await this.clothingCartService.cartList(this.ctx.user.id));
  }
}
