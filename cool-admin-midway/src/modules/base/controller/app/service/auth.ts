import { Inject, Provide, Config } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as md5 from 'md5';
import * as jwt from 'jsonwebtoken';
import { BaseSysUserEntity } from '../../../entity/sys/user';

/**
 * 用户端认证服务
 */
@Provide()
export class BaseAppAuthService extends BaseService {
  @InjectEntityModel(BaseSysUserEntity)
  baseSysUserEntity: Repository<BaseSysUserEntity>;

  @Inject()
  ctx;

  @Config('module.user.jwt')
  jwtConfig;

  /**
   * 登录
   */
  async login(username: string, password: string) {
    // 查询用户
    const user = await this.baseSysUserEntity.findOne({
      where: { username }
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 验证密码
    const passwordMd5 = md5(password);
    if (user.password !== passwordMd5) {
      throw new Error('密码错误');
    }

    // 生成token
    const token = await this.generateToken(user);

    return {
      token,
      userInfo: {
        id: user.id,
        username: user.username,
        nickname: user.name || user.username,
        avatar: user.headImg || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      }
    };
  }

  /**
   * 生成token
   */
  async generateToken(user: BaseSysUserEntity) {
    const tokenInfo = {
      userId: user.id,
      username: user.username
    };

    return jwt.sign(tokenInfo, this.jwtConfig.secret, {
      expiresIn: '7d'
    });
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(userId: number) {
    const user = await this.baseSysUserEntity.findOne({
      where: { id: userId }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      nickname: user.name || user.username,
      avatar: user.headImg || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    };
  }
}
