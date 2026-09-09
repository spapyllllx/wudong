import { CoolEvent, Event } from '@cool-midway/core';
import { App, ILogger, IMidwayApplication, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseSysMenuEntity } from '../entity/sys/menu';
import { BaseSysRoleMenuEntity } from '../entity/sys/role_menu';
import { BaseSysUserRoleEntity } from '../entity/sys/user_role';
import { BaseSysUserEntity } from '../entity/sys/user';

/**
 * 接收事件
 */
@CoolEvent()
export class BaseAppEvent {
  @App()
  app: IMidwayApplication;

  @Inject()
  logger: ILogger;

  @InjectEntityModel(BaseSysMenuEntity)
  baseSysMenuEntity: Repository<BaseSysMenuEntity>;

  @InjectEntityModel(BaseSysRoleMenuEntity)
  baseSysRoleMenuEntity: Repository<BaseSysRoleMenuEntity>;

  @InjectEntityModel(BaseSysUserRoleEntity)
  baseSysUserRoleEntity: Repository<BaseSysUserRoleEntity>;

  @InjectEntityModel(BaseSysUserEntity)
  baseSysUserEntity: Repository<BaseSysUserEntity>;

  @Event('onServerReady')
  async onServerReady() {
    // 修复：确保 admin 角色有完整的菜单权限
    await this.fixRoleMenu();
    await this.fixUserRole();

    if (!process['pkg']) return;
    const port = this.app.getConfig('koa.port') || 8001;
    this.logger.info(`Server is running at http://127.0.0.1:${port}`);
    const url = `http://127.0.0.1:${port}`;

    const { exec } = require('child_process');
    let command;

    switch (process.platform) {
      case 'darwin':
        command = `open ${url}`;
        break;
      case 'win32':
        command = `start ${url}`;
        break;
      default:
        command = `xdg-open ${url}`;
        break;
    }

    console.log('url=>', url);
    exec(command, (error: any) => {
      if (!error) {
        this.logger.info(`Application has opened in browser at ${url}`);
      }
    });
  }

  /**
   * 修复 admin 角色的菜单权限
   */
  async fixRoleMenu() {
    try {
      const menus = await this.baseSysMenuEntity.find();
      if (menus.length === 0) return;

      const existing = await this.baseSysRoleMenuEntity.findBy({ roleId: 1 });
      const existingMenuIds = existing.map(r => r.menuId);
      const menuIds = menus.map(m => m.id);

      // 删除旧的脏数据
      await this.baseSysRoleMenuEntity.delete({ roleId: 1 });

      // 插入完整的菜单权限
      const now = new Date();
      for (const menuId of menuIds) {
        if (!existingMenuIds.includes(menuId)) {
          await this.baseSysRoleMenuEntity.insert({
            roleId: 1,
            menuId,
            createTime: now.toISOString().replace('T', ' ').substring(0, 19),
            updateTime: now.toISOString().replace('T', ' ').substring(0, 19),
          });
        }
      }
      this.logger.info(`[fix] role_menu fixed: ${menuIds.length} menus`);
    } catch (e) {
      this.logger.error(`[fix] role_menu error: ${e.message}`);
    }
  }

  /**
   * 修复 admin 用户的角色绑定
   */
  async fixUserRole() {
    try {
      const admin = await this.baseSysUserEntity.findOneBy({ username: 'admin' });
      if (!admin) return;

      const existing = await this.baseSysUserRoleEntity.findOneBy({ userId: admin.id, roleId: 1 });
      if (!existing) {
        await this.baseSysUserRoleEntity.insert({
          userId: admin.id,
          roleId: 1,
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        });
        this.logger.info(`[fix] user_role fixed: admin -> role 1`);
      }
    } catch (e) {
      this.logger.error(`[fix] user_role error: ${e.message}`);
    }
  }
}