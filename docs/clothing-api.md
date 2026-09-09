# 衣模块(非遗商品电商)接口说明

> 第1组 · 分支 `feature/clothing-module` · 2026-09-09

## 一、通用约定

- Base URL:本地 `http://127.0.0.1:8001`(cool-admin-midway 默认端口,Swagger:http://127.0.0.1:8001/swagger-ui)
- 统一响应:`{ code, message, data }`;code=1000 表示成功(其余为错误码,message 为提示)
- 分页请求参数:`page`(默认1)、`size`(默认10,最大50);分页响应 `data = { list: [], pagination: { page, size, total } }`
- 字段命名:响应字段为**小写下划线**(与表结构一致),如 `category_id`、`main_image`、`created_at`
- 金额字段(DECIMAL)统一返回 **number**;时间字段返回 `YYYY-MM-DD HH:mm:ss` 字符串
- 鉴权:需登录接口在 Header 带 `Authorization: Bearer <token>`(app 端 token 由 `/app/user/login/password` 等获取;admin 端由后台登录获取)
- 需登录接口未带/带错 token 返回 HTTP 401

## 二、后台管理接口(admin,登录+权限)

| 方法 | 路径 | 说明 | 关键参数 |
|---|---|---|---|
| POST | /admin/clothing/category/add | 新增分类 | body: parentId/name/icon/sort/status |
| POST | /admin/clothing/category/update | 修改分类 | body: id + 上述字段 |
| POST | /admin/clothing/category/delete | 删除分类 | body: {ids:[]} |
| GET | /admin/clothing/category/info | 分类详情 | id |
| POST | /admin/clothing/category/page | 分类分页 | page/size/status/parentId/keyWord |
| POST | /admin/clothing/category/list | 全量列表 | |
| POST | /admin/clothing/product/add | 新增商品(含SKU/图片) | body: categoryId/merchantId(可选,默认0)/title/subtitle/mainImage/price/marketPrice/stock/detail/craftIntro/inheritorId/status + `skus:[{skuName,price,stock,image,attrs,status}]` + `images:[{url,sort}]` |
| POST | /admin/clothing/product/update | 修改商品(SKUs/images **全量替换**) | body: id + 同上 |
| POST | /admin/clothing/product/delete | 删除商品(级联删 SKU/图片,进回收站) | body: {ids:[]} |
| GET | /admin/clothing/product/info | 商品主表信息 | id |
| POST | /admin/clothing/product/page | 商品分页 | page/size/status/categoryId/merchantId/keyWord(标题) |
| GET | /admin/clothing/product/detail | 商品完整信息(编辑回显) | id → 含 skus/images |
| POST | /admin/clothing/review/page | 评价分页 | page/size/productId/rating/keyWord(内容) |
| GET | /admin/clothing/review/info | 评价详情 | id |
| POST | /admin/clothing/review/delete | 删除评价 | body: {ids:[]} |
| POST | /admin/clothing/review/reply | 商家回复评价 | body: {id, replyContent} |

> 注:admin 自动 CRUD 的 page/list 返回 snake_case 键;add/update 的请求体键为**实体属性 camelCase**(如 `categoryId`、`mainImage`)。图片上传复用 `/admin/base/comm/upload`(返回 data=URL 字符串)。

## 三、前台接口(app)

### 公开接口(无需登录)

| 方法 | 路径 | 说明 | 参数 |
|---|---|---|---|
| GET | /app/clothing/category/list | 分类列表(仅 active,sort 升序) | 无 |
| GET | /app/clothing/product/list | 商品分页 | page/size/`category_id`/`keyword`/`sort`(sales=销量|price=价格升序|time=最新,默认time) |
| GET | /app/clothing/product/search | 搜索商品 | 同上,keyword 必填 |
| GET | /app/clothing/product/detail | 商品详情 | id |
| GET | /app/clothing/product/reviews | 商品评价分页 | `product_id`/rating/page/size |

**商品详情返回结构**(data):
```json
{
  "id": 1, "category_id": 1, "category_name": "银饰",
  "title": "…", "subtitle": "…", "main_image": "http://…/upload/20260909/xx.png",
  "price": 298, "market_price": 398, "stock": 100, "sales": 12,
  "detail": "<p>…</p>", "craft_intro": "…", "inheritor_id": null, "status": "on_sale",
  "rating": 4.8, "review_count": 5,
  "images": ["http://…/1.png", "http://…/2.png"],
  "skus": [{"id": 1, "sku_name": "银饰-手镯-中号", "image": null, "price": 298, "stock": 30, "sales": 4, "attrs": {"尺寸": "中号"}, "status": "active"}],
  "created_at": "2026-09-09 10:00:00"
}
```
**列表项结构**:id/category_id/title/subtitle/main_image/price/market_price/sales/stock/rating/review_count(不含 detail/skus/images)

**评价分页项结构**:
```json
{ "id": 1, "product_id": 1, "rating": 5, "content": "做工精致",
  "images": ["http://…/a.png"], "user": {"nickname": "测试", "avatar_url": null},
  "reply_content": null, "replied_at": null, "created_at": "2026-09-09 10:00:00" }
```

### 需登录接口

| 方法 | 路径 | 说明 | 参数 |
|---|---|---|---|
| POST | /app/clothing/product/favorite | 收藏/取消收藏(toggle) | body: {productId} → data: true=已收藏,false=已取消 |
| GET | /app/clothing/product/my-favorites | 我的收藏分页 | page/size(列表项同前台列表,附 favorited_at) |
| POST | /app/clothing/product/review | 提交评价 | body: {orderId, productId, rating(1-5整数), content(≤500), images(≤9数组)} → data: 评价id |

> 上传复用 `/app/base/comm/upload`(公开,data=URL 字符串)。

## 四、与公共模块的衔接(待核心组交付后对接)

- products.merchant_id → merchants(商家);product_reviews.order_id → orders(统一订单)
- 上述表当前未实现:接口不校验其存在性(评价/商品只落库关联字段),核心组订单/商家模块落地后,衣模块将补充归属校验与下单扣库存逻辑
