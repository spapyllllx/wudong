# 乌东文旅平台 - 完整技术设计文档

| 项目信息 | 内容 |
|---------|------|
| 文档版本 | V1.0 |
| 编制日期 | 2026-09-08 |
| 项目名称 | 乌东文旅"衣食住行"综合服务平台 |
| 设计目标 | 完整技术架构设计与实施方案 |
| 技术栈 | Midway.js + cool-js + uni-app + Vue3 |

---

## 目录

1. [技术架构设计](#1-技术架构设计)
2. [技术栈选型](#2-技术栈选型)
3. [数据库设计](#3-数据库设计)
4. [API接口设计](#4-api接口设计)
5. [前端架构设计](#5-前端架构设计)
6. [核心业务实现](#6-核心业务实现)
7. [安全方案](#7-安全方案)
8. [部署方案](#8-部署方案)
9. [开发计划](#9-开发计划)

---

## 1. 技术架构设计

### 1.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                               │
├──────────────────┬──────────────────┬──────────────────────┤
│   微信小程序      │    PC Web (H5)    │   管理后台 (Admin)    │
│   (uni-app)      │    (uni-app)      │  (Vue3 + Element+)   │
│                  │                   │  (cool-admin)         │
└────────┬─────────┴─────────┬─────────┴──────────┬──────────┘
         │                   │                     │
         └───────────────────┼─────────────────────┘
                             │ HTTPS / JSON / WebSocket
                  ┌──────────▼──────────┐
                  │   Nginx 反向代理     │
                  │  - 静态资源服务      │
                  │  - 负载均衡          │
                  │  - SSL终端           │
                  └──────────┬──────────┘
                             │
                  ┌──────────▼──────────┐
                  │  Midway.js 应用层   │
                  │  (cool-js 框架)     │
                  │                     │
                  │  ┌─────────────┐   │
                  │  │  中间件层    │   │
                  │  │ - JWT认证    │   │
                  │  │ - 日志记录   │   │
                  │  │ - 参数校验   │   │
                  │  │ - 异常捕获   │   │
                  │  └─────────────┘   │
                  │                     │
                  │  ┌─────────────┐   │
                  │  │  业务服务层  │   │
                  │  │ - 用户服务   │   │
                  │  │ - 商品服务   │   │
                  │  │ - 餐饮服务   │   │
                  │  │ - 住宿服务   │   │
                  │  │ - 票务服务   │   │
                  │  │ - 社区服务   │   │
                  │  │ - 订单服务   │   │
                  │  │ - 支付服务   │   │
                  │  └─────────────┘   │
                  │                     │
                  │  ┌─────────────┐   │
                  │  │  数据访问层  │   │
                  │  │ - TypeORM    │   │
                  │  │ - Redis      │   │
                  │  └─────────────┘   │
                  └──────────┬──────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
  ┌──────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐
  │   MySQL 8.0  │    │   Redis 7.0  │    │  本地文件    │
  │  (主数据库)   │    │  (缓存/会话)  │    │  (图片/视频) │
  │              │    │              │    │             │
  │ - 业务数据    │    │ - Token存储  │    │ /uploads/   │
  │ - 用户数据    │    │ - 热点数据   │    │ - avatar/   │
  │ - 订单数据    │    │ - 排行榜     │    │ - product/  │
  │ - 社区数据    │    │ - 分布式锁   │    │ - post/     │
  └─────────────┘    └─────────────┘    └─────────────┘
```

### 1.2 架构分层说明

#### 客户端层
- **微信小程序**：主力C端用户入口，uni-app编译
- **PC Web**：桌面端浏览体验，uni-app H5模式，响应式布局
- **管理后台**：商家+平台管理员，Vue3 + cool-admin框架

#### 接入层
- **Nginx**：反向代理、静态资源服务、SSL卸载、限流保护

#### 应用层
- **Midway.js**：Node.js企业级框架，IoC容器、装饰器支持
- **cool-js**：基于Midway的快速开发框架，内置CRUD、权限、上传等

#### 数据层
- **MySQL**：关系型数据，事务支持
- **Redis**：缓存、会话、分布式锁
- **本地文件系统**：图片视频存储（开发环境）

### 1.3 模块划分

```
wudong-tourist-platform/
├── server/                    # 后端服务
│   ├── src/
│   │   ├── modules/
│   │   │   ├── base/          # 基础模块
│   │   │   │   ├── user/      # 用户管理
│   │   │   │   ├── auth/      # 认证授权
│   │   │   │   ├── upload/    # 文件上传
│   │   │   │   └── common/    # 公共服务
│   │   │   ├── clothing/      # 衣-非遗商品模块
│   │   │   ├── food/          # 食-餐饮美食模块
│   │   │   ├── accommodation/ # 住-住宿预订模块
│   │   │   ├── travel/        # 行-线路订票模块
│   │   │   ├── community/     # 社区分享模块
│   │   │   ├── order/         # 统一订单模块
│   │   │   ├── payment/       # 支付模块
│   │   │   └── admin/         # 管理后台模块
│   │   ├── config/            # 配置文件
│   │   ├── middleware/        # 中间件
│   │   └── decorator/         # 装饰器
│   └── package.json
├── client-uniapp/             # uni-app项目（小程序+H5）
│   ├── pages/
│   │   ├── index/             # 首页
│   │   ├── product/           # 商品
│   │   ├── restaurant/        # 餐饮
│   │   ├── homestay/          # 住宿
│   │   ├── ticket/            # 票务
│   │   ├── community/         # 社区
│   │   ├── cart/              # 购物车
│   │   ├── order/             # 订单
│   │   └── user/              # 个人中心
│   ├── components/            # 公共组件
│   ├── api/                   # API封装
│   ├── store/                 # 状态管理
│   └── utils/                 # 工具函数
└── admin/                     # 管理后台
    ├── src/
    │   ├── modules/
    │   │   ├── user/          # 用户管理
    │   │   ├── product/       # 商品管理
    │   │   ├── restaurant/    # 餐饮管理
    │   │   ├── homestay/      # 住宿管理
    │   │   ├── ticket/        # 票务管理
    │   │   ├── community/     # 社区管理
    │   │   ├── order/         # 订单管理
    │   │   └── dashboard/     # 数据看板
    │   └── ...
    └── package.json
```

---

## 2. 技术栈选型

### 2.1 完整技术栈

| 层级 | 技术选型 | 版本 | 选型理由 |
|------|---------|------|---------|
| **前端框架（小程序+H5）** | uni-app | 3.x | 一套代码编译多端，减少开发成本 |
| **前端框架（管理后台）** | Vue 3 | 3.x | 响应式、组合式API，生态成熟 |
| **UI组件库（管理后台）** | Element Plus | 2.x | Vue3官方推荐，组件丰富 |
| **状态管理** | Pinia | 2.x | Vue3官方推荐，替代Vuex |
| **后端框架** | Midway.js | 3.x | 企业级Node.js框架，IoC、装饰器 |
| **快速开发框架** | cool-js | 7.x | 基于Midway，内置CRUD、权限 |
| **编程语言** | TypeScript | 5.x | 类型安全，团队协作友好 |
| **ORM框架** | TypeORM | 0.3.x | TypeScript原生支持，Active Record模式 |
| **数据库** | MySQL | 8.0+ | 关系型数据库，事务支持 |
| **缓存数据库** | Redis | 7.0+ | 高性能缓存，支持多种数据结构 |
| **Web服务器** | Nginx | 1.24+ | 反向代理、静态资源服务 |
| **包管理器** | pnpm | 8.x | 快速、节省磁盘空间 |
| **代码规范** | ESLint + Prettier | 最新 | 统一代码风格 |
| **Git Hook** | husky + lint-staged | 最新 | 提交前代码检查 |
| **接口测试** | Apifox | - | API文档+测试工具 |

### 2.2 第三方服务

| 服务类型 | 服务商 | 用途 |
|---------|-------|------|
| 微信支付 | 腾讯 | 小程序支付 |
| 短信服务 | 阿里云 | 验证码发送 |
| 内容审核 | 腾讯云天御 | UGC内容审核（可选） |
| 地图服务 | 腾讯地图 | 位置服务、导航 |

### 2.3 开发工具

| 工具 | 用途 |
|-----|------|
| Visual Studio Code | 代码编辑器 |
| 微信开发者工具 | 小程序调试 |
| Navicat / DBeaver | 数据库管理 |
| Redis Desktop Manager | Redis管理 |
| Postman / Apifox | 接口测试 |

---

## 3. 数据库设计

### 3.1 数据库设计原则

1. **命名规范**
   - 表名：小写下划线分隔，复数形式（如 `users`, `products`）
   - 字段名：小写下划线分隔（如 `user_id`, `created_at`）
   - 索引名：`idx_` 前缀（如 `idx_user_phone`）
   - 唯一索引：`uk_` 前缀（如 `uk_user_phone`）

2. **字段规范**
   - 主键统一使用 `id bigint`
   - 时间字段：`created_at`, `updated_at`, `deleted_at`
   - 软删除：使用 `deleted_at`，查询时过滤
   - 枚举字段：使用 `varchar` 而非 `enum`，便于扩展
   - 金额字段：使用 `decimal(10,2)`

3. **性能优化**
   - 高频查询字段建索引
   - 合理使用联合索引
   - 避免冗余索引
   - 大文本字段独立表存储

### 3.2 核心表结构

#### 3.2.1 用户模块

```sql
-- 用户表
CREATE TABLE `users` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  `phone` VARCHAR(11) DEFAULT NULL COMMENT '手机号',
  `password` VARCHAR(255) DEFAULT NULL COMMENT '密码哈希',
  `nickname` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT '' COMMENT '头像URL',
  `gender` TINYINT DEFAULT 0 COMMENT '性别 0:未知 1:男 2:女',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `region` VARCHAR(100) DEFAULT '' COMMENT '所在地区',
  `bio` VARCHAR(255) DEFAULT '' COMMENT '个人简介',
  `openid` VARCHAR(100) DEFAULT NULL COMMENT '微信openid',
  `unionid` VARCHAR(100) DEFAULT NULL COMMENT '微信unionid',
  `role` VARCHAR(20) DEFAULT 'user' COMMENT '角色: user/merchant/admin',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT '状态: active/banned',
  `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间',
  UNIQUE KEY `uk_phone` (`phone`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_role_status` (`role`, `status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 收货地址表
CREATE TABLE `user_addresses` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `consignee` VARCHAR(50) NOT NULL COMMENT '收货人',
  `phone` VARCHAR(11) NOT NULL COMMENT '联系电话',
  `province` VARCHAR(50) NOT NULL COMMENT '省',
  `city` VARCHAR(50) NOT NULL COMMENT '市',
  `district` VARCHAR(50) NOT NULL COMMENT '区',
  `detail` VARCHAR(255) NOT NULL COMMENT '详细地址',
  `is_default` TINYINT DEFAULT 0 COMMENT '是否默认地址',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户收货地址表';

-- 商家入驻申请表
CREATE TABLE `merchant_applications` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL COMMENT '申请用户ID',
  `shop_name` VARCHAR(100) NOT NULL COMMENT '店铺名称',
  `module_type` VARCHAR(20) NOT NULL COMMENT '模块类型: clothing/food/accommodation/travel',
  `contact_name` VARCHAR(50) NOT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(11) NOT NULL COMMENT '联系电话',
  `business_license` VARCHAR(255) DEFAULT NULL COMMENT '营业执照图片',
  `id_card_front` VARCHAR(255) DEFAULT NULL COMMENT '身份证正面',
  `id_card_back` VARCHAR(255) DEFAULT NULL COMMENT '身份证背面',
  `description` TEXT COMMENT '申请说明',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态: pending/approved/rejected',
  `reject_reason` VARCHAR(255) DEFAULT NULL COMMENT '拒绝原因',
  `reviewed_by` BIGINT DEFAULT NULL COMMENT '审核人ID',
  `reviewed_at` DATETIME DEFAULT NULL COMMENT '审核时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家入驻申请表';
```

#### 3.2.2 商品模块（衣）

```sql
-- 商品分类表
CREATE TABLE `product_categories` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `parent_id` BIGINT DEFAULT 0 COMMENT '父分类ID，0为顶级',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `icon` VARCHAR(255) DEFAULT '' COMMENT '分类图标',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT '状态: active/inactive',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

-- 商品表
CREATE TABLE `products` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `category_id` BIGINT NOT NULL COMMENT '分类ID',
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID',
  `title` VARCHAR(255) NOT NULL COMMENT '商品标题',
  `subtitle` VARCHAR(255) DEFAULT '' COMMENT '副标题',
  `main_image` VARCHAR(255) NOT NULL COMMENT '主图',
  `price` DECIMAL(10,2) NOT NULL COMMENT '售价',
  `market_price` DECIMAL(10,2) DEFAULT NULL COMMENT '市场价',
  `stock` INT DEFAULT 0 COMMENT '总库存',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `detail` TEXT COMMENT '商品详情（富文本）',
  `craft_intro` TEXT COMMENT '工艺介绍',
  `inheritor_id` BIGINT DEFAULT NULL COMMENT '传承人ID（可选）',
  `status` VARCHAR(20) DEFAULT 'on_sale' COMMENT '状态: on_sale/off_sale',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_category` (`category_id`, `status`),
  KEY `idx_merchant` (`merchant_id`),
  KEY `idx_sales` (`sales`),
  FULLTEXT KEY `ft_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 商品SKU表
CREATE TABLE `product_skus` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL COMMENT '商品ID',
  `sku_name` VARCHAR(100) NOT NULL COMMENT 'SKU名称，如"银饰-手镯-中号"',
  `image` VARCHAR(255) DEFAULT NULL COMMENT 'SKU图片',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `stock` INT DEFAULT 0 COMMENT '库存',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `attrs` JSON DEFAULT NULL COMMENT 'SKU属性JSON，如{"尺寸":"中号","颜色":"银色"}',
  `status` VARCHAR(20) DEFAULT 'active' COMMENT '状态',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品SKU表';

-- 商品图片表
CREATE TABLE `product_images` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL,
  `url` VARCHAR(255) NOT NULL COMMENT '图片URL',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品图片表';

-- 商品收藏表
CREATE TABLE `product_favorites` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_product` (`user_id`, `product_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品收藏表';

-- 商品评价表
CREATE TABLE `product_reviews` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL COMMENT '订单ID',
  `product_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `rating` TINYINT NOT NULL COMMENT '评分 1-5',
  `content` VARCHAR(500) DEFAULT '' COMMENT '评价内容',
  `images` JSON DEFAULT NULL COMMENT '评价图片JSON数组',
  `reply_content` VARCHAR(500) DEFAULT NULL COMMENT '商家回复',
  `replied_at` DATETIME DEFAULT NULL COMMENT '回复时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_product_id` (`product_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品评价表';
```

#### 3.2.3 餐饮模块（食）

```sql
-- 餐厅表
CREATE TABLE `restaurants` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID',
  `name` VARCHAR(100) NOT NULL COMMENT '餐厅名称',
  `main_image` VARCHAR(255) NOT NULL COMMENT '主图',
  `images` JSON DEFAULT NULL COMMENT '餐厅图片JSON数组',
  `address` VARCHAR(255) NOT NULL COMMENT '地址',
  `latitude` DECIMAL(10,7) DEFAULT NULL COMMENT '纬度',
  `longitude` DECIMAL(10,7) DEFAULT NULL COMMENT '经度',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `business_hours` VARCHAR(100) DEFAULT NULL COMMENT '营业时间',
  `capacity` INT DEFAULT 0 COMMENT '容纳人数',
  `avg_price` DECIMAL(10,2) DEFAULT NULL COMMENT '人均消费',
  `description` TEXT COMMENT '餐厅介绍',
  `rating` DECIMAL(3,2) DEFAULT 5.00 COMMENT '评分',
  `review_count` INT DEFAULT 0 COMMENT '评价数',
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_location` (`latitude`, `longitude`),
  KEY `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐厅表';

-- 菜品表
CREATE TABLE `restaurant_dishes` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `restaurant_id` BIGINT NOT NULL,
  `name` VARCHAR(100) NOT NULL COMMENT '菜品名称',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '菜品图片',
  `price` DECIMAL(10,2) NOT NULL COMMENT '价格',
  `description` VARCHAR(255) DEFAULT '' COMMENT '菜品介绍',
  `is_signature` TINYINT DEFAULT 0 COMMENT '是否招牌菜',
  `sort` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_restaurant_id` (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜品表';

-- 餐位时段配置表
CREATE TABLE `restaurant_timeslots` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `restaurant_id` BIGINT NOT NULL,
  `name` VARCHAR(50) NOT NULL COMMENT '时段名称，如"午餐 11:30-13:30"',
  `start_time` TIME NOT NULL COMMENT '开始时间',
  `end_time` TIME NOT NULL COMMENT '结束时间',
  `max_bookings` INT NOT NULL COMMENT '最大预订数',
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_restaurant_id` (`restaurant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐位时段配置表';

-- 餐位预订表
CREATE TABLE `restaurant_bookings` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL COMMENT '关联订单ID',
  `restaurant_id` BIGINT NOT NULL,
  `timeslot_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `booking_date` DATE NOT NULL COMMENT '预订日期',
  `people_count` INT NOT NULL COMMENT '人数',
  `consignee` VARCHAR(50) NOT NULL COMMENT '预订人姓名',
  `phone` VARCHAR(11) NOT NULL COMMENT '联系电话',
  `remark` VARCHAR(255) DEFAULT '' COMMENT '备注',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/confirmed/cancelled/completed',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_restaurant_date` (`restaurant_id`, `booking_date`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='餐位预订表';

-- 农产品分类表
CREATE TABLE `agri_product_categories` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `icon` VARCHAR(255) DEFAULT '',
  `sort` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_sort` (`sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='农产品分类表';

-- 农产品表
CREATE TABLE `agri_products` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `category_id` BIGINT NOT NULL,
  `merchant_id` BIGINT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `main_image` VARCHAR(255) NOT NULL,
  `images` JSON DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `market_price` DECIMAL(10,2) DEFAULT NULL,
  `stock` INT DEFAULT 0,
  `sales` INT DEFAULT 0,
  `unit` VARCHAR(20) DEFAULT '件' COMMENT '单位',
  `origin` VARCHAR(100) DEFAULT '' COMMENT '产地',
  `shelf_life` VARCHAR(50) DEFAULT '' COMMENT '保质期',
  `detail` TEXT COMMENT '商品详情',
  `status` VARCHAR(20) DEFAULT 'on_sale',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_category` (`category_id`, `status`),
  KEY `idx_merchant` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='农产品表';
```

#### 3.2.4 住宿模块（住）

```sql
-- 民宿表
CREATE TABLE `homestays` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `merchant_id` BIGINT NOT NULL,
  `name` VARCHAR(100) NOT NULL COMMENT '民宿名称',
  `main_image` VARCHAR(255) NOT NULL,
  `images` JSON DEFAULT NULL,
  `address` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `style_tags` JSON DEFAULT NULL COMMENT '风格标签JSON，如["苗族特色","吊脚楼"]',
  `facility_tags` JSON DEFAULT NULL COMMENT '设施标签JSON，如["WiFi","空调","独立卫浴"]',
  `description` TEXT COMMENT '民宿介绍',
  `check_in_time` VARCHAR(50) DEFAULT '14:00' COMMENT '入住时间',
  `check_out_time` VARCHAR(50) DEFAULT '12:00' COMMENT '离店时间',
  `policies` TEXT COMMENT '入住须知',
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `review_count` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='民宿表';

-- 房型表
CREATE TABLE `homestay_room_types` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `homestay_id` BIGINT NOT NULL,
  `name` VARCHAR(100) NOT NULL COMMENT '房型名称',
  `main_image` VARCHAR(255) NOT NULL,
  `images` JSON DEFAULT NULL,
  `bed_type` VARCHAR(50) DEFAULT '' COMMENT '床型',
  `area` DECIMAL(10,2) DEFAULT NULL COMMENT '面积(平米)',
  `capacity` INT NOT NULL COMMENT '可住人数',
  `facilities` JSON DEFAULT NULL COMMENT '设施JSON数组',
  `price` DECIMAL(10,2) NOT NULL COMMENT '基础价格',
  `total_rooms` INT NOT NULL COMMENT '房间总数',
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_homestay_id` (`homestay_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房型表';

-- 房态日历表
CREATE TABLE `homestay_room_calendar` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `room_type_id` BIGINT NOT NULL,
  `date` DATE NOT NULL COMMENT '日期',
  `price` DECIMAL(10,2) NOT NULL COMMENT '当日价格（可动态调整）',
  `available_count` INT NOT NULL COMMENT '可用房间数',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_room_date` (`room_type_id`, `date`),
  KEY `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房态日历表';

-- 住宿订单表
CREATE TABLE `homestay_bookings` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `homestay_id` BIGINT NOT NULL,
  `room_type_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `check_in_date` DATE NOT NULL,
  `check_out_date` DATE NOT NULL,
  `days` INT NOT NULL COMMENT '入住天数',
  `room_count` INT NOT NULL COMMENT '房间数',
  `guest_name` VARCHAR(50) NOT NULL COMMENT '入住人姓名',
  `guest_phone` VARCHAR(11) NOT NULL,
  `guest_id_card` VARCHAR(18) DEFAULT NULL COMMENT '身份证号',
  `remark` VARCHAR(255) DEFAULT '',
  `check_in_code` VARCHAR(50) DEFAULT NULL COMMENT '入住码',
  `status` VARCHAR(20) DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_homestay_date` (`homestay_id`, `check_in_date`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='住宿订单表';

#### 3.2.5 票务模块（行）

```sql
-- 景区表
CREATE TABLE `scenic_spots` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT '景区名称',
  `main_image` VARCHAR(255) NOT NULL,
  `images` JSON DEFAULT NULL,
  `address` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `opening_hours` VARCHAR(100) DEFAULT NULL COMMENT '开放时间',
  `description` TEXT COMMENT '景区介绍',
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `review_count` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='景区表';

-- 票种表
CREATE TABLE `ticket_types` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `scenic_spot_id` BIGINT NOT NULL,
  `name` VARCHAR(100) NOT NULL COMMENT '票种名称，如"成人票","儿童票"',
  `price` DECIMAL(10,2) NOT NULL,
  `validity_days` INT DEFAULT 1 COMMENT '有效天数',
  `description` VARCHAR(255) DEFAULT '',
  `stock` INT DEFAULT 9999 COMMENT '库存',
  `sales` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_scenic_spot` (`scenic_spot_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='票种表';

-- 路线套餐表
CREATE TABLE `route_packages` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `merchant_id` BIGINT NOT NULL,
  `title` VARCHAR(100) NOT NULL COMMENT '路线标题',
  `main_image` VARCHAR(255) NOT NULL,
  `images` JSON DEFAULT NULL,
  `days` INT NOT NULL COMMENT '天数',
  `price` DECIMAL(10,2) NOT NULL,
  `includes` TEXT COMMENT '包含项目',
  `excludes` TEXT COMMENT '不包含项目',
  `departure_place` VARCHAR(100) DEFAULT '' COMMENT '出发地',
  `destination` VARCHAR(100) DEFAULT '' COMMENT '目的地',
  `accommodation_standard` VARCHAR(255) DEFAULT '' COMMENT '住宿标准',
  `meal_standard` VARCHAR(255) DEFAULT '' COMMENT '餐饮标准',
  `notices` TEXT COMMENT '注意事项',
  `theme_tags` JSON DEFAULT NULL COMMENT '主题标签，如["亲子","摄影","研学"]',
  `description` TEXT COMMENT '路线介绍',
  `stock` INT DEFAULT 999,
  `sales` INT DEFAULT 0,
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `review_count` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_days` (`days`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线套餐表';

-- 路线行程表
CREATE TABLE `route_itineraries` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `route_package_id` BIGINT NOT NULL,
  `day` INT NOT NULL COMMENT '第几天',
  `title` VARCHAR(100) NOT NULL COMMENT '当天标题',
  `description` TEXT COMMENT '行程描述',
  `attractions` JSON DEFAULT NULL COMMENT '游览景点JSON数组',
  `meals` JSON DEFAULT NULL COMMENT '用餐安排JSON，如{"早餐":"含","午餐":"含","晚餐":"自理"}',
  `accommodation` VARCHAR(255) DEFAULT NULL COMMENT '住宿安排',
  `transportation` VARCHAR(255) DEFAULT NULL COMMENT '交通方式',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_route_package` (`route_package_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='路线行程表';

-- 电子票表
CREATE TABLE `e_tickets` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `ticket_type` VARCHAR(20) NOT NULL COMMENT 'scenic/route',
  `ticket_type_id` BIGINT DEFAULT NULL COMMENT '票种ID',
  `route_package_id` BIGINT DEFAULT NULL COMMENT '路线套餐ID',
  `ticket_no` VARCHAR(50) NOT NULL COMMENT '票号（唯一）',
  `qr_code` VARCHAR(255) NOT NULL COMMENT '二维码图片URL',
  `valid_date` DATE NOT NULL COMMENT '有效日期',
  `visitor_name` VARCHAR(50) NOT NULL COMMENT '游客姓名',
  `visitor_phone` VARCHAR(11) DEFAULT NULL,
  `visitor_id_card` VARCHAR(18) DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'unused' COMMENT 'unused/used/refunded',
  `used_at` DATETIME DEFAULT NULL COMMENT '核销时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_ticket_no` (`ticket_no`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='电子票表';

-- 交通攻略表
CREATE TABLE `traffic_guides` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `departure_place` VARCHAR(100) NOT NULL COMMENT '出发地',
  `destination` VARCHAR(100) NOT NULL COMMENT '目的地',
  `transportation_type` VARCHAR(50) NOT NULL COMMENT '交通方式：飞机/高铁/汽车/自驾',
  `duration` VARCHAR(50) DEFAULT NULL COMMENT '时长',
  `cost` VARCHAR(50) DEFAULT NULL COMMENT '费用',
  `description` TEXT COMMENT '详细说明',
  `images` JSON DEFAULT NULL,
  `sort` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_departure_destination` (`departure_place`, `destination`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='交通攻略表';
```

#### 3.2.6 社区模块

```sql
-- 游记表
CREATE TABLE `posts` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `title` VARCHAR(255) NOT NULL COMMENT '标题',
  `content` TEXT NOT NULL COMMENT '文字内容',
  `video_url` VARCHAR(255) DEFAULT NULL COMMENT '视频URL',
  `cover_image` VARCHAR(255) DEFAULT NULL COMMENT '封面图',
  `related_type` VARCHAR(50) DEFAULT NULL COMMENT '关联类型：restaurant/homestay/scenic_spot',
  `related_id` BIGINT DEFAULT NULL COMMENT '关联ID',
  `topic_ids` JSON DEFAULT NULL COMMENT '话题ID数组',
  `like_count` INT DEFAULT 0 COMMENT '点赞数',
  `comment_count` INT DEFAULT 0 COMMENT '评论数',
  `favorite_count` INT DEFAULT 0 COMMENT '收藏数',
  `view_count` INT DEFAULT 0 COMMENT '浏览数',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/published/rejected',
  `reject_reason` VARCHAR(255) DEFAULT NULL,
  `published_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_like_count` (`like_count`),
  FULLTEXT KEY `ft_title_content` (`title`, `content`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记表';

-- 游记图片表
CREATE TABLE `post_images` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `post_id` BIGINT NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `sort` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_post_id` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记图片表';

-- 评论表
CREATE TABLE `post_comments` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `post_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `parent_id` BIGINT DEFAULT 0 COMMENT '父评论ID，0为一级评论',
  `reply_to_user_id` BIGINT DEFAULT NULL COMMENT '回复的用户ID',
  `content` VARCHAR(500) NOT NULL,
  `like_count` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'published',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 点赞表
CREATE TABLE `likes` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `target_type` VARCHAR(50) NOT NULL COMMENT 'post/comment',
  `target_id` BIGINT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_target` (`user_id`, `target_type`, `target_id`),
  KEY `idx_target` (`target_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞表';

-- 收藏表
CREATE TABLE `post_favorites` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `post_id` BIGINT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_post` (`user_id`, `post_id`),
  KEY `idx_post_id` (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游记收藏表';

-- 话题表
CREATE TABLE `topics` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT '话题名',
  `description` VARCHAR(255) DEFAULT '' COMMENT '话题简介',
  `cover_image` VARCHAR(255) DEFAULT NULL,
  `follow_count` INT DEFAULT 0 COMMENT '关注数',
  `post_count` INT DEFAULT 0 COMMENT '游记数',
  `is_hot` TINYINT DEFAULT 0 COMMENT '是否热门',
  `sort` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_name` (`name`),
  KEY `idx_hot_sort` (`is_hot`, `sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='话题表';

-- 话题关注表
CREATE TABLE `topic_follows` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `topic_id` BIGINT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_topic` (`user_id`, `topic_id`),
  KEY `idx_topic_id` (`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='话题关注表';

-- 用户关注表
CREATE TABLE `user_follows` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `follower_id` BIGINT NOT NULL COMMENT '关注者ID',
  `followee_id` BIGINT NOT NULL COMMENT '被关注者ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_follower_followee` (`follower_id`, `followee_id`),
  KEY `idx_followee_id` (`followee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户关注表';

-- 举报表
CREATE TABLE `reports` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `reporter_id` BIGINT NOT NULL COMMENT '举报人ID',
  `target_type` VARCHAR(50) NOT NULL COMMENT 'post/comment',
  `target_id` BIGINT NOT NULL,
  `reason` VARCHAR(500) NOT NULL COMMENT '举报原因',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/processed/rejected',
  `handler_id` BIGINT DEFAULT NULL COMMENT '处理人ID',
  `handle_result` VARCHAR(255) DEFAULT NULL COMMENT '处理结果',
  `handled_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_reporter_id` (`reporter_id`),
  KEY `idx_target` (`target_type`, `target_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='举报表';
```

#### 3.2.7 订单模块

```sql
-- 统一订单表
CREATE TABLE `orders` (
  `id` BIGINT PRIMARY KEY COMMENT '订单号（雪花算法生成）',
  `user_id` BIGINT NOT NULL,
  `order_type` VARCHAR(20) NOT NULL COMMENT 'product/restaurant/homestay/ticket/route',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
  `paid_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '实付金额',
  `discount_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '优惠金额',
  `payment_method` VARCHAR(50) DEFAULT NULL COMMENT '支付方式：wechat/alipay',
  `payment_no` VARCHAR(100) DEFAULT NULL COMMENT '支付流水号',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/paid/cancelled/completed/refunded',
  `remark` VARCHAR(255) DEFAULT '' COMMENT '订单备注',
  `paid_at` DATETIME DEFAULT NULL,
  `completed_at` DATETIME DEFAULT NULL,
  `cancelled_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_type` (`order_type`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统一订单表';

-- 商品订单明细表
CREATE TABLE `product_order_items` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `sku_id` BIGINT DEFAULT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `sku_name` VARCHAR(100) DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL COMMENT '单价',
  `quantity` INT NOT NULL COMMENT '数量',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '小计',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品订单明细表';

-- 商品订单物流表
CREATE TABLE `product_order_logistics` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `consignee` VARCHAR(50) NOT NULL COMMENT '收货人',
  `phone` VARCHAR(11) NOT NULL,
  `province` VARCHAR(50) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `district` VARCHAR(50) NOT NULL,
  `detail` VARCHAR(255) NOT NULL COMMENT '详细地址',
  `shipping_fee` DECIMAL(10,2) DEFAULT 0 COMMENT '运费',
  `logistics_company` VARCHAR(50) DEFAULT NULL COMMENT '物流公司',
  `logistics_no` VARCHAR(100) DEFAULT NULL COMMENT '物流单号',
  `shipped_at` DATETIME DEFAULT NULL COMMENT '发货时间',
  `received_at` DATETIME DEFAULT NULL COMMENT '收货时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品订单物流表';

-- 退款申请表
CREATE TABLE `order_refunds` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `refund_amount` DECIMAL(10,2) NOT NULL COMMENT '退款金额',
  `reason` VARCHAR(500) NOT NULL COMMENT '退款原因',
  `images` JSON DEFAULT NULL COMMENT '凭证图片',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/approved/rejected/completed',
  `reject_reason` VARCHAR(255) DEFAULT NULL,
  `handler_id` BIGINT DEFAULT NULL,
  `handled_at` DATETIME DEFAULT NULL,
  `refund_no` VARCHAR(100) DEFAULT NULL COMMENT '退款流水号',
  `refunded_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='退款申请表';
```

#### 3.2.8 购物车模块

```sql
-- 购物车表
CREATE TABLE `carts` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `item_type` VARCHAR(20) NOT NULL COMMENT 'product/agri_product',
  `item_id` BIGINT NOT NULL COMMENT '商品ID',
  `sku_id` BIGINT DEFAULT NULL COMMENT 'SKU ID',
  `quantity` INT NOT NULL COMMENT '数量',
  `selected` TINYINT DEFAULT 1 COMMENT '是否选中',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_item` (`user_id`, `item_type`, `item_id`, `sku_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';
```

#### 3.2.9 系统管理模块

```sql
-- 轮播图表
CREATE TABLE `banners` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `link_type` VARCHAR(50) DEFAULT NULL COMMENT '跳转类型：url/product/post等',
  `link_value` VARCHAR(255) DEFAULT NULL COMMENT '跳转值',
  `position` VARCHAR(50) DEFAULT 'home' COMMENT '位置：home/category等',
  `sort` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'active',
  `start_time` DATETIME DEFAULT NULL,
  `end_time` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_position_sort` (`position`, `sort`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 公告表
CREATE TABLE `announcements` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'system' COMMENT '类型：system/activity',
  `status` VARCHAR(20) DEFAULT 'published',
  `published_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告表';

-- 敏感词表
CREATE TABLE `sensitive_words` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `word` VARCHAR(100) NOT NULL,
  `level` TINYINT DEFAULT 1 COMMENT '级别 1:警告 2:禁止',
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_word` (`word`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='敏感词表';

-- 系统消息表
CREATE TABLE `system_messages` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT DEFAULT NULL COMMENT '用户ID，NULL表示全局消息',
  `type` VARCHAR(50) NOT NULL COMMENT '类型：order/system/interaction',
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `link_type` VARCHAR(50) DEFAULT NULL,
  `link_value` VARCHAR(255) DEFAULT NULL,
  `is_read` TINYINT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_user_id` (`user_id`, `is_read`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统消息表';

-- 操作日志表
CREATE TABLE `operation_logs` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `action` VARCHAR(100) NOT NULL COMMENT '操作类型',
  `module` VARCHAR(50) NOT NULL COMMENT '模块',
  `content` VARCHAR(500) DEFAULT NULL COMMENT '操作内容',
  `ip` VARCHAR(50) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_user_id` (`user_id`),
  KEY `idx_module` (`module`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';
```

### 3.3 初始化数据脚本

```sql
-- 插入默认管理员账号
INSERT INTO `users` (`id`, `phone`, `password`, `nickname`, `role`, `status`) 
VALUES (1, '13800138000', '$2b$10$...', '超级管理员', 'admin', 'active');

-- 插入商品分类
INSERT INTO `product_categories` (`id`, `parent_id`, `name`, `sort`) VALUES
(1, 0, '银饰', 1),
(2, 0, '蜡染', 2),
(3, 0, '刺绣', 3),
(4, 0, '苗族服饰', 4),
(5, 0, '其他', 5);

-- 插入农产品分类
INSERT INTO `agri_product_categories` (`id`, `name`, `sort`) VALUES
(1, '茶叶', 1),
(2, '腊肉', 2),
(3, '米酒', 3),
(4, '酸食', 4),
(5, '其他特产', 5);

-- 插入话题
INSERT INTO `topics` (`name`, `description`, `is_hot`, `sort`) VALUES
('苗寨美景', '分享苗寨的美丽风光', 1, 1),
('美食探店', '推荐乌东特色美食', 1, 2),
('民宿体验', '分享民宿入住体验', 1, 3),
('旅行攻略', '实用的旅行攻略分享', 1, 4);
```

---

## 4. API接口设计

### 4.1 接口规范

#### 4.1.1 通用约定

**Base URL:**
```
开发环境: http://localhost:7001/api
生产环境: https://api.wudong-tourist.com/api
```

**请求头:**
```
Content-Type: application/json
Authorization: Bearer <token>  // 需要登录的接口
```

**响应格式:**
```json
// 成功
{
  "code": 200,
  "message": "success",
  "data": { ... }
}

// 失败
{
  "code": 400,
  "message": "参数错误",
  "data": null
}

// 分页数据
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [...],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

**状态码:**
```
200 - 成功
400 - 参数错误
401 - 未登录
403 - 无权限
404 - 资源不存在
500 - 服务器错误
```

### 4.2 核心接口列表

#### 4.2.1 用户模块 `/api/user`

| 接口 | 方法 | 路径 | 说明 | 鉴权 |
|------|-----|------|------|-----|
| 注册 | POST | `/register` | 手机号注册 | 否 |
| 登录 | POST | `/login` | 手机号密码/验证码登录 | 否 |
| 微信登录 | POST | `/wechat-login` | 微信授权登录 | 否 |
| 获取个人信息 | GET | `/profile` | 获取当前用户信息 | 是 |
| 更新个人信息 | PUT | `/profile` | 更新个人信息 | 是 |
| 获取地址列表 | GET | `/addresses` | 获取收货地址列表 | 是 |
| 添加地址 | POST | `/addresses` | 添加收货地址 | 是 |
| 更新地址 | PUT | `/addresses/:id` | 更新地址 | 是 |
| 删除地址 | DELETE | `/addresses/:id` | 删除地址 | 是 |
| 发送验证码 | POST | `/send-code` | 发送短信验证码 | 否 |

**接口示例：**

```javascript
// POST /api/user/register
{
  "phone": "13800138000",
  "password": "Pass1234",
  "code": "123456"  // 验证码
}

// Response
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "phone": "13800138000",
      "nickname": "用户138****8000",
      "avatar": "",
      "role": "user"
    }
  }
}
```

#### 4.2.2 商品模块 `/api/product`

| 接口 | 方法 | 路径 | 说明 | 鉴权 |
|------|-----|------|------|-----|
| 商品列表 | GET | `/list` | 分页查询商品 | 否 |
| 商品详情 | GET | `/:id` | 获取商品详情 | 否 |
| 分类列表 | GET | `/categories` | 获取分类列表 | 否 |
| 搜索商品 | GET | `/search` | 关键词搜索 | 否 |
| 收藏商品 | POST | `/favorite` | 收藏/取消收藏 | 是 |
| 我的收藏 | GET | `/my-favorites` | 我的商品收藏 | 是 |
| 提交评价 | POST | `/review` | 提交商品评价 | 是 |
| 评价列表 | GET | `/:id/reviews` | 商品评价列表 | 否 |

**接口示例：**

```javascript
// GET /api/product/list?page=1&pageSize=10&category_id=1&sort=sales
// Response
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "苗族手工银饰手镯",
        "subtitle": "纯手工锻造，传承百年工艺",
        "main_image": "https://...",
        "price": 298.00,
        "market_price": 398.00,
        "sales": 156,
        "rating": 4.8,
        "review_count": 89
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}

// GET /api/product/:id
// Response
{
  "code": 200,
  "data": {
    "id": 1,
    "title": "苗族手工银饰手镯",
    "subtitle": "纯手工锻造，传承百年工艺",
    "category": {
      "id": 1,
      "name": "银饰"
    },
    "main_image": "https://...",
    "images": ["https://...", "https://..."],
    "price": 298.00,
    "market_price": 398.00,
    "stock": 50,
    "sales": 156,
    "detail": "<p>商品详情...</p>",
    "craft_intro": "工艺介绍...",
    "skus": [
      {
        "id": 1,
        "sku_name": "手镯-大号",
        "price": 298.00,
        "stock": 20,
        "attrs": {"尺寸": "大号"}
      },
      {
        "id": 2,
        "sku_name": "手镯-中号",
        "price": 278.00,
        "stock": 30,
        "attrs": {"尺寸": "中号"}
      }
    ],
    "rating": 4.8,
    "review_count": 89
  }
}
```

#### 4.2.3 餐饮模块 `/api/restaurant`

| 接口 | 方法 | 路径 | 说明 | 鉴权 |
|------|-----|------|------|-----|
| 餐厅列表 | GET | `/list` | 分页查询餐厅 | 否 |
| 餐厅详情 | GET | `/:id` | 获取餐厅详情 | 否 |
| 时段列表 | GET | `/:id/timeslots` | 获取可预订时段 | 否 |
| 提交预订 | POST | `/booking` | 提交餐位预订 | 是 |
| 我的预订 | GET | `/my-bookings` | 我的餐位预订 | 是 |
| 取消预订 | PUT | `/booking/:id/cancel` | 取消预订 | 是 |

**农产品接口 `/api/agri-product`**（接口结构类似商品模块，略）

#### 4.2.4 住宿模块 `/api/homestay`

| 接口 | 方法 | 路径 | 说明 | 鉴权 |
|------|-----|------|------|-----|
| 民宿列表 | GET | `/list` | 分页查询民宿 | 否 |
| 民宿详情 | GET | `/:id` | 获取民宿详情 | 否 |
| 房态查询 | GET | `/:id/calendar` | 查询房态日历 | 否 |
| 提交预订 | POST | `/booking` | 提交住宿预订 | 是 |
| 我的预订 | GET | `/my-bookings` | 我的住宿订单 | 是 |
| 取消预订 | PUT | `/booking/:id/cancel` | 取消预订 | 是 |

**接口示例：**

```javascript
// GET /api/homestay/:id/calendar?check_in_date=2026-10-01&check_out_date=2026-10-03
// Response
{
  "code": 200,
  "data": {
    "room_types": [
      {
        "id": 1,
        "name": "苗族木屋大床房",
        "price": 268.00,
        "available": true,  // 该时段是否有房
        "min_available_count": 2,  // 该时段最少可用房间数
        "calendar": [
          {
            "date": "2026-10-01",
            "price": 268.00,
            "available_count": 3
          },
          {
            "date": "2026-10-02",
            "price": 288.00,
            "available_count": 2
          }
        ]
      }
    ]
  }
}
```

#### 4.2.5 票务模块 `/api/ticket` & `/api/route`

**票务接口：**

| 接口 | 方法 | 路径 | 说明 | 鉴权 |
|------|-----|------|------|-----|
| 景区列表 | GET | `/scenic-spots` | 景区列表 | 否 |
| 景区详情 | GET | `/scenic-spots/:id` | 景区详情+票种 | 否 |
| 购买门票 | POST | `/order` | 购买门票 | 是 |
| 我的电子票 | GET | `/my-tickets` | 我的电子票 | 是 |

**路线接口：**

| 接口 | 方法 | 路径 | 说明 | 鉴权 |
|------|-----|------|------|-----|
| 路线列表 | GET | `/list` | 路线套餐列表 | 否 |
| 路线详情 | GET | `/:id` | 路线详情+行程 | 否 |
| 购买路线 | POST | `/order` | 购买路线套餐 | 是 |

#### 4.2.6 社区模块 `/api/community`

| 接口 | 方法 | 路径 | 说明 | 鉴权 |
|------|-----|------|------|-----|
| 游记列表 | GET | `/posts` | 游记信息流 | 否 |
| 游记详情 | GET | `/posts/:id` | 游记详情 | 否 |
| 发布游记 | POST | `/posts` | 发布游记 | 是 |
| 删除游记 | DELETE | `/posts/:id` | 删除我的游记 | 是 |
| 点赞 | POST | `/like` | 点赞/取消点赞 | 是 |
| 收藏游记 | POST | `/favorite` | 收藏/取消收藏 | 是 |
| 评论列表 | GET | `/posts/:id/comments` | 获取评论列表 | 否 |
| 发表评论 | POST | `/comments` | 发表评论 | 是 |
| 删除评论 | DELETE | `/comments/:id` | 删除我的评论 | 是 |
| 话题列表 | GET | `/topics` | 话题列表 | 否 |
| 话题详情 | GET | `/topics/:id` | 话题下的游记 | 否 |
| 关注用户 | POST | `/follow` | 关注/取消关注 | 是 |
| 我的关注 | GET | `/my-follows` | 我的关注列表 | 是 |
| 我的粉丝 | GET | `/my-fans` | 我的粉丝列表 | 是 |
| 举报 | POST | `/report` | 举报内容 | 是 |

#### 4.2.7 订单模块 `/api/order`

| 接口 | 方法 | 路径 | 说明 | 鉴权 |
|------|-----|------|------|-----|
| 创建订单 | POST | `/create` | 创建订单 | 是 |
| 订单列表 | GET | `/list` | 我的订单列表 | 是 |
| 订单详情 | GET | `/:id` | 订单详情 | 是 |
| 取消订单 | PUT | `/:id/cancel` | 取消订单 | 是 |
| 确认收货 | PUT | `/:id/confirm` | 确认收货 | 是 |
| 申请退款 | POST | `/:id/refund` | 申请退款 | 是 |

#### 4.2.8 支付模块 `/api/payment`

| 接口 | 方法 | 路径 | 说明 | 鉴权 |
|------|-----|------|------|-----|
| 发起支付 | POST | `/pay` | 发起支付 | 是 |
| 支付回调 | POST | `/notify` | 微信支付回调 | 否 |
| 查询支付状态 | GET | `/status/:order_id` | 查询订单支付状态 | 是 |

#### 4.2.9 购物车模块 `/api/cart`

| 接口 | 方法 | 路径 | 说明 | 鉴权 |
|------|-----|------|------|-----|
| 购物车列表 | GET | `/list` | 获取购物车 | 是 |
| 添加商品 | POST | `/add` | 添加到购物车 | 是 |
| 更新数量 | PUT | `/update` | 更新商品数量 | 是 |
| 删除商品 | DELETE | `/remove` | 删除购物车商品 | 是 |
| 全选/反选 | PUT | `/select-all` | 全选/取消全选 | 是 |

#### 4.2.10 文件上传 `/api/upload`

| 接口 | 方法 | 路径 | 说明 | 鉴权 |
|------|-----|------|------|-----|
| 上传图片 | POST | `/image` | 上传单张图片 | 是 |
| 批量上传图片 | POST | `/images` | 批量上传图片 | 是 |
| 上传视频 | POST | `/video` | 上传视频 | 是 |

### 4.3 管理后台接口 `/api/admin`

**用户管理 `/api/admin/user`**

| 接口 | 方法 | 路径 | 说明 |
|------|-----|------|------|
| 用户列表 | GET | `/list` | 分页查询用户 |
| 用户详情 | GET | `/:id` | 用户详情 |
| 封禁用户 | PUT | `/:id/ban` | 封禁/解封用户 |

**商家管理 `/api/admin/merchant`**

| 接口 | 方法 | 路径 | 说明 |
|------|-----|------|------|
| 申请列表 | GET | `/applications` | 商家入驻申请列表 |
| 审核 | PUT | `/applications/:id/review` | 审核申请 |
| 商家列表 | GET | `/list` | 商家列表 |

**内容审核 `/api/admin/content`**

| 接口 | 方法 | 路径 | 说明 |
|------|-----|------|------|
| 待审核列表 | GET | `/pending` | 待审核内容列表 |
| 审核通过 | PUT | `/:id/approve` | 审核通过 |
| 审核拒绝 | PUT | `/:id/reject` | 审核拒绝 |

**数据看板 `/api/admin/dashboard`**

| 接口 | 方法 | 路径 | 说明 |
|------|-----|------|------|
| 概览数据 | GET | `/overview` | 平台概览数据 |
| 订单统计 | GET | `/order-stats` | 订单统计 |
| 用户统计 | GET | `/user-stats` | 用户增长统计 |

---

## 5. 前端架构设计

### 5.1 uni-app 项目结构

```
wudong-tourist-uniapp/
├── pages/
│   ├── index/                     # 首页
│   │   └── index.vue
│   ├── product/                   # 商品模块（衣）
│   │   ├── list.vue              # 商品列表
│   │   ├── detail.vue            # 商品详情
│   │   └── review.vue            # 评价列表
│   ├── restaurant/                # 餐饮模块（食）
│   │   ├── list.vue              # 餐厅列表
│   │   ├── detail.vue            # 餐厅详情
│   │   └── booking.vue           # 餐位预订
│   ├── agri-product/              # 农产品
│   │   ├── list.vue
│   │   └── detail.vue
│   ├── homestay/                  # 住宿模块（住）
│   │   ├── list.vue              # 民宿列表
│   │   ├── detail.vue            # 民宿详情
│   │   └── booking.vue           # 预订页面
│   ├── ticket/                    # 票务模块（行）
│   │   ├── scenic-list.vue       # 景区列表
│   │   ├── scenic-detail.vue     # 景区详情
│   │   ├── route-list.vue        # 路线列表
│   │   ├── route-detail.vue      # 路线详情
│   │   └── traffic-guide.vue     # 交通攻略
│   ├── community/                 # 社区模块
│   │   ├── index.vue             # 信息流
│   │   ├── post-detail.vue       # 游记详情
│   │   ├── publish.vue           # 发布游记
│   │   ├── topic-detail.vue      # 话题详情
│   │   └── user-profile.vue      # 用户主页
│   ├── cart/                      # 购物车
│   │   └── index.vue
│   ├── order/                     # 订单
│   │   ├── confirm.vue           # 确认订单
│   │   ├── list.vue              # 订单列表
│   │   ├── detail.vue            # 订单详情
│   │   └── refund.vue            # 申请退款
│   └── user/                      # 个人中心
│       ├── index.vue             # 个人中心首页
│       ├── profile.vue           # 个人资料
│       ├── address.vue           # 收货地址
│       ├── favorites.vue         # 我的收藏
│       ├── reviews.vue           # 我的评价
│       ├── messages.vue          # 消息中心
│       └── settings.vue          # 设置
├── components/                    # 公共组件
│   ├── ProductCard.vue           # 商品卡片
│   ├── RestaurantCard.vue        # 餐厅卡片
│   ├── HomestayCard.vue          # 民宿卡片
│   ├── PostCard.vue              # 游记卡片
│   ├── ImageUploader.vue         # 图片上传
│   ├── VideoPlayer.vue           # 视频播放
│   ├── StarRating.vue            # 星级评分
│   ├── Calendar.vue              # 日历组件
│   ├── TabBar.vue                # 底部导航
│   └── LoadMore.vue              # 加载更多
├── api/                           # API封装
│   ├── request.js                # 请求封装
│   ├── user.js                   # 用户接口
│   ├── product.js                # 商品接口
│   ├── restaurant.js             # 餐饮接口
│   ├── homestay.js               # 住宿接口
│   ├── ticket.js                 # 票务接口
│   ├── community.js              # 社区接口
│   ├── order.js                  # 订单接口
│   ├── cart.js                   # 购物车接口
│   └── upload.js                 # 上传接口
├── store/                         # 状态管理（Pinia）
│   ├── index.js                  # Store入口
│   ├── modules/
│   │   ├── user.js               # 用户状态
│   │   ├── cart.js               # 购物车状态
│   │   └── app.js                # 应用状态
├── utils/                         # 工具函数
│   ├── request.js                # 请求工具
│   ├── auth.js                   # 认证工具
│   ├── storage.js                # 本地存储
│   ├── validate.js               # 表单验证
│   ├── date.js                   # 日期处理
│   └── common.js                 # 通用工具
├── static/                        # 静态资源
│   ├── images/                   # 图片
│   ├── icons/                    # 图标
│   └── tabbar/                   # 底部导航图标
├── uni_modules/                   # uni-app插件
├── App.vue                        # 应用入口
├── main.js                        # 入口文件
├── manifest.json                  # 应用配置
├── pages.json                     # 页面配置
└── package.json
```

### 5.2 管理后台项目结构

```
wudong-admin/
├── src/
│   ├── modules/                   # 模块
│   │   ├── base/                 # 基础模块
│   │   │   ├── user/             # 用户管理
│   │   │   ├── role/             # 角色管理
│   │   │   └── menu/             # 菜单管理
│   │   ├── product/              # 商品管理
│   │   │   ├── category/         # 分类管理
│   │   │   ├── product/          # 商品管理
│   │   │   └── review/           # 评价管理
│   │   ├── restaurant/           # 餐饮管理
│   │   ├── homestay/             # 住宿管理
│   │   ├── ticket/               # 票务管理
│   │   ├── community/            # 社区管理
│   │   ├── order/                # 订单管理
│   │   ├── merchant/             # 商家管理
│   │   └── dashboard/            # 数据看板
│   ├── components/               # 公共组件
│   ├── assets/                   # 静态资源
│   ├── utils/                    # 工具函数
│   ├── router/                   # 路由
│   ├── store/                    # 状态管理
│   ├── App.vue
│   └── main.ts
├── public/
├── .env.development              # 开发环境变量
├── .env.production               # 生产环境变量
├── vite.config.ts                # Vite配置
├── tsconfig.json                 # TypeScript配置
└── package.json
```

### 5.3 前端关键技术点

#### 5.3.1 uni-app 跨端适配

```javascript
// pages.json - 页面配置
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "乌东文旅"
      }
    }
  ],
  "tabBar": {
    "color": "#666666",
    "selectedColor": "#00C853",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "static/tabbar/home.png",
        "selectedIconPath": "static/tabbar/home-active.png"
      },
      {
        "pagePath": "pages/community/index",
        "text": "社区",
        "iconPath": "static/tabbar/community.png",
        "selectedIconPath": "static/tabbar/community-active.png"
      },
      {
        "pagePath": "pages/cart/index",
        "text": "购物车",
        "iconPath": "static/tabbar/cart.png",
        "selectedIconPath": "static/tabbar/cart-active.png"
      },
      {
        "pagePath": "pages/user/index",
        "text": "我的",
        "iconPath": "static/tabbar/user.png",
        "selectedIconPath": "static/tabbar/user-active.png"
      }
    ]
  }
}
```

#### 5.3.2 请求封装

```javascript
// utils/request.js
import { useUserStore } from '@/store/modules/user'

const BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:7001/api' 
  : 'https://api.wudong-tourist.com/api'

export function request(options) {
  const userStore = useUserStore()
  
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': userStore.token ? `Bearer ${userStore.token}` : ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data.data)
          } else if (res.data.code === 401) {
            // 未登录
            userStore.logout()
            uni.showToast({ title: '请先登录', icon: 'none' })
            uni.navigateTo({ url: '/pages/login/index' })
            reject(res.data)
          } else {
            uni.showToast({ title: res.data.message, icon: 'none' })
            reject(res.data)
          }
        } else {
          uni.showToast({ title: '网络请求失败', icon: 'none' })
          reject(res)
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络请求失败', icon: 'none' })
        reject(err)
      }
    })
  })
}
```

#### 5.3.3 状态管理（Pinia）

```javascript
// store/modules/user.js
import { defineStore } from 'pinia'
import { login, getUserProfile } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('userInfo') || null
  }),
  
  getters: {
    isLogin: (state) => !!state.token,
    nickname: (state) => state.userInfo?.nickname || '游客'
  },
  
  actions: {
    async login(data) {
      const res = await login(data)
      this.token = res.token
      this.userInfo = res.user
      uni.setStorageSync('token', res.token)
      uni.setStorageSync('userInfo', res.user)
    },
    
    async getUserInfo() {
      const res = await getUserProfile()
      this.userInfo = res
      uni.setStorageSync('userInfo', res)
    },
    
    logout() {
      this.token = ''
      this.userInfo = null
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')
    }
  }
})
```

#### 5.3.4 分页加载

```vue
<!-- pages/product/list.vue -->
<template>
  <view class="product-list">
    <view class="product-item" v-for="item in list" :key="item.id" @click="goDetail(item.id)">
      <ProductCard :product="item" />
    </view>
    
    <LoadMore :status="loadMoreStatus" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProductList } from '@/api/product'

const list = ref([])
const page = ref(1)
const pageSize = 10
const total = ref(0)
const loadMoreStatus = ref('more') // more/loading/nomore

const loadData = async () => {
  if (loadMoreStatus.value === 'nomore' || loadMoreStatus.value === 'loading') return
  
  loadMoreStatus.value = 'loading'
  
  try {
    const res = await getProductList({ page: page.value, pageSize })
    list.value = [...list.value, ...res.list]
    total.value = res.pagination.total
    page.value++
    
    if (list.value.length >= total.value) {
      loadMoreStatus.value = 'nomore'
    } else {
      loadMoreStatus.value = 'more'
    }
  } catch (error) {
    loadMoreStatus.value = 'more'
  }
}

onMounted(() => {
  loadData()
})

// 下拉刷新
onPullDownRefresh(() => {
  list.value = []
  page.value = 1
  loadMoreStatus.value = 'more'
  loadData().then(() => {
    uni.stopPullDownRefresh()
  })
})

// 上拉加载
onReachBottom(() => {
  loadData()
})
</script>
```

---

## 6. 核心业务实现

### 6.1 用户认证流程

#### 6.1.1 手机号注册登录

```typescript
// server/src/modules/auth/service.ts
import { Provide } from '@midwayjs/decorator'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../entity/user'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

@Provide()
export class AuthService {
  @InjectEntityModel(User)
  userModel: Repository<User>
  
  // 注册
  async register(phone: string, password: string, code: string) {
    // 1. 验证验证码
    const isValidCode = await this.verifyCode(phone, code)
    if (!isValidCode) {
      throw new Error('验证码错误')
    }
    
    // 2. 检查手机号是否已注册
    const existUser = await this.userModel.findOne({ where: { phone } })
    if (existUser) {
      throw new Error('手机号已注册')
    }
    
    // 3. 密码加密
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // 4. 创建用户
    const user = await this.userModel.save({
      phone,
      password: hashedPassword,
      nickname: `用户${phone.substring(3, 7)}****${phone.substring(7)}`,
      role: 'user',
      status: 'active'
    })
    
    // 5. 生成token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // 6. 保存token到Redis
    await this.redis.setex(`token:${user.id}`, 7 * 24 * 3600, token)
    
    return {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role
      }
    }
  }
  
  // 登录
  async login(phone: string, password: string) {
    // 1. 查找用户
    const user = await this.userModel.findOne({ where: { phone } })
    if (!user) {
      throw new Error('用户不存在')
    }
    
    // 2. 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error('密码错误')
    }
    
    // 3. 检查用户状态
    if (user.status === 'banned') {
      throw new Error('账号已被封禁')
    }
    
    // 4. 生成token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // 5. 保存token到Redis
    await this.redis.setex(`token:${user.id}`, 7 * 24 * 3600, token)
    
    // 6. 更新最后登录时间
    await this.userModel.update(user.id, { last_login_at: new Date() })
    
    return {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role
      }
    }
  }
  
  // 微信登录
  async wechatLogin(code: string) {
    // 1. 调用微信接口换取openid
    const wxRes = await this.getWechatOpenId(code)
    
    // 2. 查找或创建用户
    let user = await this.userModel.findOne({ where: { openid: wxRes.openid } })
    
    if (!user) {
      // 首次登录，创建用户
      user = await this.userModel.save({
        openid: wxRes.openid,
        unionid: wxRes.unionid,
        nickname: `微信用户`,
        role: 'user',
        status: 'active'
      })
    }
    
    // 3. 生成token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    await this.redis.setex(`token:${user.id}`, 7 * 24 * 3600, token)
    
    return { token, user }
  }
}
```

#### 6.1.2 JWT认证中间件

```typescript
// server/src/middleware/auth.ts
import { Middleware } from '@midwayjs/decorator'
import { Context, NextFunction } from '@midwayjs/koa'
import * as jwt from 'jsonwebtoken'

@Middleware()
export class AuthMiddleware {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const token = ctx.headers.authorization?.replace('Bearer ', '')
      
      if (!token) {
        ctx.status = 401
        ctx.body = { code: 401, message: '未登录' }
        return
      }
      
      try {
        // 验证token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // 检查Redis中是否存在
        const cachedToken = await ctx.app.redis.get(`token:${decoded.userId}`)
        if (cachedToken !== token) {
          ctx.status = 401
          ctx.body = { code: 401, message: 'Token已失效' }
          return
        }
        
        // 将用户信息挂载到ctx上
        ctx.userId = decoded.userId
        ctx.userRole = decoded.role
        
        await next()
      } catch (error) {
        ctx.status = 401
        ctx.body = { code: 401, message: 'Token无效' }
      }
    }
  }
}
```

### 6.2 订单与支付流程

#### 6.2.1 创建订单

```typescript
// server/src/modules/order/service.ts
@Provide()
export class OrderService {
  // 创建商品订单
  async createProductOrder(userId: number, data: CreateProductOrderDto) {
    // 1. 生成订单号（雪花算法）
    const orderId = this.generateOrderId()
    
    // 2. 计算订单金额
    let totalAmount = 0
    const orderItems = []
    
    for (const item of data.items) {
      const sku = await this.productSkuModel.findOne({ where: { id: item.skuId } })
      if (!sku || sku.stock < item.quantity) {
        throw new Error(`商品 ${sku.sku_name} 库存不足`)
      }
      
      const itemAmount = sku.price * item.quantity
      totalAmount += itemAmount
      
      orderItems.push({
        order_id: orderId,
        product_id: sku.product_id,
        sku_id: sku.id,
        product_name: item.productName,
        sku_name: sku.sku_name,
        image: sku.image,
        price: sku.price,
        quantity: item.quantity,
        total_amount: itemAmount
      })
    }
    
    // 3. 加上运费
    totalAmount += data.shippingFee || 0
    
    // 4. 创建订单（使用事务）
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    
    try {
      // 保存订单
      const order = await queryRunner.manager.save(Order, {
        id: orderId,
        user_id: userId,
        order_type: 'product',
        total_amount: totalAmount,
        status: 'pending'
      })
      
      // 保存订单明细
      await queryRunner.manager.save(ProductOrderItem, orderItems)
      
      // 保存物流信息
      await queryRunner.manager.save(ProductOrderLogistics, {
        order_id: orderId,
        consignee: data.consignee,
        phone: data.phone,
        province: data.province,
        city: data.city,
        district: data.district,
        detail: data.detail,
        shipping_fee: data.shippingFee || 0
      })
      
      // 扣减库存
      for (const item of data.items) {
        await queryRunner.manager.decrement(
          ProductSku,
          { id: item.skuId },
          'stock',
          item.quantity
        )
      }
      
      // 清空购物车
      if (data.clearCart) {
        await queryRunner.manager.delete(Cart, { user_id: userId })
      }
      
      await queryRunner.commitTransaction()
      
      return { orderId, totalAmount }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }
  
  // 创建餐位预订订单
  async createRestaurantBooking(userId: number, data: CreateRestaurantBookingDto) {
    // 1. 检查餐位是否可预订
    const timeslot = await this.timeslotModel.findOne({ where: { id: data.timeslotId } })
    if (!timeslot) {
      throw new Error('时段不存在')
    }
    
    // 2. 检查当前日期该时段已预订数量
    const bookedCount = await this.bookingModel.count({
      where: {
        restaurant_id: data.restaurantId,
        timeslot_id: data.timeslotId,
        booking_date: data.bookingDate,
        status: In(['pending', 'confirmed'])
      }
    })
    
    if (bookedCount >= timeslot.max_bookings) {
      throw new Error('该时段已订满')
    }
    
    // 3. 创建订单
    const orderId = this.generateOrderId()
    const totalAmount = 0 // 餐位预订暂不收费
    
    await this.orderModel.save({
      id: orderId,
      user_id: userId,
      order_type: 'restaurant',
      total_amount: totalAmount,
      status: 'pending'
    })
    
    await this.bookingModel.save({
      order_id: orderId,
      restaurant_id: data.restaurantId,
      timeslot_id: data.timeslotId,
      user_id: userId,
      booking_date: data.bookingDate,
      people_count: data.peopleCount,
      consignee: data.consignee,
      phone: data.phone,
      remark: data.remark,
      status: 'pending'
    })
    
    return { orderId, totalAmount }
  }
}
```

#### 6.2.2 微信支付

```typescript
// server/src/modules/payment/service.ts
import axios from 'axios'
import * as crypto from 'crypto'

@Provide()
export class PaymentService {
  // 发起支付
  async createPayment(orderId: string, userId: number, paymentMethod: string) {
    // 1. 查询订单
    const order = await this.orderModel.findOne({ where: { id: orderId } })
    if (!order) {
      throw new Error('订单不存在')
    }
    
    if (order.user_id !== userId) {
      throw new Error('无权限')
    }
    
    if (order.status !== 'pending') {
      throw new Error('订单状态不正确')
    }
    
    // 2. 调用微信支付
    if (paymentMethod === 'wechat') {
      const payParams = await this.wechatPay(order)
      return payParams
    }
    
    throw new Error('不支持的支付方式')
  }
  
  // 微信小程序支付
  async wechatPay(order: Order) {
    const url = 'https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi'
    
    const data = {
      appid: process.env.WECHAT_APPID,
      mchid: process.env.WECHAT_MCHID,
      description: `订单${order.id}`,
      out_trade_no: order.id.toString(),
      notify_url: process.env.WECHAT_NOTIFY_URL,
      amount: {
        total: Math.floor(order.total_amount * 100), // 分
        currency: 'CNY'
      },
      payer: {
        openid: await this.getUserOpenId(order.user_id)
      }
    }
    
    // 签名并发送请求
    const signature = this.wechatSign(data)
    
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': signature,
        'Content-Type': 'application/json'
      }
    })
    
    return {
      timeStamp: Math.floor(Date.now() / 1000).toString(),
      nonceStr: response.data.prepay_id,
      package: `prepay_id=${response.data.prepay_id}`,
      signType: 'RSA',
      paySign: this.generatePaySign(response.data.prepay_id)
    }
  }
  
  // 支付回调
  async paymentNotify(data: any) {
    // 1. 验证签名
    const isValid = this.verifyWechatSignature(data)
    if (!isValid) {
      throw new Error('签名验证失败')
    }
    
    // 2. 解密数据
    const decrypted = this.decryptWechatData(data.resource)
    
    // 3. 更新订单状态
    const orderId = decrypted.out_trade_no
    const paymentNo = decrypted.transaction_id
    
    await this.orderModel.update(
      { id: orderId },
      {
        status: 'paid',
        payment_no: paymentNo,
        paid_at: new Date()
      }
    )
    
    // 4. 业务处理（生成电子票等）
    await this.handleOrderPaid(orderId)
    
    return { code: 'SUCCESS', message: '成功' }
  }
}
```

### 6.3 房态日历管理

```typescript
// server/src/modules/homestay/service.ts
@Provide()
export class HomestayService {
  // 查询房态
  async getRoomCalendar(roomTypeId: number, checkInDate: string, checkOutDate: string) {
    const calendar = await this.calendarModel.find({
      where: {
        room_type_id: roomTypeId,
        date: Between(checkInDate, checkOutDate)
      },
      order: { date: 'ASC' }
    })
    
    // 计算该时段最少可用房间数
    const minAvailable = Math.min(...calendar.map(c => c.available_count))
    
    return {
      roomTypeId,
      available: minAvailable > 0,
      minAvailableCount: minAvailable,
      calendar
    }
  }
  
  // 预订时扣减房态
  async bookRoom(roomTypeId: number, checkInDate: string, checkOutDate: string, roomCount: number) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    
    try {
      // 获取日期范围内的所有日期
      const dates = this.getDateRange(checkInDate, checkOutDate)
      
      for (const date of dates) {
        // 减少可用房间数
        const result = await queryRunner.manager.decrement(
          HomestayRoomCalendar,
          { room_type_id: roomTypeId, date },
          'available_count',
          roomCount
        )
        
        // 检查是否扣减成功
        const calendar = await queryRunner.manager.findOne(HomestayRoomCalendar, {
          where: { room_type_id: roomTypeId, date }
        })
        
        if (calendar.available_count < 0) {
          throw new Error(`${date} 房间不足`)
        }
      }
      
      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }
  
  // 取消预订时恢复房态
  async cancelBooking(booking: HomestayBooking) {
    const dates = this.getDateRange(booking.check_in_date, booking.check_out_date)
    
    for (const date of dates) {
      await this.calendarModel.increment(
        { room_type_id: booking.room_type_id, date },
        'available_count',
        booking.room_count
      )
    }
  }
}
```

### 6.4 内容审核机制

```typescript
// server/src/modules/community/service.ts
@Provide()
export class CommunityService {
  // 发布游记
  async createPost(userId: number, data: CreatePostDto) {
    // 1. 敏感词过滤
    const hasSensitiveWord = await this.checkSensitiveWords(data.title + data.content)
    
    const post = await this.postModel.save({
      user_id: userId,
      title: data.title,
      content: data.content,
      video_url: data.videoUrl,
      related_type: data.relatedType,
      related_id: data.relatedId,
      topic_ids: data.topicIds,
      status: hasSensitiveWord ? 'pending' : 'published', // 命中敏感词进入审核
      published_at: hasSensitiveWord ? null : new Date()
    })
    
    // 2. 保存图片
    if (data.images && data.images.length > 0) {
      const images = data.images.map((url, index) => ({
        post_id: post.id,
        url,
        sort: index
      }))
      await this.postImageModel.save(images)
    }
    
    // 3. 如果自动发布，更新话题游记数
    if (!hasSensitiveWord && data.topicIds) {
      await this.topicModel.increment(
        { id: In(data.topicIds) },
        'post_count',
        1
      )
    }
    
    return post
  }
  
  // 敏感词检测
  async checkSensitiveWords(text: string): Promise<boolean> {
    const words = await this.sensitiveWordModel.find({
      where: { status: 'active' }
    })
    
    for (const word of words) {
      if (text.includes(word.word)) {
        return true
      }
    }
    
    return false
  }
  
  // 审核游记
  async reviewPost(postId: number, approve: boolean, rejectReason?: string) {
    const post = await this.postModel.findOne({ where: { id: postId } })
    
    if (approve) {
      await this.postModel.update(postId, {
        status: 'published',
        published_at: new Date()
      })
      
      // 更新话题游记数
      if (post.topic_ids) {
        await this.topicModel.increment(
          { id: In(post.topic_ids) },
          'post_count',
          1
        )
      }
    } else {
      await this.postModel.update(postId, {
        status: 'rejected',
        reject_reason: rejectReason
      })
    }
  }
}
```

---

## 7. 安全方案

### 7.1 认证与授权

1. **JWT Token认证**
   - Token有效期7天
   - Token存储在Redis，支持主动失效
   - 敏感操作需要二次验证

2. **RBAC权限模型**
   - 角色：游客(user)、商家(merchant)、管理员(admin)
   - 权限：基于路由和操作的细粒度控制

3. **密码安全**
   - bcrypt加密，加盐轮次10
   - 密码复杂度要求：8-20位，字母+数字
   - 登录失败5次锁定账号30分钟

### 7.2 数据安全

1. **SQL注入防护**
   - 使用TypeORM参数化查询
   - 禁止拼接SQL语句

2. **XSS防护**
   - 富文本内容使用DOMPurify过滤
   - 前端渲染时使用v-html需谨慎

3. **CSRF防护**
   - POST请求携带CSRF Token
   - 验证Referer头

4. **敏感信息脱敏**
   - 手机号：138****8000
   - 身份证号：前6位+****+后4位

### 7.3 接口安全

1. **请求限流**
   - 基于IP限流：100次/分钟
   - 基于用户限流：1000次/小时
   - 短信验证码：5次/天

2. **参数校验**
   - 使用class-validator进行参数验证
   - 文件上传大小限制

3. **日志审计**
   - 记录所有敏感操作
   - 日志保留1年

### 7.4 文件上传安全

1. **文件类型限制**
   - 图片：jpg/png/webp
   - 视频：mp4
   - 大小限制：图片5MB、视频100MB

2. **文件存储**
   - 文件重命名（UUID）
   - 禁止执行权限

---

## 8. 部署方案

### 8.1 服务器环境

**推荐配置：**
- 系统：CentOS 7.9 / Ubuntu 20.04
- CPU：4核
- 内存：8GB
- 硬盘：100GB SSD
- 带宽：5Mbps

### 8.2 软件版本

| 软件 | 版本 |
|------|------|
| Node.js | 18.x LTS |
| MySQL | 8.0+ |
| Redis | 7.0+ |
| Nginx | 1.24+ |
| PM2 | 5.x |

### 8.3 部署架构

```
┌─────────────┐
│   用户请求   │
└──────┬──────┘
       │
┌──────▼──────┐
│   CDN加速   │ (静态资源)
└──────┬──────┘
       │
┌──────▼──────┐
│    Nginx    │ (反向代理 + SSL)
└──────┬──────┘
       │
┌──────▼──────┐
│   Node.js   │ (PM2 cluster模式，4进程)
│  应用服务器  │
└──────┬──────┘
       │
  ┌────┼────┐
  │    │    │
┌─▼─┐ ┌▼─┐ ┌▼──┐
│MySQL│Redis│本地│
└────┘ └──┘ └──┘
```

### 8.4 Nginx配置

```nginx
server {
    listen 80;
    server_name wudong-tourist.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name wudong-tourist.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # API代理
    location /api {
        proxy_pass http://127.0.0.1:7001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # 静态资源
    location /uploads {
        alias /var/www/wudong-tourist/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # H5前端
    location / {
        root /var/www/wudong-tourist/client-h5;
        try_files $uri $uri/ /index.html;
    }
    
    # 管理后台
    location /admin {
        root /var/www/wudong-tourist/admin;
        try_files $uri $uri/ /admin/index.html;
    }
}
```

### 8.5 PM2配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'wudong-tourist-api',
    script: './bootstrap.js',
    instances: 4,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 7001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
}
```

### 8.6 部署脚本

```bash
#!/bin/bash
# deploy.sh

echo "开始部署..."

# 1. 拉取最新代码
git pull origin main

# 2. 安装依赖
cd server && pnpm install --prod

# 3. 构建前端
cd ../client-uniapp && pnpm build:h5
cd ../admin && pnpm build

# 4. 数据库迁移
cd ../server && pnpm run migration:run

# 5. 重启服务
pm2 reload ecosystem.config.js

echo "部署完成！"
```

---

## 9. 开发计划

### 9.1 总体时间规划（8周）

| 阶段 | 周数 | 内容 |
|------|------|------|
| 第1周 | 1周 | 项目搭建 + 基础功能 |
| 第2-5周 | 4周 | 核心模块开发 |
| 第6-7周 | 2周 | 管理后台开发 |
| 第8周 | 1周 | 测试优化 + 部署 |

### 9.2 详细任务分解

#### 第1周：项目搭建与基础功能

**后端（3天）：**
- [ ] 初始化Midway.js项目
- [ ] 配置TypeORM + MySQL
- [ ] 配置Redis
- [ ] 搭建用户注册/登录模块
- [ ] JWT认证中间件
- [ ] 文件上传功能

**前端（4天）：**
- [ ] 初始化uni-app项目
- [ ] 初始化管理后台项目
- [ ] 配置请求封装
- [ ] 配置Pinia状态管理
- [ ] 搭建登录注册页面
- [ ] 搭建首页框架
- [ ] 搭建底部TabBar

**完成标准：**
- 用户可以注册登录
- 前后端联调成功
- 文件上传功能可用

#### 第2周：商品模块（衣）

**后端：**
- [ ] 商品分类CRUD
- [ ] 商品CRUD（含SKU）
- [ ] 商品列表查询（分页/筛选/排序）
- [ ] 商品搜索
- [ ] 商品收藏
- [ ] 商品评价

**前端：**
- [ ] 商品列表页
- [ ] 商品详情页
- [ ] 商品搜索页
- [ ] 购物车页面
- [ ] 确认订单页面
- [ ] 我的收藏页面

**完成标准：**
- 用户可以浏览商品、加入购物车、下单

#### 第3周：餐饮模块（食）+ 住宿模块（住）

**后端：**
- [ ] 餐厅CRUD + 菜品管理
- [ ] 餐位预订（时段管理）
- [ ] 农产品CRUD
- [ ] 民宿CRUD + 房型管理
- [ ] 房态日历管理
- [ ] 住宿预订

**前端：**
- [ ] 餐厅列表/详情
- [ ] 餐位预订页面
- [ ] 农产品列表/详情
- [ ] 民宿列表/详情
- [ ] 房态日历组件
- [ ] 住宿预订页面

**完成标准：**
- 用户可以预订餐位和民宿

#### 第4周：票务模块（行）+ 支付集成

**后端：**
- [ ] 景区 + 票种管理
- [ ] 路线套餐 + 行程管理
- [ ] 电子票生成
- [ ] 微信支付集成
- [ ] 支付回调处理
- [ ] 订单状态流转

**前端：**
- [ ] 景区列表/详情
- [ ] 路线列表/详情
- [ ] 购票页面
- [ ] 我的电子票
- [ ] 支付页面
- [ ] 订单列表/详情

**完成标准：**
- 用户可以购买门票和路线
- 支付流程完整

#### 第5周：社区模块

**后端：**
- [ ] 游记发布（图片/视频上传）
- [ ] 游记列表（信息流）
- [ ] 点赞/收藏/评论
- [ ] 话题管理
- [ ] 用户关注
- [ ] 内容审核（敏感词过滤）
- [ ] 举报处理

**前端：**
- [ ] 社区首页（信息流）
- [ ] 游记详情页
- [ ] 发布游记页面
- [ ] 话题页面
- [ ] 用户主页
- [ ] 评论组件

**完成标准：**
- 用户可以发布游记、互动

#### 第6-7周：管理后台

**商家后台：**
- [ ] 商家工作台
- [ ] 商品管理（衣）
- [ ] 餐厅管理（食）
- [ ] 民宿管理（住）
- [ ] 票务管理（行）
- [ ] 订单管理
- [ ] 数据统计

**平台后台：**
- [ ] 数据看板
- [ ] 用户管理
- [ ] 商家管理（入驻审核）
- [ ] 内容审核
- [ ] 订单管理（全局）
- [ ] 轮播图/公告管理
- [ ] 系统设置

**完成标准：**
- 商家可以管理自己的商品和订单
- 平台管理员可以管理全局数据

#### 第8周：测试优化与部署

- [ ] 功能测试（用例覆盖）
- [ ] 性能优化（接口响应时间）
- [ ] 安全加固（XSS/SQL注入测试）
- [ ] UI/UX优化
- [ ] 服务器部署
- [ ] 小程序提审
- [ ] 编写部署文档

**完成标准：**
- 所有功能可用
- 性能指标达标
- 成功部署上线

---

## 10. 附录

### 10.1 cool-js快速开发示例

```typescript
// 使用cool-js快速创建CRUD
import { CoolController, BaseController } from '@cool-midway/core'
import { Product } from '../entity/product'

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: Product
})
export class ProductController extends BaseController {}

// 以上代码自动生成6个接口：
// POST   /api/product/add      - 新增
// POST   /api/product/delete   - 删除
// POST   /api/product/update   - 更新
// GET    /api/product/info     - 详情
// GET    /api/product/list     - 列表
// POST   /api/product/page     - 分页
```

### 10.2 技术难点与解决方案

| 难点 | 解决方案 |
|------|---------|
| 房态日历并发扣减 | 使用数据库事务 + 行锁 |
| 订单高并发 | Redis分布式锁 + 库存预扣 |
| 图片上传慢 | 前端压缩 + 后端异步生成缩略图 |
| 敏感词过滤 | 使用DFA算法构建Trie树 |
| 支付回调幂等性 | Redis记录回调状态 |

### 10.3 性能优化建议

1. **数据库优化**
   - 高频查询字段建索引
   - 使用Redis缓存热点数据
   - 分页查询避免使用offset

2. **接口优化**
   - 列表接口只返回必要字段
   - 使用HTTP缓存（ETag）
   - 批量接口合并请求

3. **前端优化**
   - 图片懒加载
   - 虚拟列表（长列表）
   - 防抖节流

---

## 文档结束

本技术设计文档完整定义了乌东文旅平台的技术架构、数据库设计、API接口、前端架构、核心业务实现、安全方案、部署方案和开发计划。

**下一步：**
1. 审查本设计文档
2. 调用 `writing-plans` 技能生成详细实施计划
3. 开始项目实施
```

