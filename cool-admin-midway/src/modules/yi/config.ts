import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '衣模块',
    description: '非遗商品电商业务模块',
    middlewares: [],
    globalMiddlewares: [],
    order: 20,
    menu: [],
  } as ModuleConfig;
};