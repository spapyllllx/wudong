import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '订单模块',
    description: '统一订单+退款业务模块',
    middlewares: [],
    globalMiddlewares: [],
    order: 20,
    menu: [],
  } as ModuleConfig;
};