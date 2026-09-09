import { CoolEvent, Event } from '@cool-midway/core';
import { App, ILogger, IMidwayApplication, Inject } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseSysMenuEntity } from '../entity/sys/menu';
import { BaseSysRoleMenuEntity } from '../entity/sys/role_menu';
import { BaseSysUserRoleEntity } from '../entity/sys/user_role';
import { BaseSysUserEntity } from '../entity/sys/user';

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

  @Event('onMenuInit')
  async onMenuInit() {
    await this.fixRoleMenu();
    await this.fixUserRole();
  }

  async fixRoleMenu() {
    try {
      const menus = await this.baseSysMenuEntity.find();
      if (menus.length === 0) return;
      const existing = await this.baseSysRoleMenuEntity.findBy({ roleId: 1 });
      const existingMenuIds = existing.map((r: any) => r.menuId);
      const menuIds = menus.map((m: any) => m.id);
      await this.baseSysRoleMenuEntity.delete({ roleId: 1 });
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
      this.logger.info('[fix] role_menu fixed: ' + menuIds.length + ' menus');
    } catch (e: any) {
      this.logger.error('[fix] role_menu error: ' + e.message);
    }
  }

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
        this.logger.info('[fix] user_role fixed: admin -> role 1');
      }
    } catch (e: any) {
      this.logger.error('[fix] user_role error: ' + e.message);
    }
  }
}