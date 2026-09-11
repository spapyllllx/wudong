import { Post, Body, Inject, Provide } from '@midwayjs/core';
import {
  CoolController,
  BaseController,
  CoolUrlTag,
} from '@cool-midway/core';
import { UserAddressService } from '../../service/user_address';

/**
 * 用户地址（用户端）
 */
@CoolUrlTag()
@Provide()
@CoolController('/app/address')
export class AppAddressController extends BaseController {
  @Inject()
  userAddressService: UserAddressService;

  @Inject()
  ctx;

  /**
   * 地址列表
   */
  @Post('/list', { summary: '地址列表' })
  async list() {
    const userId = this.ctx.user?.id || 1;
    const list = await this.userAddressService.getAddressList(userId);
    return this.ok(list);
  }

  /**
   * 获取默认地址
   */
  @Post('/default', { summary: '获取默认地址' })
  async getDefault() {
    const userId = this.ctx.user?.id || 1;
    const address = await this.userAddressService.getDefaultAddress(userId);
    return this.ok(address);
  }

  /**
   * 添加地址
   */
  @Post('/create', { summary: '添加地址' })
  async create(@Body() data: any) {
    const userId = this.ctx.user?.id || 1;
    const address = await this.userAddressService.addAddress(userId, data);
    return this.ok(address);
  }

  /**
   * 更新地址
   */
  @Post('/modify', { summary: '更新地址' })
  async modify(@Body('id') id: number, @Body() data: any) {
    const userId = this.ctx.user?.id || 1;
    const address = await this.userAddressService.updateAddress(id, userId, data);
    return this.ok(address);
  }

  /**
   * 设置默认地址
   */
  @Post('/setDefault', { summary: '设置默认地址' })
  async setDefault(@Body('id') id: number) {
    const userId = this.ctx.user?.id || 1;
    await this.userAddressService.setDefaultAddress(id, userId);
    return this.ok();
  }

  /**
   * 删除地址
   */
  @Post('/remove', { summary: '删除地址' })
  async remove(@Body('id') id: number) {
    const userId = this.ctx.user?.id || 1;
    await this.userAddressService.deleteAddress(id, userId);
    return this.ok();
  }
}
