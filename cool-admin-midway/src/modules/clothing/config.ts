import { ModuleConfig } from '@cool-midway/core';

/**
 * 衣模块(非遗商品电商)配置
 */
export default () => {
  return {
    // 模块名称
    name: '衣模块-非遗商品',
    // 模块描述
    description: '非遗商品电商:商品分类/商品/SKU/图片/收藏/评价',
    // 中间件，只对本模块有效
    middlewares: [],
    // 中间件，全局有效(app 端鉴权由 user 模块 UserMiddleware 统一处理)
    globalMiddlewares: [],
    // 模块加载顺序，默认为0，值越大越优先加载
    order: 0,
  } as ModuleConfig;
};
