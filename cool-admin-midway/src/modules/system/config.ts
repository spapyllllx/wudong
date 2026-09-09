import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '系统管理模块',
    description: '轮播图+公告+敏感词+消息+商户申请业务模块',
    middlewares: [],
    globalMiddlewares: [],
    order: 20,
    menu: [],
  } as ModuleConfig;
};