import { Provide, Inject, Post, Body } from '@midwayjs/core';
import { CoolController, BaseController, CoolTag, TagTypes } from '@cool-midway/core';
import { Context } from '@midwayjs/koa';
import { BaseAppAuthService } from './service/auth';

/**
 * 用户端认证
 */
@Provide()
@CoolController('/app/auth')
export class BaseAppAuthController extends BaseController {
  @Inject()
  baseAppAuthService: BaseAppAuthService;

  @Inject()
  ctx: Context;

  /**
   * 登录
   */
  @CoolTag(TagTypes.IGNORE_TOKEN)
  @Post('/login', { summary: '用户登录' })
  async login(
    @Body('username') username: string,
    @Body('password') password: string
  ) {
    const result = await this.baseAppAuthService.login(username, password);
    return this.ok(result);
  }

  /**
   * 获取用户信息
   */
  @Post('/userInfo', { summary: '获取用户信息' })
  async userInfo() {
    const userId = this.ctx.user.userId;
    const userInfo = await this.baseAppAuthService.getUserInfo(userId);
    return this.ok(userInfo);
  }
}
