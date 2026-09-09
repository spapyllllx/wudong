import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '食模块',
    description: '餐饮美食+农产品业务模块',
    middlewares: [],
    globalMiddlewares: [],
    order: 20,
    menu: [],
  } as ModuleConfig;
};