import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    // 模块名称
    name: '餐饮模块',
    // 模块描述
    description: '餐厅管理、菜品管理、餐厅预订',
    // 模块中间件
    middlewares: [],
    // 全局中间件
    globalMiddlewares: [],
  } as ModuleConfig;
};
