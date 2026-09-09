import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '住模块',
    description: '民宿预订业务模块',
    middlewares: [],
    globalMiddlewares: [],
    order: 20,
    menu: [],
  } as ModuleConfig;
};