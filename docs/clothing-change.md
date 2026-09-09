# 衣模块(非遗商品电商)修改说明

> 第1组 · 分支 `feature/clothing-module`(基于 dev=origin/develop 0ed1c06) · 2026-09-09

## 一、本次改动概览

在 cool-admin-midway 框架内**新增**衣模块,未修改任何既有文件。新建文件 22 个:

| 类别 | 文件 |
|---|---|
| 模块配置 | `cool-admin-midway/src/modules/clothing/config.ts` |
| 实体(6+1) | `.../clothing/entity/{common,category,product,sku,image,favorite,review}.ts` |
| 服务(4) | `.../clothing/service/{category,product,favorite,review}.ts` |
| admin 控制器(3) | `.../clothing/controller/admin/{category,product,review}.ts` |
| app 控制器(2) | `.../clothing/controller/app/{category,product}.ts` |
| 种子数据 | `.../clothing/db.json`(分类 5 条,启动自动导入) |
| SQL 交付 | `database/clothing_module.sql` |
| 文档 | `docs/clothing-db.md`、`docs/clothing-api.md`、`docs/clothing-change.md` |

提交记录(6 个,均在 `feature/clothing-module`):
feat 实体 / feat 服务层 / feat admin 接口 / feat app 接口 / docs SQL / docs 文档(本文件随最后一笔提交)

## 二、实现要点与取舍(重要,合并/联调前请阅读)

1. **表结构严格对齐技术文档**:6 张表与 `database/init_database.sql`(84-174 行)一致,本地由 TypeORM synchronize 建表。实体未继承 base 模块 BaseEntity(其列为 camelCase),采用显式 `@Column({name})` snake_case 映射,详见 `docs/clothing-db.md` 第三节。
2. **公共表零依赖原则**:products.merchant_id / product_reviews.order_id / user_id 均只存关联字段,不建表、不加外键、不校验存在。
3. **商品嵌套保存为"全量替换"**:admin update 商品时先删该商品全部 skus/images 再重建。
   - 代价:SKU 累计销量 sales 会被清零、SKU id 变化;
   - 本阶段商品编辑低频且订单未落地,可接受;**订单模块联调时升级为按 id 增量合并**。
4. **商家未落地,merchant_id 占位 0**:新增商品时若请求未传 merchantId,默认写 0;商家/入驻模块交付后由商家组对接,需补数据迁移。
5. **评价不校验订单**:orders 未实现前 submit 只落库 order_id(TODO:订单模块落地后补"订单存在、属于该用户且含该商品"校验);商品存在性与 on_sale 状态已校验。
6. **删除语义**:admin 删商品走框架"回收站快照+物理删除",回收站**不包含**其 skus/images(删除前已级联物理删除);评价/收藏记录保留(评价列表仍可见,商品详情不可达)。
7. **软删除**:products.deletedAt 由 TypeORM `@DeleteDateColumn` 维护,ORM 查询自动过滤 `deleted_at IS NULL`;手工 SQL 均已显式加该条件。后台"下架"用 status=off_sale,与删除分离。
8. **字段命名双轨差异(已知行为)**:admin 自动 page/list 为原生 SQL,响应键=数据库列名(snake_case);add/update 请求体键=实体属性(camelCase)。前台接口输出统一 snake_case。管理后台 Vue 页面(后续轮次)按 `docs/clothing-api.md` 处理该差异。
9. **FULLTEXT ft_title**:为 schema 一致而建;MySQL 未配中文分词,前台搜索实际使用 LIKE(已参数化),关键字命中 title/subtitle。
10. **并发收藏**依赖 `uk_user_product` 唯一键兜底,重复 insert 按"已收藏"处理。
11. **上传**:未新写上传服务,商品图/评价图直接复用框架 `/admin/base/comm/upload`、`/app/base/comm/upload`。

## 三、验证记录(本地,2026-09-09 实测通过)

- 库 `cool-admin-midway` 启动后自动建出 6 张表,`SHOW CREATE TABLE` 与交付 SQL 一致(差异仅注释级)
- 分类种子 5 条自动导入(product_categories),`base_sys_conf` 写入 `init_db_clothing` 标记
- 公开接口实测:category/list(5 条)、product/list(含 rating/review_count 聚合)、product/detail(id=1,含 images/skus/craft_intro)、product/reviews、search(中文关键词)全部 HTTP 200、code 1000
- 需登录接口实测(C 端密码登录,`user_info` 测试账号 13800000000):favorite toggle true→false、my-favorites(含 favorited_at)、review 提交(返回 id)全部通过;**注意:本框架 app 端 Authorization 需传裸 token(不带 Bearer 前缀),否则 401**
- 数值类型实测:bigint/decimal 列 JSON 输出统一为 number,时间输出 `YYYY-MM-DD HH:mm:ss`
- 未调 admin 登录接口(已知:其空验证码会抛未捕获异常致进程退出,框架缺陷,联调走前端页面);admin 写接口(商品 add/update/delete 含嵌套)留待管理后台页面联调时验证

## 四、后续增补(2026-09-09 第二轮)

1. **下单闭环已落地(先行版)**:按设计文档 3.2.7 将公共订单 orders/product_order_items/product_order_logistics 先行落地(实体+`database/clothing_order_module.sql`,头部注明核心组合并约定;order_refunds 未落地,退款功能未提供)。衣订单状态机 pending→(模拟支付)paid→completed、pending 可取消回补库存;下单行锁防超卖、明细与收货快照。实测:下单扣库存→支付累加销量→确认收货→取消回补 全链路通过。
2. **管理后台页面全部完成**:商品管理(查看详情/SKU 图片可视化编辑 SKU 行)/分类管理/评价管理(回复)/库存管理(按 SKU 调库存)/订单管理(product 订单分页)/商城预览(游客:分类/搜索/排序/详情/购买)。菜单由 clothing/menu.json 自动注入(6 页面+按钮权限),首次启动或删除 `init_menu_clothing` 标记后重启导入。
3. **商城预览为演示闭环**:内置"游客登录"(测试账号 13800000000/123456,仅本地演示,生产须移除);/app 接口因管理端请求拦截器强制覆盖 Authorization,商城页使用独立 axios 实例携带 C 端 token;vue 代理已加 `/app/` 转发规则(src/config/proxy.ts)。
4. **三端齐备(2026-09-09 第三轮)**:仓库内新增 `pc-web`(Vue3 独立游客商城,端口 3000,连 /app 接口)与 `miniprogram`(原生微信小程序,零依赖,微信开发者工具导入,baseUrl 在 app.js 可配)。三端共用后端与数据。
5. **购物车与结算**:公共 carts 表按设计文档 3.2.8 先行落地(`database/clothing_cart_module.sql`,合并约定同订单);接口 /app/clothing/cart add|update|remove|list;下单 create 支持多 SKU(items 数组,兼容旧单 SKU 格式),购物车结算一次生成订单;PC/小程序均提供加入购物车、数量调整、删除、结算。
6. **评价归属校验已落地**(订单表落地后补齐):评价须订单存在、属于该用户、包含该商品且已支付(paid/completed),同单同商品不可重复评;PC 我的订单与小程序「我的」均提供"去评价"入口。

## 五、后续 TODO

- [ ] 核心组统一订单交付后:以本先行版为基础合并;评价补订单归属校验;接入真实支付
- [ ] 商家模块落地后:merchant_id 数据迁移与商家数据隔离(@MerchantScope 中间件接入)
- [ ] 退款(order_refunds)功能
- [ ] 小程序/PC 商品页(uni-app 项目不在本仓库,另行交付)
