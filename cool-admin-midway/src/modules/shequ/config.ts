import { ModuleConfig } from '@cool-midway/core';

/**
 * 模块配置
 */
export default () => {
  return {
    // 模块名称
    name: '社区模块 - UGC照片分享',
    // 模块描述
    description: '用户照片分享、帖子发布、评论互动、点赞功能',
    // 模块中间件
    middlewares: [],
    // 全局中间件
    globalMiddlewares: [],
  } as ModuleConfig;
};
