import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    // 模块名称
    name: '票务模块',
    // 模块描述
    description: '景点门票、活动票务、订单管理',
    // 模块中间件
    middlewares: [],
    // 全局中间件
    globalMiddlewares: [],
  } as ModuleConfig;
};
