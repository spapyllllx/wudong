import { ModuleConfig } from '@cool-midway/core';

export default () => {
  return {
    name: '社区模块',
    description: 'UGC照片分享业务模块',
    middlewares: [],
    globalMiddlewares: [],
    order: 20,
    menu: [],
  } as ModuleConfig;
};