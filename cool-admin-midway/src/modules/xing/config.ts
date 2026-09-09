import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '行模块',
    description: '门票+路线套餐业务模块',
    middlewares: [],
    globalMiddlewares: [],
    order: 20,
    menu: [],
  } as ModuleConfig;
};