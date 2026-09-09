# 衣模块(非遗商品电商)数据库表结构说明

> 第1组 · 分支 `feature/clothing-module` · 2026-09-09
> 权威来源:技术文档《2026-09-08-wudong-tourist-platform-design.md》3.2.2 与 `database/init_database.sql`(第84-174行),本模块表结构与其**完全一致**。

## 一、总览

本模块共 6 张业务表,前缀统一为 `product_`(商品模块语义)。均为 InnoDB / utf8mb4,**无外键约束**(关联字段+索引,隐式外键),主键统一 `BIGINT AUTO_INCREMENT`,时间字段 `created_at/updated_at`(DATETIME,DEFAULT CURRENT_TIMESTAMP),products 另含软删字段 `deleted_at`。

| 表名 | 用途 | 关联 |
|---|---|---|
| product_categories | 商品分类(银饰/蜡染/刺绣/苗族服饰/其他) | 自关联 parent_id |
| products | 商品主表 | category_id→分类,merchant_id→公共 merchants(核心组建) |
| product_skus | 商品SKU(规格/库存/价格) | product_id→products |
| product_images | 商品轮播图 | product_id→products |
| product_favorites | 用户收藏 | user_id→公共 users,product_id→products |
| product_reviews | 商品评价(含商家回复) | order_id→公共 orders,user_id→users,product_id→products |

## 二、逐表字段说明

### 2.1 product_categories 商品分类表

| 字段 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| id | BIGINT PK AUTO_INCREMENT | 否 | | 主键 |
| parent_id | BIGINT | 是 | 0 | 父分类ID，0为顶级 |
| name | VARCHAR(50) | 否 | | 分类名称 |
| icon | VARCHAR(255) | 是 | '' | 分类图标 |
| sort | INT | 是 | 0 | 排序 |
| status | VARCHAR(20) | 是 | active | active/inactive |
| created_at / updated_at | DATETIME | | CURRENT_TIMESTAMP | 时间 |

索引:`idx_parent_id(parent_id)`、`idx_sort(sort)`
种子数据(初始化,来自 init_database.sql 3.3):银饰、蜡染、刺绣、苗族服饰、其他

### 2.2 products 商品表

| 字段 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| id | BIGINT PK AUTO_INCREMENT | 否 | | 主键 |
| category_id | BIGINT | 否 | | 分类ID(关联 product_categories) |
| merchant_id | BIGINT | 否 | | 商家ID(关联公共 merchants,**本轮未建,代码写入占位 0**) |
| title | VARCHAR(255) | 否 | | 商品标题 |
| subtitle | VARCHAR(255) | 是 | '' | 副标题 |
| main_image | VARCHAR(255) | 否 | | 主图URL |
| price | DECIMAL(10,2) | 否 | | 售价(元) |
| market_price | DECIMAL(10,2) | 是 | NULL | 市场价 |
| stock | INT | 是 | 0 | 总库存 |
| sales | INT | 是 | 0 | 销量 |
| detail | TEXT | 是 | NULL | 商品详情(富文本) |
| craft_intro | TEXT | 是 | NULL | 工艺介绍 |
| inheritor_id | BIGINT | 是 | NULL | 传承人ID(可选) |
| status | VARCHAR(20) | 是 | on_sale | on_sale/off_sale |
| created_at / updated_at / deleted_at | DATETIME | | | deleted_at 为软删时间 |

索引:`idx_category(category_id,status)`、`idx_merchant(merchant_id)`、`idx_sales(sales)`、FULLTEXT `ft_title(title)`

### 2.3 product_skus 商品SKU表

| 字段 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| id | BIGINT PK | 否 | | 主键 |
| product_id | BIGINT | 否 | | 商品ID |
| sku_name | VARCHAR(100) | 否 | | 如"银饰-手镯-中号" |
| image | VARCHAR(255) | 是 | NULL | SKU图 |
| price | DECIMAL(10,2) | 否 | | 价格 |
| stock / sales | INT | 是 | 0 | 库存/销量 |
| attrs | JSON | 是 | NULL | 如 {"尺寸":"中号","颜色":"银色"} |
| status | VARCHAR(20) | 是 | active | 状态 |
| created_at / updated_at | DATETIME | | | |

索引:`idx_product_id(product_id)`

### 2.4 product_images 商品图片表

id BIGINT PK / product_id BIGINT 非空 / url VARCHAR(255) 非空 / sort INT 默认0 / created_at。索引 `idx_product_id`。

### 2.5 product_favorites 商品收藏表

id BIGINT PK / user_id BIGINT 非空 / product_id BIGINT 非空 / created_at。
唯一键 `uk_user_product(user_id,product_id)`(同一用户对同一商品仅一条,收藏=toggle);索引 `idx_product_id`。

### 2.6 product_reviews 商品评价表

| 字段 | 类型 | 可空 | 默认 | 说明 |
|---|---|---|---|---|
| id | BIGINT PK | 否 | | |
| order_id | BIGINT | 否 | | 订单ID(关联公共 orders,**本轮未建,只存不校验**) |
| product_id / user_id | BIGINT | 否 | | 商品/用户 |
| rating | TINYINT | 否 | | 评分 1-5 |
| content | VARCHAR(500) | 是 | '' | 内容 |
| images | JSON | 是 | NULL | 评价图数组(≤9) |
| reply_content | VARCHAR(500) | 是 | NULL | 商家回复 |
| replied_at | DATETIME | 是 | NULL | 回复时间 |
| created_at / updated_at | DATETIME | | | |

索引:`idx_product_id`、`idx_user_id`、`idx_order_id`

## 三、代码实体 ↔ 表结构映射规则

代码位于 `cool-admin-midway/src/modules/clothing/entity/`(6 实体 + common.ts)。为兼顾框架 TS 惯例与技术文档命名,实体**不继承 base 模块 BaseEntity**,每个实体显式声明列:

- TS 属性 camelCase,经 `@Column({ name: 'snake_case' })` 映射到 DDL 列名(如 `mainImage` → `main_image`)
- id 用 `@PrimaryGeneratedColumn({ type: 'bigint' })`,属性类型 number(驱动在安全整数范围内直接返回 number)
- 时间列 `@CreateDateColumn/@UpdateDateColumn({ name: 'created_at'/'updated_at', type: 'datetime' })`,transformer 统一输出 `YYYY-MM-DD HH:mm:ss`
- products 的 `deletedAt` 用 `@DeleteDateColumn`(TypeORM 自动为 ORM 查询附加 `deleted_at IS NULL`;手工 SQL 已显式过滤)
- DECIMAL 列带 number 转换(驱动返回字符串);JSON 列带 JSON 解析 transformer
- 索引与 DDL 同名同列(`idx_*`/`uk_user_product`/FULLTEXT `ft_title`)

本地建表由 synchronize 自动完成;交付 SQL 见 `database/clothing_module.sql`(与 init_database.sql 84-174 逐字一致)。
