import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '购物车模块',
    description: '购物车业务模块',
    middlewares: [],
    globalMiddlewares: [],
    order: 20,
    menu: [],
  } as ModuleConfig;
};