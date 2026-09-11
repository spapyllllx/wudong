import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    // 模块名称
    name: '购物车模块',
    // 模块描述
    description: '购物车管理、加入购物车、修改数量、批量操作',
    // 模块中间件
    middlewares: [],
    // 全局中间件
    globalMiddlewares: [],
  } as ModuleConfig;
};
