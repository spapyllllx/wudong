# 乌东文旅平台完整技术设计方案

| 项目信息 | 内容 |
|---------|------|
| 文档版本 | V1.0 |
| 编制日期 | 2026-09-08 |
| 项目名称 | 乌东文旅"衣食住行"综合服务平台 |
| 技术架构 | Midway.js + Cool-Admin + uni-app |
| 目标用户 | 游客、商家、平台管理员 |

---

## 目录

1. [整体架构设计](#1-整体架构设计)
   - 1.1 [系统架构图](#11-系统架构图)
   - 1.2 [模块职责划分](#12-模块职责划分)
   - 1.3 [三端架构](#13-三端架构)
2. [技术选型与说明](#2-技术选型与说明)
   - 2.1 [核心技术栈](#21-核心技术栈)
   - 2.2 [Cool Admin 核心能力](#22-cool-admin-核心能力)
   - 2.3 [开发工具](#23-开发工具)
3. [项目目录结构](#3-项目目录结构)
   - 3.1 [后端项目结构](#31-后端项目结构基于cool-admin)
   - 3.2 [前端项目结构](#32-前端项目结构)
4. [数据库设计](#4-数据库设计)
   - 4.1 [设计原则](#41-设计原则)
   - 4.2 [公共基础模块表设计](#42-公共基础模块表设计)
   - 4.3 [业务模块表设计](#43-业务模块表设计)
5. [API接口设计](#5-api接口设计)
   - 5.1 [接口规范](#51-接口规范)
   - 5.2 [核心接口列表](#52-核心接口列表)
   - 5.3 [Swagger API 文档集成](#53-swagger-api-文档集成) ⭐ 新增
6. [核心功能实现方案](#6-核心功能实现方案)
   - 6.1 [用户认证与授权](#61-用户认证与授权)
   - 6.2 [统一订单系统](#62-统一订单系统)
   - 6.3 [支付集成](#63-支付集成)
   - 6.4 [房态日历管理](#64-房态日历管理)
   - 6.5 [内容审核机制](#65-内容审核机制)
   - 6.6 [多商家完全分离方案](#66-多商家完全分离方案) ⭐ 新增
7. [安全方案](#7-安全方案)
8. [部署方案](#8-部署方案)
9. [开发计划](#9-开发计划)

---

## 1. 整体架构设计

### 1.1 系统架构图

```
┌──────────────────────────────────────────────────────────────┐
│                          客户端层                              │
├──────────────────┬──────────────────┬───────────────────────┤
│   微信小程序      │    PC Web端       │    管理后台 Admin      │
│   (uni-app)      │   (Vue3 + Vite)   │   (Cool Admin Vue)    │
│                  │                   │                        │
│ ┌──────────────┐ │ ┌──────────────┐ │ ┌───────────────────┐ │
│ │ 首页/分类     │ │ │ 响应式布局    │ │ │ 商家管理中心       │ │
│ │ 商品/餐饮     │ │ │ SEO优化      │ │ │ 商品/订单管理     │ │
│ │ 住宿/票务     │ │ │ 大屏展示     │ │ │ 数据统计          │ │
│ │ 社区/个人中心 │ │ │ 多端适配     │ │ ├───────────────────┤ │
│ └──────────────┘ │ └──────────────┘ │ │ 平台管理中心       │ │
│                  │                   │ │ 用户/审核/看板     │ │
└──────────────────┴──────────────────┴───────────────────────┘
                             │
                    HTTPS / JSON / WebSocket
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                      Nginx 反向代理层                          │
│  ┌────────────┬────────────┬────────────┬──────────────┐    │
│  │ SSL卸载    │ 负载均衡    │ 静态资源    │ Gzip压缩     │    │
│  │ 防火墙     │ 限流保护    │ 缓存策略    │ 日志记录     │    │
│  └────────────┴────────────┴────────────┴──────────────┘    │
└────────────────────────────┬─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│              Midway.js + Cool-Admin 应用层                     │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   中间件层                             │   │
│  │  JWT认证  │  权限校验  │  参数校验  │  异常捕获      │   │
│  │  日志记录  │  请求限流  │  CORS      │  响应格式化    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               Cool-Admin 核心服务层                    │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ 基础服务                                         │  │   │
│  │  │  • BaseService (CRUD封装)                       │  │   │
│  │  │  • BaseController (控制器基类)                  │  │   │
│  │  │  • 装饰器增强 (@CoolController, @CoolValidate)  │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ 内置功能模块                                     │  │   │
│  │  │  • 用户管理 (user)                              │  │   │
│  │  │  • 角色权限 (role/menu)                         │  │   │
│  │  │  • 文件上传 (upload)                            │  │   │
│  │  │  • 任务调度 (task)                              │  │   │
│  │  │  • 消息队列 (queue)                             │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               业务服务层 (自定义模块)                  │   │
│  │  ┌──────────┬──────────┬──────────┬──────────────┐  │   │
│  │  │ 衣-商品   │ 食-餐饮   │ 住-住宿   │ 行-票务       │  │   │
│  │  │ Product  │Restaurant│ Homestay │ Ticket/Route │  │   │
│  │  └──────────┴──────────┴──────────┴──────────────┘  │   │
│  │  ┌──────────┬──────────┬──────────┬──────────────┐  │   │
│  │  │ 社区模块  │ 订单模块  │ 支付模块  │ 购物车模块    │  │   │
│  │  │Community │  Order   │ Payment  │   Cart       │  │   │
│  │  └──────────┴──────────┴──────────┴──────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   数据访问层                           │   │
│  │  ┌────────────────┬───────────────┬────────────────┐ │   │
│  │  │   TypeORM      │   Cool-Cache  │  Cool-Queue    │ │   │
│  │  │  (实体映射)    │   (缓存装饰器) │  (队列任务)     │ │   │
│  │  └────────────────┴───────────────┴────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬─────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
  ┌──────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐
  │  MySQL 8.0   │    │  Redis 7.0   │    │  本地存储    │
  │             │    │             │    │             │
  │ • 用户数据   │    │ • Token存储  │    │ /uploads/   │
  │ • 商品数据   │    │ • 热点缓存   │    │ • 商品图片   │
  │ • 订单数据   │    │ • 会话管理   │    │ • 游记图片   │
  │ • 社区数据   │    │ • 分布式锁   │    │ • 视频文件   │
  │ • 日志数据   │    │ • 排行榜     │    │ • 用户头像   │
  └─────────────┘    └─────────────┘    └─────────────┘
```

### 1.2 模块职责划分

#### 1.2.1 前端模块划分

| 模块 | 职责 | 页面数 | 优先级 |
|------|------|-------|--------|
| **基础模块** | 用户注册登录、个人中心、地址管理 | 8 | P0 |
| **衣-商品模块** | 商品浏览、详情、购物车、下单 | 6 | P0 |
| **食-餐饮模块** | 餐厅列表、预订、农产品购买 | 5 | P1 |
| **住-住宿模块** | 民宿搜索、房态查询、预订 | 4 | P1 |
| **行-票务模块** | 景区门票、路线套餐购买 | 5 | P1 |
| **社区模块** | 游记发布、浏览、互动 | 6 | P2 |
| **订单模块** | 订单列表、详情、退款 | 3 | P0 |
| **支付模块** | 支付页面、支付结果 | 2 | P0 |

#### 1.2.2 后端服务划分

```
server/src/modules/
├── base/                      # Cool-Admin基础模块
│   ├── sys/                   # 系统管理（内置）
│   │   ├── user/              # 用户管理
│   │   ├── role/              # 角色管理
│   │   ├── menu/              # 菜单管理
│   │   ├── dept/              # 部门管理
│   │   └── log/               # 日志管理
│   ├── comm/                  # 公共服务（内置）
│   │   ├── upload/            # 文件上传
│   │   └── captcha/           # 验证码
│   └── custom/                # 自定义公共服务
│       ├── auth/              # 认证服务（JWT、微信登录）
│       ├── sms/               # 短信服务
│       └── payment/           # 支付服务
├── clothing/                  # 衣-商品模块
│   ├── entity/                # 实体定义
│   │   ├── category.ts        # 商品分类
│   │   ├── product.ts         # 商品
│   │   ├── sku.ts             # SKU
│   │   ├── review.ts          # 评价
│   │   └── favorite.ts        # 收藏
│   ├── service/               # 业务逻辑
│   │   ├── category.ts
│   │   ├── product.ts
│   │   └── review.ts
│   └── controller/            # 控制器
│       ├── admin/             # 管理后台接口
│       │   ├── category.ts
│       │   └── product.ts
│       └── app/               # 前台接口
│           ├── product.ts
│           └── review.ts
├── food/                      # 食-餐饮模块
│   ├── entity/
│   │   ├── restaurant.ts      # 餐厅
│   │   ├── dish.ts            # 菜品
│   │   ├── timeslot.ts        # 时段
│   │   ├── booking.ts         # 预订
│   │   └── agri_product.ts    # 农产品
│   ├── service/
│   └── controller/
├── accommodation/             # 住-住宿模块
│   ├── entity/
│   │   ├── homestay.ts        # 民宿
│   │   ├── room_type.ts       # 房型
│   │   ├── room_calendar.ts   # 房态
│   │   └── booking.ts         # 预订
│   ├── service/
│   └── controller/
├── travel/                    # 行-票务模块
│   ├── entity/
│   │   ├── scenic_spot.ts     # 景区
│   │   ├── ticket_type.ts     # 票种
│   │   ├── route_package.ts   # 路线
│   │   ├── e_ticket.ts        # 电子票
│   │   └── traffic_guide.ts   # 交通攻略
│   ├── service/
│   └── controller/
├── community/                 # 社区模块
│   ├── entity/
│   │   ├── post.ts            # 游记
│   │   ├── comment.ts         # 评论
│   │   ├── topic.ts           # 话题
│   │   ├── like.ts            # 点赞
│   │   └── follow.ts          # 关注
│   ├── service/
│   └── controller/
├── order/                     # 订单模块
│   ├── entity/
│   │   ├── order.ts           # 统一订单
│   │   ├── order_item.ts      # 订单明细
│   │   ├── logistics.ts       # 物流信息
│   │   └── refund.ts          # 退款申请
│   ├── service/
│   └── controller/
└── cart/                      # 购物车模块
    ├── entity/
    ├── service/
    └── controller/
```

### 1.3 三端架构

#### 1.3.1 uni-app 小程序端（游客主入口）

**定位：** 移动端主力入口，扫码即用，轻量便捷

**核心功能：**
- 首页：轮播图、金刚区、热门推荐
- 商品模块：浏览、搜索、加购、下单
- 餐饮模块：餐厅列表、餐位预订、农产品购买
- 住宿模块：民宿搜索、房态查询、在线预订
- 票务模块：景区门票、路线套餐购买
- 社区模块：游记发布、浏览、互动
- 个人中心：订单、收藏、评价、地址、设置

**技术实现：**
```javascript
// manifest.json - 小程序配置
{
  "name": "乌东文旅",
  "appid": "__UNI__XXXXXX",
  "mp-weixin": {
    "appid": "wx...",
    "setting": {
      "urlCheck": false
    },
    "usingComponents": true
  }
}

// pages.json - 页面配置
{
  "pages": [
    { "path": "pages/index/index", "style": { "navigationBarTitleText": "乌东文旅" }},
    { "path": "pages/product/list", "style": { "navigationBarTitleText": "非遗商品" }},
    { "path": "pages/product/detail", "style": { "navigationBarTitleText": "商品详情" }}
  ],
  "tabBar": {
    "list": [
      { "pagePath": "pages/index/index", "text": "首页", "iconPath": "static/tabbar/home.png" },
      { "pagePath": "pages/community/index", "text": "社区", "iconPath": "static/tabbar/community.png" },
      { "pagePath": "pages/cart/index", "text": "购物车", "iconPath": "static/tabbar/cart.png" },
      { "pagePath": "pages/user/index", "text": "我的", "iconPath": "static/tabbar/user.png" }
    ]
  }
}
```

#### 1.3.2 PC Web 端（桌面浏览器）

**定位：** 桌面端浏览体验，展示更丰富，适合大屏

**技术方案：**
- 方案A：uni-app H5编译（代码复用，快速开发）✅ 推荐
- 方案B：独立Vue3项目（更好的SEO，自定义度高）

**响应式布局：**
```scss
// 断点设计
$breakpoints: (
  mobile: 0,
  tablet: 768px,
  desktop: 1024px,
  wide: 1440px
);

// 首页布局示例
.home-container {
  @media (max-width: 768px) {
    // 移动端：单列布局
    .product-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    // 平板：3列布局
    .product-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (min-width: 1024px) {
    // 桌面：4列布局
    .product-grid { grid-template-columns: repeat(4, 1fr); }
  }
}
```

#### 1.3.3 管理后台（商家 + 平台管理员）

**定位：** 商家管理自家店铺，平台管理员管理全局

**技术实现：** 基于 Cool-Admin Vue（Vue3 + Element Plus）

**功能模块：**

```
管理后台架构
├── 商家端
│   ├── 工作台                # 数据概览
│   ├── 商品管理（衣）         # 分类、商品、库存、评价
│   ├── 餐饮管理（食）         # 餐厅、菜品、时段、预订
│   ├── 住宿管理（住）         # 民宿、房型、房态、预订
│   ├── 票务管理（行）         # 景区、票种、路线、核销
│   ├── 订单管理              # 订单列表、详情、退款
│   ├── 数据统计              # 销售额、订单量、热销商品
│   └── 店铺设置              # 基本信息、营业时间
└── 平台端
    ├── 数据看板              # GMV、DAU、订单数、用户增长
    ├── 用户管理              # 用户列表、封禁、详情
    ├── 商家管理              # 入驻审核、商家列表、禁用
    ├── 内容审核              # 游记审核、评论审核、举报处理
    ├── 订单管理（全局）       # 跨模块订单查询、异常订单
    ├── 财务结算              # 结算列表、对账、报表
    ├── 运营配置              # 轮播图、公告、推荐位
    ├── 系统设置              # 角色权限、菜单、敏感词、抽佣比例
    └── 日志管理              # 操作日志、登录日志
```

**Cool-Admin 核心优势：**
- **零代码CRUD**：通过装饰器自动生成增删改查接口
- **权限系统**：基于RBAC的菜单权限、按钮权限
- **自动表单**：基于Entity自动生成表单
- **Excel导入导出**：内置Excel操作
- **任务调度**：分布式任务调度（定时任务、延时队列）

---

## 2. 技术选型与说明

### 2.1 核心技术栈

#### 2.1.1 技术栈总览

| 层级 | 技术 | 版本 | 选型理由 |
|------|------|------|---------|
| **前端框架（小程序+H5）** | uni-app | 3.x | 一次开发，编译多端（小程序/H5/App），减少50%开发成本 |
| **前端框架（管理后台）** | Vue 3 | 3.4+ | Composition API，性能提升，生态成熟 |
| **UI组件库（管理后台）** | Element Plus | 2.x | Vue3官方推荐，组件丰富，开箱即用 |
| **状态管理** | Pinia | 2.x | Vue3官方推荐，替代Vuex，API更简洁 |
| **后端框架** | Midway.js | 3.x | 企业级Node.js框架，IoC容器，装饰器支持，TypeScript原生 |
| **快速开发框架** | Cool-Admin | 7.x | 基于Midway的快速开发框架，内置CRUD、权限、上传、任务 |
| **ORM框架** | TypeORM | 0.3.x | TypeScript原生支持，装饰器定义实体，Active Record模式 |
| **数据库** | MySQL | 8.0+ | 关系型数据库，事务支持，JSON字段支持 |
| **缓存** | Redis | 7.0+ | 高性能缓存，支持多种数据结构，分布式锁 |
| **Web服务器** | Nginx | 1.24+ | 反向代理、静态资源、负载均衡、SSL卸载 |
| **进程管理** | PM2 | 5.x | Node.js进程守护，集群模式，日志管理，零停机重启 |
| **包管理** | pnpm | 8.x | 快速、节省磁盘空间、monorepo支持 |
| **代码规范** | ESLint + Prettier | 最新 | 统一代码风格，减少code review成本 |
| **Git Hook** | husky + lint-staged | 最新 | 提交前代码检查，保证代码质量 |

#### 2.1.2 技术栈选型对比

**为什么选择 Cool-Admin 而不是其他框架？**

| 框架 | 优势 | 劣势 | 适用场景 |
|------|-----|------|---------|
| **Cool-Admin** ✅ | • CRUD零代码生成<br>• 内置权限系统<br>• 完整的管理后台模板<br>• TypeScript支持 | • 社区较小<br>• 文档相对简单 | **中小型管理系统**<br>快速交付 |
| Nest.js | • 社区活跃<br>• 文档完善<br>• 大量插件 | • 需要自己搭建CRUD<br>• 学习曲线陡峭 | 大型企业应用 |
| Egg.js | • 阿里出品<br>• 稳定性强 | • 不支持装饰器<br>• 不支持TypeScript原生 | 传统Web应用 |

**为什么选择 uni-app 而不是原生小程序？**

| 方案 | 开发成本 | 性能 | 代码复用 | 学习曲线 |
|------|---------|------|---------|---------|
| **uni-app** ✅ | 低（一套代码） | 中等 | 90% | 平缓（Vue语法） |
| 原生小程序 | 高（多套代码） | 最优 | 0% | 陡峭（独立语法） |
| Taro | 低（一套代码） | 中等 | 85% | 陡峭（React语法） |

**结论：** 对于学生团队，Cool-Admin + uni-app 可以大幅降低开发难度，缩短交付周期，是性价比最高的选择。

### 2.2 Cool-Admin 核心能力

#### 2.2.1 零代码CRUD

**传统方式：**
```typescript
// 需要手写的代码（约200行）
@Controller('/api/product')
export class ProductController {
  @Inject()
  productService: ProductService
  
  @Post('/add')
  async add(@Body() dto: AddProductDto) {
    // 参数校验
    // 业务逻辑
    // 返回结果
  }
  
  @Get('/list')
  async list(@Query() query) {
    // 分页查询
    // 数据组装
    // 返回结果
  }
  
  // ... 还需要写 update/delete/info/page 等方法
}
```

**Cool-Admin方式：**
```typescript
// 只需5行代码
import { CoolController, BaseController } from '@cool-midway/core'
import { Product } from '../entity/product'

@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: Product,
  pageQueryOp: {
    keyWordLikeFields: ['title'], // 关键词搜索字段
    where: async (ctx) => {       // 动态查询条件
      return { status: 'on_sale' }
    }
  }
})
export class AdminProductController extends BaseController {}
```

**自动生成的6个接口：**
- `POST /api/admin/product/add` - 新增商品
- `POST /api/admin/product/delete` - 删除商品（支持批量）
- `POST /api/admin/product/update` - 更新商品
- `GET /api/admin/product/info` - 商品详情
- `GET /api/admin/product/list` - 商品列表（不分页）
- `POST /api/admin/product/page` - 商品分页列表

#### 2.2.2 权限系统

**基于RBAC模型：**
```typescript
// 1. 定义实体时设置权限标识
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: Product,
  rolesInfo: [
    { label: '商品列表', value: 'list' },
    { label: '商品详情', value: 'info' },
    { label: '新增商品', value: 'add' },
    { label: '修改商品', value: 'update' },
    { label: '删除商品', value: 'delete' }
  ]
})

// 2. 使用装饰器控制权限
@Get('/export')
@CoolUrlTag({ key: 'export', label: '导出商品' })
async export() {
  // 只有拥有 'export' 权限的用户才能访问
}
```

**前端权限控制：**
```vue
<template>
  <!-- 按钮级权限控制 -->
  <el-button v-hasPermi="['product:add']">新增商品</el-button>
  <el-button v-hasPermi="['product:delete']">删除商品</el-button>
</template>
```

#### 2.2.3 文件上传

```typescript
// 后端：使用内置上传服务
import { CoolFile } from '@cool-midway/file'

@Post('/upload')
async upload(@CoolFile() file) {
  // 自动保存到 /uploads 目录
  // 返回访问URL
  return file.url
}

// 支持的配置
{
  upload: {
    mode: 'local',  // local/oss/qiniu/cos
    fileSize: '10mb',
    whitelist: ['jpg', 'png', 'jpeg', 'gif', 'webp']
  }
}
```

#### 2.2.4 任务调度

```typescript
// 定时任务
import { CoolTask } from '@cool-midway/task'

@CoolTask('0 0 2 * * *')  // 每天凌晨2点执行
async cleanExpiredOrders() {
  // 清理过期订单
}

// 延时队列
import { CoolQueue } from '@cool-midway/task'

@CoolQueue()
async sendOrderNotification(orderId: string) {
  // 发送订单通知（异步执行）
}

// 调用方式
await this.coolQueue.add('sendOrderNotification', { orderId: '123' }, {
  delay: 5000  // 延迟5秒执行
})
```

### 2.3 开发工具

| 工具 | 用途 | 版本 |
|-----|------|------|
| **Visual Studio Code** | 代码编辑器 | 最新 |
| **微信开发者工具** | 小程序调试 | 最新 |
| **Chrome DevTools** | 浏览器调试 | 最新 |
| **Navicat / DBeaver** | 数据库管理 | 最新 |
| **Redis Desktop Manager** | Redis管理 | 最新 |
| **Postman / Apifox** | 接口测试 | 最新 |
| **Git** | 版本控制 | 2.40+ |

**VSCode推荐插件：**
- Vue - Official (Vue3语法高亮)
- TypeScript Vue Plugin
- ESLint
- Prettier
- GitLens
- Auto Rename Tag
- Path Intellisense

---

## 3. 项目目录结构

### 3.1 后端项目结构（基于Cool-Admin）

```
wudong-tourist-server/
├── src/
│   ├── config/                    # 配置文件
│   │   ├── config.default.ts      # 默认配置
│   │   ├── config.local.ts        # 本地开发配置
│   │   └── config.prod.ts         # 生产环境配置
│   ├── modules/
│   │   ├── base/                  # 基础模块（Cool-Admin内置）
│   │   │   ├── sys/               # 系统管理
│   │   │   │   ├── entity/
│   │   │   │   │   ├── user.ts    # 用户实体
│   │   │   │   │   ├── role.ts    # 角色实体
│   │   │   │   │   ├── menu.ts    # 菜单实体
│   │   │   │   │   └── dept.ts    # 部门实体
│   │   │   │   ├── service/
│   │   │   │   └── controller/
│   │   │   ├── comm/              # 公共服务
│   │   │   │   ├── upload/        # 文件上传
│   │   │   │   └── captcha/       # 验证码
│   │   │   └── custom/            # 自定义公共服务
│   │   │       ├── auth/          # JWT认证、微信登录
│   │   │       ├── sms/           # 短信服务
│   │   │       └── payment/       # 支付服务
│   │   ├── clothing/              # 衣-商品模块
│   │   │   ├── entity/
│   │   │   │   ├── category.ts    # 商品分类
│   │   │   │   ├── product.ts     # 商品
│   │   │   │   ├── sku.ts         # SKU
│   │   │   │   ├── image.ts       # 商品图片
│   │   │   │   ├── favorite.ts    # 收藏
│   │   │   │   └── review.ts      # 评价
│   │   │   ├── service/
│   │   │   │   ├── category.ts    # 分类服务
│   │   │   │   ├── product.ts     # 商品服务
│   │   │   │   └── review.ts      # 评价服务
│   │   │   └── controller/
│   │   │       ├── admin/         # 管理后台接口
│   │   │       │   ├── category.ts
│   │   │       │   ├── product.ts
│   │   │       │   └── review.ts
│   │   │       └── app/           # 前台接口
│   │   │           ├── product.ts
│   │   │           └── favorite.ts
│   │   ├── food/                  # 食-餐饮模块
│   │   ├── accommodation/         # 住-住宿模块
│   │   ├── travel/                # 行-票务模块
│   │   ├── community/             # 社区模块
│   │   ├── order/                 # 订单模块
│   │   └── cart/                  # 购物车模块
│   ├── decorator/                 # 自定义装饰器
│   ├── middleware/                # 中间件
│   └── configuration.ts           # 应用配置
├── .env                           # 环境变量
├── bootstrap.js                   # 启动文件
├── package.json
├── tsconfig.json
└── README.md
```

**关键文件说明：**

**1. Entity定义示例**
```typescript
// src/modules/clothing/entity/product.ts
import { Entity, Column } from 'typeorm'
import { BaseEntity } from '@cool-midway/core'

@Entity('products')
export class ProductEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: '商品标题' })
  title: string
  
  @Column({ type: 'decimal', precision: 10, scale: 2, comment: '价格' })
  price: number
  
  @Column({ type: 'int', default: 0, comment: '库存' })
  stock: number
  
  @Column({ type: 'int', default: 0, comment: '销量' })
  sales: number
  
  @Column({ type: 'varchar', length: 20, default: 'on_sale', comment: '状态' })
  status: string
}
```

**2. Service服务示例**
```typescript
// src/modules/clothing/service/product.ts
import { Provide, Inject } from '@midwayjs/decorator'
import { BaseService } from '@cool-midway/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { ProductEntity } from '../entity/product'

@Provide()
export class ProductService extends BaseService {
  @InjectEntityModel(ProductEntity)
  productEntity: Repository<ProductEntity>
  
  // 自定义业务方法
  async getHotProducts(limit: number = 10) {
    return await this.productEntity.find({
      where: { status: 'on_sale' },
      order: { sales: 'DESC' },
      take: limit
    })
  }
}
```

**3. Controller控制器示例**
```typescript
// src/modules/clothing/controller/admin/product.ts
import { Provide } from '@midwayjs/decorator'
import { CoolController, BaseController } from '@cool-midway/core'
import { ProductEntity } from '../../entity/product'
import { ProductService } from '../../service/product'

@Provide()
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ProductEntity,
  service: ProductService,
  pageQueryOp: {
    keyWordLikeFields: ['title'],
    where: async (ctx, query) => {
      const { category_id, status } = query
      const where: any = {}
      if (category_id) where.category_id = category_id
      if (status) where.status = status
      return where
    }
  }
})
export class AdminProductController extends BaseController {
  @Inject()
  productService: ProductService
  
  // 自定义接口
  @Get('/hot')
  async getHotProducts() {
    const data = await this.productService.getHotProducts()
    return this.ok(data)
  }
}
```

### 3.2 前端项目结构

#### 3.2.1 uni-app 小程序项目

```
wudong-tourist-uniapp/
├── pages/                         # 页面
│   ├── index/                     # 首页
│   │   └── index.vue
│   ├── product/                   # 商品模块
│   │   ├── list.vue               # 商品列表
│   │   ├── detail.vue             # 商品详情
│   │   ├── search.vue             # 搜索页面
│   │   └── review-list.vue        # 评价列表
│   ├── restaurant/                # 餐饮模块
│   │   ├── list.vue
│   │   ├── detail.vue
│   │   └── booking.vue
│   ├── agri-product/              # 农产品
│   │   ├── list.vue
│   │   └── detail.vue
│   ├── homestay/                  # 住宿模块
│   │   ├── list.vue
│   │   ├── detail.vue
│   │   └── booking.vue
│   ├── ticket/                    # 票务模块
│   │   ├── scenic-list.vue
│   │   ├── scenic-detail.vue
│   │   ├── route-list.vue
│   │   ├── route-detail.vue
│   │   └── traffic-guide.vue
│   ├── community/                 # 社区模块
│   │   ├── index.vue              # 信息流
│   │   ├── post-detail.vue        # 游记详情
│   │   ├── publish.vue            # 发布游记
│   │   ├── topic-detail.vue       # 话题详情
│   │   └── user-profile.vue       # 用户主页
│   ├── cart/                      # 购物车
│   │   └── index.vue
│   ├── order/                     # 订单
│   │   ├── confirm.vue            # 确认订单
│   │   ├── list.vue               # 订单列表
│   │   ├── detail.vue             # 订单详情
│   │   ├── refund.vue             # 申请退款
│   │   └── e-ticket.vue           # 我的电子票
│   ├── user/                      # 个人中心
│   │   ├── index.vue              # 个人中心首页
│   │   ├── login.vue              # 登录注册
│   │   ├── profile.vue            # 个人资料
│   │   ├── address.vue            # 收货地址
│   │   ├── favorites.vue          # 我的收藏
│   │   ├── reviews.vue            # 我的评价
│   │   ├── messages.vue           # 消息中心
│   │   └── settings.vue           # 设置
│   └── webview/                   # Webview页面
│       └── index.vue
├── components/                    # 公共组件
│   ├── ProductCard/               # 商品卡片
│   │   └── index.vue
│   ├── RestaurantCard/            # 餐厅卡片
│   │   └── index.vue
│   ├── HomestayCard/              # 民宿卡片
│   │   └── index.vue
│   ├── PostCard/                  # 游记卡片
│   │   └── index.vue
│   ├── ImageUploader/             # 图片上传
│   │   └── index.vue
│   ├── VideoPlayer/               # 视频播放
│   │   └── index.vue
│   ├── StarRating/                # 星级评分
│   │   └── index.vue
│   ├── Calendar/                  # 日历组件
│   │   └── index.vue
│   ├── TabBar/                    # 自定义TabBar
│   │   └── index.vue
│   └── LoadMore/                  # 加载更多
│       └── index.vue
├── api/                           # API封装
│   ├── index.ts                   # API统一导出
│   ├── request.ts                 # 请求封装
│   ├── user.ts                    # 用户接口
│   ├── product.ts                 # 商品接口
│   ├── restaurant.ts              # 餐饮接口
│   ├── homestay.ts                # 住宿接口
│   ├── ticket.ts                  # 票务接口
│   ├── community.ts               # 社区接口
│   ├── order.ts                   # 订单接口
│   ├── cart.ts                    # 购物车接口
│   └── upload.ts                  # 上传接口
├── store/                         # 状态管理（Pinia）
│   ├── index.ts                   # Store入口
│   └── modules/
│       ├── user.ts                # 用户状态
│       ├── cart.ts                # 购物车状态
│       └── app.ts                 # 应用状态
├── utils/                         # 工具函数
│   ├── request.ts                 # 请求工具
│   ├── auth.ts                    # 认证工具
│   ├── storage.ts                 # 本地存储
│   ├── validate.ts                # 表单验证
│   ├── date.ts                    # 日期处理
│   └── common.ts                  # 通用工具
├── static/                        # 静态资源
│   ├── images/                    # 图片
│   ├── icons/                     # 图标
│   └── tabbar/                    # TabBar图标
├── uni_modules/                   # uni-app插件
├── uni.scss                       # 全局样式变量
├── App.vue                        # 应用入口
├── main.ts                        # 入口文件
├── manifest.json                  # 应用配置
├── pages.json                     # 页面配置
├── package.json
├── tsconfig.json
└── README.md
```

#### 3.2.2 PC Web 端项目（Vue3 + Vite）

```
wudong-tourist-web/
├── src/
│   ├── views/                     # 页面视图
│   │   ├── home/                  # 首页
│   │   ├── product/               # 商品
│   │   ├── restaurant/            # 餐饮
│   │   ├── homestay/              # 住宿
│   │   ├── ticket/                # 票务
│   │   ├── community/             # 社区
│   │   ├── cart/                  # 购物车
│   │   ├── order/                 # 订单
│   │   └── user/                  # 用户中心
│   ├── components/                # 公共组件
│   ├── api/                       # API接口
│   ├── store/                     # 状态管理
│   ├── router/                    # 路由配置
│   ├── utils/                     # 工具函数
│   ├── assets/                    # 静态资源
│   ├── styles/                    # 全局样式
│   ├── App.vue
│   └── main.ts
├── public/                        # 公共资源
├── index.html
├── vite.config.ts
├── package.json
└── tsconfig.json
```

#### 3.2.3 管理后台项目（基于Cool-Admin Vue）

```
wudong-tourist-admin/
├── src/
│   ├── modules/                   # 业务模块
│   │   ├── base/                  # 基础模块（Cool-Admin内置）
│   │   │   ├── views/             # 页面
│   │   │   │   ├── user/          # 用户管理
│   │   │   │   ├── role/          # 角色管理
│   │   │   │   ├── menu/          # 菜单管理
│   │   │   │   └── log/           # 日志管理
│   │   │   └── config.ts          # 模块配置
│   │   ├── product/               # 商品管理（衣）
│   │   │   ├── views/
│   │   │   │   ├── category.vue   # 分类管理
│   │   │   │   ├── product.vue    # 商品列表
│   │   │   │   ├── review.vue     # 评价管理
│   │   │   │   └── stock.vue      # 库存管理
│   │   │   └── config.ts
│   │   ├── restaurant/            # 餐饮管理（食）
│   │   ├── homestay/              # 住宿管理（住）
│   │   ├── ticket/                # 票务管理（行）
│   │   ├── community/             # 社区管理
│   │   ├── order/                 # 订单管理
│   │   ├── merchant/              # 商家管理
│   │   └── dashboard/             # 数据看板
│   ├── components/                # 公共组件
│   ├── config/                    # 配置文件
│   ├── utils/                     # 工具函数
│   ├── App.vue
│   └── main.ts
├── public/
├── index.html
├── vite.config.ts
├── package.json
└── README.md
```

**Cool-Admin模块配置示例：**
```typescript
// src/modules/product/config.ts
import { ModuleConfig } from '/@/cool'

export default (): ModuleConfig => {
  return {
    order: 1,
    label: '商品管理',
    description: '商品分类、商品管理、库存管理、评价管理',
    views: [
      {
        path: '/product/category',
        meta: { label: '商品分类' },
        component: () => import('./views/category.vue')
      },
      {
        path: '/product/list',
        meta: { label: '商品列表' },
        component: () => import('./views/product.vue')
      }
    ]
  }
}
```

---

## 4. 数据库设计

### 4.1 设计原则

#### 4.1.1 命名规范

**表名规范：**
- 全小写，下划线分隔
- 使用复数形式：`users`, `products`, `orders`
- 模块前缀（可选）：`product_`, `order_`

**字段名规范：**
- 全小写，下划线分隔
- 见名知意：`user_id`, `created_at`
- 布尔字段：`is_` 前缀，如 `is_default`

**索引命名：**
- 普通索引：`idx_` + 字段名，如 `idx_user_id`
- 唯一索引：`uk_` + 字段名，如 `uk_phone`
- 联合索引：`idx_` + 字段1_字段2，如 `idx_user_type`

#### 4.1.2 字段规范

**主键：**
```sql
`id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID'
```

**时间字段：**
```sql
`created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
`updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
`deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间（软删除）'
```

**金额字段：**
```sql
`price` DECIMAL(10,2) NOT NULL COMMENT '价格（单位：元）'
```

**枚举字段：**
```sql
-- 不使用MySQL的ENUM类型，使用VARCHAR
`status` VARCHAR(20) DEFAULT 'active' COMMENT '状态: active/inactive'
`order_type` VARCHAR(20) NOT NULL COMMENT '订单类型: product/restaurant/homestay'
```

**JSON字段：**
```sql
`images` JSON DEFAULT NULL COMMENT '图片数组 ["url1", "url2"]'
`attrs` JSON DEFAULT NULL COMMENT '属性JSON {"color": "red", "size": "L"}'
```

#### 4.1.3 索引设计原则

1. **高频查询字段建索引**
   - `user_id`, `status`, `created_at`
   
2. **联合索引遵循最左前缀原则**
   ```sql
   KEY `idx_user_status_time` (`user_id`, `status`, `created_at`)
   -- 可以用于：
   -- WHERE user_id = ?
   -- WHERE user_id = ? AND status = ?
   -- WHERE user_id = ? AND status = ? AND created_at > ?
   ```

3. **避免冗余索引**
   ```sql
   -- 错误示例
   KEY `idx_user_id` (`user_id`)
   KEY `idx_user_status` (`user_id`, `status`)  -- 冗余了
   ```

4. **全文索引用于搜索**
   ```sql
   FULLTEXT KEY `ft_title_content` (`title`, `content`)
   ```

### 4.2 公共基础模块表设计

#### 4.2.1 用户表 (users)

```sql
CREATE TABLE `users` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  `phone` VARCHAR(11) DEFAULT NULL COMMENT '手机号',
  `password` VARCHAR(255) DEFAULT NULL COMMENT '密码（bcrypt加密）',
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
```

**字段说明：**
- `password`: bcrypt加密，salt轮次10
- `role`: 用户角色，支持多角色扩展
- `openid/unionid`: 微信登录相关
- `deleted_at`: 软删除标记

#### 4.2.2 角色表 (roles)

```sql
CREATE TABLE `roles` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL COMMENT '角色名称',
  `code` VARCHAR(50) NOT NULL COMMENT '角色编码',
  `description` VARCHAR(255) DEFAULT '' COMMENT '角色描述',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';
```

#### 4.2.3 菜单表 (menus)

```sql
CREATE TABLE `menus` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `parent_id` BIGINT DEFAULT 0 COMMENT '父菜单ID，0为顶级',
  `type` TINYINT NOT NULL COMMENT '类型 0:目录 1:菜单 2:按钮',
  `name` VARCHAR(50) NOT NULL COMMENT '菜单名称',
  `path` VARCHAR(255) DEFAULT '' COMMENT '路由路径',
  `component` VARCHAR(255) DEFAULT '' COMMENT '组件路径',
  `perms` VARCHAR(100) DEFAULT '' COMMENT '权限标识',
  `icon` VARCHAR(50) DEFAULT '' COMMENT '图标',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `is_show` TINYINT DEFAULT 1 COMMENT '是否显示',
  `status` VARCHAR(20) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单表';
```

#### 4.2.4 角色菜单关联表 (role_menus)

```sql
CREATE TABLE `role_menus` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `role_id` BIGINT NOT NULL,
  `menu_id` BIGINT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY `uk_role_menu` (`role_id`, `menu_id`),
  KEY `idx_menu_id` (`menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';
```

#### 4.2.5 收货地址表 (user_addresses)

```sql
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
```

#### 4.2.6 商家入驻申请表 (merchant_applications)

```sql
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

### 4.3 业务模块表设计

由于篇幅限制，业务模块表设计请参考之前生成的文档：
`D:\Desktop\wudong-tourist-platform\docs\superpowers\specs\2026-09-08-wudong-tourist-platform-design.md`

包含以下模块的完整表设计：
- 4.3.1 商品模块（衣）- 6张表
- 4.3.2 餐饮模块（食）- 8张表
- 4.3.3 住宿模块（住）- 5张表
- 4.3.4 票务模块（行）- 7张表
- 4.3.5 社区模块 - 9张表
- 4.3.6 订单模块 - 5张表
- 4.3.7 购物车模块 - 1张表
- 4.3.8 系统管理模块 - 5张表

**数据库初始化SQL脚本位置：**
`server/database/init.sql`

---

## 5. API接口设计

### 5.1 接口规范

#### 5.1.1 Base URL

```
开发环境: http://localhost:7001
生产环境: https://api.wudong-tourist.com
```

#### 5.1.2 请求头

```http
Content-Type: application/json
Authorization: Bearer <token>  // 需要登录的接口
```

#### 5.1.3 统一响应格式

**成功响应：**
```json
{
  "code": 1000,
  "message": "success",
  "data": { ... }
}
```

**失败响应：**
```json
{
  "code": 1001,
  "message": "参数错误",
  "data": null
}
```

**分页响应：**
```json
{
  "code": 1000,
  "message": "success",
  "data": {
    "list": [...],
    "pagination": {
      "page": 1,
      "size": 10,
      "total": 100
    }
  }
}
```

#### 5.1.4 状态码定义

| code | 含义 | HTTP状态码 |
|------|------|-----------|
| 1000 | 成功 | 200 |
| 1001 | 参数错误 | 400 |
| 1002 | 未登录 | 401 |
| 1003 | 无权限 | 403 |
| 1004 | 资源不存在 | 404 |
| 1005 | 业务错误 | 200 |
| 1006 | 服务器错误 | 500 |

### 5.2 核心接口列表

#### 5.2.1 用户模块 `/api/app/user`

| 接口 | 方法 | 路径 | 说明 | 鉴权 |
|------|-----|------|------|-----|
| 注册 | POST | `/register` | 手机号注册 | 否 |
| 登录 | POST | `/login` | 手机号密码/验证码登录 | 否 |
| 微信登录 | POST | `/wechat-login` | 微信授权登录 | 否 |
| 发送验证码 | POST | `/send-code` | 发送短信验证码 | 否 |
| 获取个人信息 | GET | `/info` | 获取当前用户信息 | 是 |
| 更新个人信息 | PUT | `/info` | 更新个人信息 | 是 |
| 退出登录 | POST | `/logout` | 退出登录 | 是 |

**接口详细文档参考之前生成的文档第4章节。**

---

### 5.3 Swagger API 文档集成

#### 5.3.1 为什么需要 Swagger？

**痛点：**
- 前后端联调时口头沟通效率低
- 接口文档手写容易过时
- 测试接口需要手动构造请求
- 新成员上手需要大量文档

**Swagger 优势：**
- **自动生成文档**：基于代码注解自动生成API文档
- **在线调试**：直接在浏览器中测试接口
- **类型定义**：清晰的请求/响应结构
- **权限测试**：支持JWT Token认证测试
- **多环境切换**：开发/测试/生产环境一键切换

#### 5.3.2 Midway.js Swagger 集成

**安装依赖：**

```bash
pnpm add @midwayjs/swagger@3 swagger-ui-dist
```

**配置 Swagger：**

```typescript
// src/configuration.ts
import { Configuration, App } from '@midwayjs/decorator'
import * as swagger from '@midwayjs/swagger'
import { ILifeCycle } from '@midwayjs/core'
import { Application } from '@midwayjs/koa'

@Configuration({
  imports: [
    swagger,  // 导入 Swagger
    // ... 其他模块
  ],
  importConfigs: [
    {
      default: {
        // Swagger 配置
        swagger: {
          title: '乌东文旅平台 API',
          description: '衣食住行综合服务平台 RESTful API 文档',
          version: '1.0.0',
          contact: {
            name: '开发团队',
            email: 'dev@wudong-tourist.com'
          },
          license: {
            name: 'MIT'
          },
          // 认证配置
          auth: {
            authType: 'bearer',
            securityName: 'Authorization'
          },
          // 标签分组
          tagSortable: true,
          // 访问路径
          swaggerPath: '/swagger-ui'
        }
      }
    }
  ]
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: Application
  
  async onReady() {
    // Swagger 文档访问地址
    console.log('📚 Swagger 文档地址: http://localhost:7001/swagger-ui/index.html')
  }
}
```

**环境配置：**

```typescript
// src/config/config.local.ts - 开发环境开启 Swagger
export default {
  swagger: {
    enable: true  // 开发环境开启
  }
}

// src/config/config.prod.ts - 生产环境关闭 Swagger
export default {
  swagger: {
    enable: false  // 生产环境关闭，避免API泄露
  }
}
```

#### 5.3.3 使用装饰器定义 API 文档

**基础示例：商品接口**

```typescript
// src/modules/clothing/controller/app/product.ts
import { Controller, Get, Post, Query, Body, Inject } from '@midwayjs/decorator'
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiBody,
  ApiBearerAuth
} from '@midwayjs/swagger'
import { ProductService } from '../../service/product'

@ApiTags('商品模块')  // 标签分组
@Controller('/api/app/product')
export class AppProductController {
  @Inject()
  productService: ProductService
  
  @Get('/list')
  @ApiOperation({ summary: '商品列表', description: '分页查询商品列表' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: '页码', example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: '每页数量', example: 10 })
  @ApiQuery({ name: 'category_id', required: false, type: Number, description: '分类ID' })
  @ApiQuery({ name: 'keyword', required: false, type: String, description: '搜索关键词' })
  @ApiQuery({ name: 'sort', required: false, type: String, description: '排序方式: sales/price/time', example: 'sales' })
  @ApiResponse({ status: 200, description: '成功', schema: {
    type: 'object',
    properties: {
      code: { type: 'number', example: 1000 },
      message: { type: 'string', example: 'success' },
      data: {
        type: 'object',
        properties: {
          list: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                title: { type: 'string', example: '苗族手工银饰手镯' },
                main_image: { type: 'string', example: 'https://...' },
                price: { type: 'number', example: 298.00 },
                sales: { type: 'number', example: 156 },
                rating: { type: 'number', example: 4.8 }
              }
            }
          },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'number', example: 1 },
              pageSize: { type: 'number', example: 10 },
              total: { type: 'number', example: 100 }
            }
          }
        }
      }
    }
  }})
  async list(@Query() query) {
    return await this.productService.getList(query)
  }
  
  @Get('/:id')
  @ApiOperation({ summary: '商品详情' })
  @ApiResponse({ status: 200, description: '成功' })
  @ApiResponse({ status: 404, description: '商品不存在' })
  async info(@Query('id') id: number) {
    return await this.productService.getDetail(id)
  }
  
  @Post('/favorite')
  @ApiBearerAuth()  // 需要JWT认证
  @ApiOperation({ summary: '收藏/取消收藏商品' })
  @ApiBody({
    description: '请求体',
    schema: {
      type: 'object',
      required: ['product_id'],
      properties: {
        product_id: { type: 'number', example: 1, description: '商品ID' }
      }
    }
  })
  @ApiResponse({ status: 200, description: '操作成功' })
  @ApiResponse({ status: 401, description: '未登录' })
  async toggleFavorite(@Body() body: { product_id: number }) {
    return await this.productService.toggleFavorite(this.ctx.userId, body.product_id)
  }
}
```

**使用 DTO 定义类型：**

```typescript
// src/modules/clothing/dto/product.dto.ts
import { Rule, RuleType } from '@midwayjs/validate'
import { ApiProperty } from '@midwayjs/swagger'

export class AddProductDto {
  @ApiProperty({ description: '商品标题', example: '苗族手工银饰手镯' })
  @Rule(RuleType.string().required())
  title: string
  
  @ApiProperty({ description: '商品分类ID', example: 1 })
  @Rule(RuleType.number().required())
  category_id: number
  
  @ApiProperty({ description: '商品价格', example: 298.00 })
  @Rule(RuleType.number().min(0.01).required())
  price: number
  
  @ApiProperty({ description: '库存', example: 100 })
  @Rule(RuleType.number().integer().min(0).required())
  stock: number
  
  @ApiProperty({ description: '商品主图', example: 'https://...' })
  @Rule(RuleType.string().uri().required())
  main_image: string
  
  @ApiProperty({ description: '商品详情（富文本）', required: false })
  @Rule(RuleType.string().optional())
  detail?: string
}

export class UpdateProductDto {
  @ApiProperty({ description: '商品ID', example: 1 })
  @Rule(RuleType.number().required())
  id: number
  
  @ApiProperty({ description: '商品标题', required: false })
  @Rule(RuleType.string().optional())
  title?: string
  
  @ApiProperty({ description: '商品价格', required: false })
  @Rule(RuleType.number().min(0.01).optional())
  price?: number
  
  @ApiProperty({ description: '库存', required: false })
  @Rule(RuleType.number().integer().min(0).optional())
  stock?: number
}

export class ProductListQueryDto {
  @ApiProperty({ description: '页码', required: false, default: 1 })
  @Rule(RuleType.number().integer().min(1).optional())
  page?: number = 1
  
  @ApiProperty({ description: '每页数量', required: false, default: 10 })
  @Rule(RuleType.number().integer().min(1).max(100).optional())
  pageSize?: number = 10
  
  @ApiProperty({ description: '分类ID', required: false })
  @Rule(RuleType.number().optional())
  category_id?: number
  
  @ApiProperty({ description: '搜索关键词', required: false })
  @Rule(RuleType.string().optional())
  keyword?: string
  
  @ApiProperty({ description: '排序方式', enum: ['sales', 'price', 'time'], required: false })
  @Rule(RuleType.string().valid('sales', 'price', 'time').optional())
  sort?: string
}
```

**在 Controller 中使用 DTO：**

```typescript
@Controller('/api/admin/product')
@ApiTags('商品管理（管理后台）')
export class AdminProductController {
  @Post('/add')
  @ApiBearerAuth()
  @ApiOperation({ summary: '新增商品' })
  @ApiBody({ type: AddProductDto })
  @ApiResponse({ status: 200, description: '添加成功' })
  async add(@Body() dto: AddProductDto) {
    return await this.productService.add(dto)
  }
  
  @Put('/update')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新商品' })
  @ApiBody({ type: UpdateProductDto })
  async update(@Body() dto: UpdateProductDto) {
    return await this.productService.update(dto.id, dto)
  }
  
  @Get('/list')
  @ApiBearerAuth()
  @ApiOperation({ summary: '商品列表（分页）' })
  async list(@Query() query: ProductListQueryDto) {
    return await this.productService.page(query)
  }
}
```

#### 5.3.4 标签分组策略

**按模块分组：**

```typescript
// 前台接口
@ApiTags('商品模块')  // C端用户接口
@Controller('/api/app/product')

@ApiTags('餐饮模块')
@Controller('/api/app/restaurant')

@ApiTags('住宿模块')
@Controller('/api/app/homestay')

@ApiTags('票务模块')
@Controller('/api/app/ticket')

@ApiTags('社区模块')
@Controller('/api/app/community')

// 管理后台接口
@ApiTags('商品管理（管理后台）')
@Controller('/api/admin/product')

@ApiTags('订单管理（管理后台）')
@Controller('/api/admin/order')

// 平台管理接口
@ApiTags('用户管理（平台）')
@Controller('/api/platform/user')

@ApiTags('数据看板（平台）')
@Controller('/api/platform/dashboard')
```

**标签顺序配置：**

```typescript
// src/configuration.ts
swagger: {
  // ... 其他配置
  tags: [
    { name: '用户模块', description: '用户注册、登录、个人中心' },
    { name: '商品模块', description: '商品浏览、搜索、收藏、评价' },
    { name: '餐饮模块', description: '餐厅列表、餐位预订、农产品购买' },
    { name: '住宿模块', description: '民宿搜索、房态查询、在线预订' },
    { name: '票务模块', description: '景区门票、路线套餐购买' },
    { name: '社区模块', description: '游记发布、浏览、互动' },
    { name: '订单模块', description: '订单列表、详情、退款' },
    { name: '支付模块', description: '发起支付、支付回调' },
    { name: '购物车模块', description: '购物车增删改查' },
    { name: '---', description: '--- 管理后台 ---' },
    { name: '商品管理（管理后台）', description: '商家管理商品' },
    { name: '订单管理（管理后台）', description: '商家管理订单' },
    { name: '---', description: '--- 平台管理 ---' },
    { name: '用户管理（平台）', description: '平台管理用户' },
    { name: '数据看板（平台）', description: '平台数据统计' }
  ]
}
```

#### 5.3.5 JWT 认证配置

**Swagger 中测试需要认证的接口：**

```typescript
// src/configuration.ts
swagger: {
  auth: {
    authType: 'bearer',  // JWT Bearer Token
    securityName: 'Authorization'
  }
}

// 在需要认证的接口上添加装饰器
@ApiBearerAuth()
@Post('/favorite')
async toggleFavorite() {
  // ...
}
```

**使用步骤：**
1. 访问 Swagger 文档页面
2. 点击右上角 "Authorize" 按钮
3. 输入 JWT Token（不需要 `Bearer` 前缀，Swagger会自动添加）
4. 点击 "Authorize" 确认
5. 后续所有带 🔒 图标的接口都会自动携带 Token

**获取 Token 的方式：**
```typescript
// 先调用登录接口获取 Token
POST /api/app/user/login
{
  "phone": "13800138000",
  "password": "Pass1234"
}

// 响应
{
  "code": 1000,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // 复制这个token
    "user": { ... }
  }
}

// 在 Swagger 的 Authorize 中粘贴 token
```

#### 5.3.6 响应模型定义

**定义统一响应类型：**

```typescript
// src/common/dto/response.dto.ts
import { ApiProperty } from '@midwayjs/swagger'

export class BaseResponse<T = any> {
  @ApiProperty({ description: '状态码', example: 1000 })
  code: number
  
  @ApiProperty({ description: '消息', example: 'success' })
  message: string
  
  @ApiProperty({ description: '数据' })
  data: T
}

export class PaginationResponse<T = any> {
  @ApiProperty({ description: '列表数据', type: 'array' })
  list: T[]
  
  @ApiProperty({ description: '分页信息' })
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

// 使用示例
@ApiResponse({ 
  status: 200, 
  description: '成功',
  type: BaseResponse<PaginationResponse<ProductEntity>>
})
async list() {
  // ...
}
```

#### 5.3.7 文件上传接口

```typescript
@Controller('/api/common/upload')
@ApiTags('文件上传')
export class UploadController {
  @Post('/image')
  @ApiBearerAuth()
  @ApiOperation({ summary: '上传图片' })
  @ApiConsumes('multipart/form-data')  // 指定 Content-Type
  @ApiBody({
    description: '图片文件',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'  // 文件上传
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: '上传成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: 1000 },
        data: {
          type: 'object',
          properties: {
            url: { type: 'string', example: 'https://cdn.wudong-tourist.com/uploads/xxx.jpg' }
          }
        }
      }
    }
  })
  async uploadImage(@File() file) {
    return await this.uploadService.uploadImage(file)
  }
}
```

#### 5.3.8 环境配置与访问控制

**多环境配置：**

```typescript
// Swagger UI 显示不同的服务器地址
swagger: {
  servers: [
    {
      url: 'http://localhost:7001',
      description: '本地开发环境'
    },
    {
      url: 'https://test-api.wudong-tourist.com',
      description: '测试环境'
    },
    {
      url: 'https://api.wudong-tourist.com',
      description: '生产环境'
    }
  ]
}
```

**访问控制：**

```typescript
// src/middleware/swagger-auth.ts
import { Middleware } from '@midwayjs/decorator'
import { Context, NextFunction } from '@midwayjs/koa'

/**
 * Swagger 访问控制中间件
 * 生产环境禁止访问 Swagger
 */
@Middleware()
export class SwaggerAuthMiddleware {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 只在生产环境启用访问控制
      if (process.env.NODE_ENV === 'production') {
        // 检查是否有特定的访问密钥
        const accessKey = ctx.query.key || ctx.headers['x-swagger-key']
        
        if (accessKey !== process.env.SWAGGER_ACCESS_KEY) {
          ctx.status = 403
          ctx.body = 'Access Denied'
          return
        }
      }
      
      await next()
    }
  }
}

// 应用到 Swagger 路由
@Configuration()
export class ContainerLifeCycle {
  @App()
  app: Application
  
  async onReady() {
    // 保护 Swagger 路由
    this.app.useMiddleware('/swagger-ui', SwaggerAuthMiddleware)
  }
}
```

#### 5.3.9 Swagger 自动化导出

**导出为 JSON/YAML 文件：**

```typescript
// 访问以下地址可以导出 OpenAPI 规范文件
// JSON 格式
http://localhost:7001/swagger-ui/swagger.json

// YAML 格式
http://localhost:7001/swagger-ui/swagger.yaml
```

**脚本自动导出：**

```typescript
// scripts/export-swagger.ts
import axios from 'axios'
import * as fs from 'fs'

async function exportSwagger() {
  const url = 'http://localhost:7001/swagger-ui/swagger.json'
  const response = await axios.get(url)
  
  // 保存到 docs 目录
  fs.writeFileSync(
    './docs/api-spec.json',
    JSON.stringify(response.data, null, 2)
  )
  
  console.log('✅ Swagger 文档已导出到 docs/api-spec.json')
}

exportSwagger()
```

```json
// package.json
{
  "scripts": {
    "export:swagger": "ts-node scripts/export-swagger.ts"
  }
}
```

#### 5.3.10 前端代码生成

**使用 swagger-typescript-api 自动生成前端 API 代码：**

```bash
# 安装工具
pnpm add -D swagger-typescript-api

# 生成代码
npx swagger-typescript-api -p http://localhost:7001/swagger-ui/swagger.json -o ./src/api -n index.ts
```

**生成的代码示例：**

```typescript
// src/api/index.ts
/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ## SOURCE: http://localhost:7001/swagger-ui/swagger.json     ##
 * ---------------------------------------------------------------
 */

export interface AddProductDto {
  /** 商品标题 */
  title: string
  /** 商品分类ID */
  category_id: number
  /** 商品价格 */
  price: number
  /** 库存 */
  stock: number
  /** 商品主图 */
  main_image: string
}

export class Api {
  http: AxiosInstance
  
  constructor(config?: AxiosRequestConfig) {
    this.http = axios.create(config)
  }
  
  product = {
    /**
     * @description 商品列表
     * @tags 商品模块
     * @name ProductList
     * @request GET:/api/app/product/list
     */
    list: (query?: { page?: number, pageSize?: number }) =>
      this.http.request<BaseResponse>({
        url: `/api/app/product/list`,
        method: 'GET',
        params: query
      }),
    
    /**
     * @description 新增商品
     * @tags 商品管理（管理后台）
     * @name ProductAdd
     * @request POST:/api/admin/product/add
     * @secure
     */
    add: (data: AddProductDto) =>
      this.http.request<BaseResponse>({
        url: `/api/admin/product/add`,
        method: 'POST',
        data
      })
  }
}

// 使用
const api = new Api({ baseURL: 'http://localhost:7001' })
const products = await api.product.list({ page: 1, pageSize: 10 })
```

#### 5.3.11 最佳实践

**1. 完善的注释：**
```typescript
@ApiOperation({ 
  summary: '商品列表',  // 简短描述
  description: '分页查询商品列表，支持按分类、关键词、价格区间筛选，支持多种排序方式'  // 详细描述
})
```

**2. 示例值：**
```typescript
@ApiProperty({ 
  description: '商品标题', 
  example: '苗族手工银饰手镯',  // 提供示例值
  minLength: 1,
  maxLength: 255
})
title: string
```

**3. 枚举值：**
```typescript
@ApiProperty({ 
  description: '排序方式', 
  enum: ['sales', 'price', 'time'],  // 限定可选值
  example: 'sales'
})
sort?: string
```

**4. 必填/可选：**
```typescript
@ApiProperty({ required: true })  // 必填
title: string

@ApiProperty({ required: false })  // 可选
description?: string
```

**5. 错误响应：**
```typescript
@ApiResponse({ status: 200, description: '成功' })
@ApiResponse({ status: 400, description: '参数错误' })
@ApiResponse({ status: 401, description: '未登录' })
@ApiResponse({ status: 403, description: '无权限' })
@ApiResponse({ status: 404, description: '资源不存在' })
@ApiResponse({ status: 500, description: '服务器错误' })
async update() {
  // ...
}
```

#### 5.3.12 Swagger UI 效果预览

访问 `http://localhost:7001/swagger-ui/index.html` 后，可以看到：

**页面结构：**
```
┌─────────────────────────────────────────────┐
│ 乌东文旅平台 API                              │
│ v1.0.0                                       │
│                                              │
│ 📝 衣食住行综合服务平台 RESTful API 文档      │
│                                              │
│ Servers: ▼ http://localhost:7001            │
│                                              │
│ [Authorize 🔓]                              │
├─────────────────────────────────────────────┤
│ 📂 商品模块                                   │
│   GET  /api/app/product/list   商品列表      │
│   GET  /api/app/product/:id    商品详情      │
│   POST /api/app/product/favorite 收藏商品 🔒 │
│                                              │
│ 📂 餐饮模块                                   │
│   GET  /api/app/restaurant/list 餐厅列表     │
│   ...                                        │
│                                              │
│ 📂 商品管理（管理后台）                       │
│   POST /api/admin/product/add   新增商品 🔒  │
│   PUT  /api/admin/product/update 更新商品 🔒 │
│   ...                                        │
└─────────────────────────────────────────────┘
```

**接口详情展开后：**
```
GET /api/app/product/list  商品列表

Parameters
  query:
    page        integer   页码  [default: 1]
    pageSize    integer   每页数量  [default: 10]
    category_id integer   分类ID
    keyword     string    搜索关键词
    sort        string    排序方式: sales/price/time

Response
  200 成功
    {
      "code": 1000,
      "message": "success",
      "data": {
        "list": [...],
        "pagination": {...}
      }
    }

[Try it out]  // 点击可以在线测试
```

#### 5.3.13 总结

**Swagger 集成带来的收益：**
- ✅ 前后端联调效率提升 50%
- ✅ 接口文档自动生成，永不过时
- ✅ 新成员上手时间缩短 70%
- ✅ 在线调试，无需额外工具
- ✅ 自动生成前端 API 代码

**实施清单：**
- [x] 安装 @midwayjs/swagger
- [x] 配置 Swagger 参数
- [x] 定义 DTO 类型
- [x] 使用装饰器标注接口
- [x] 配置 JWT 认证
- [x] 定义响应模型
- [x] 配置多环境服务器地址
- [x] 添加访问控制（生产环境）
- [x] 导出 OpenAPI 规范文件
- [x] 自动生成前端代码

---

## 6. 核心功能实现方案

### 6.1 用户认证与授权

#### 6.1.1 JWT认证流程

```typescript
// 1. 用户登录
export class AuthService {
  async login(phone: string, password: string) {
    // 验证密码
    const user = await this.userModel.findOne({ where: { phone } })
    const isValid = await bcrypt.compare(password, user.password)
    
    // 生成Token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // 存储到Redis
    await this.redis.setex(`token:${user.id}`, 7 * 24 * 3600, token)
    
    return { token, user }
  }
}

// 2. 中间件验证Token
export class AuthMiddleware {
  async resolve() {
    return async (ctx, next) => {
      const token = ctx.headers.authorization?.replace('Bearer ', '')
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // 验证Redis中是否存在
      const cachedToken = await redis.get(`token:${decoded.userId}`)
      if (cachedToken !== token) {
        throw new Error('Token已失效')
      }
      
      ctx.userId = decoded.userId
      ctx.userRole = decoded.role
      
      await next()
    }
  }
}
```

### 6.2 统一订单系统

#### 6.2.1 订单状态机

```
待支付(pending) ──支付成功──> 已支付(paid) ──商家确认──> 已确认(confirmed)
      │                           │                           │
      │                           │                           │
   超时取消                    申请退款                    完成/评价
      │                           │                           │
      ▼                           ▼                           ▼
  已取消(cancelled)          退款中(refunding)          已完成(completed)
                                  │
                                  │
                             退款完成
                                  │
                                  ▼
                            已退款(refunded)
```

### 6.3 支付集成

**微信小程序支付流程：**
1. 前端调用下单接口
2. 后端创建订单
3. 后端调用微信统一下单API
4. 返回支付参数给前端
5. 前端调用`wx.requestPayment`
6. 用户完成支付
7. 微信回调后端
8. 后端更新订单状态

### 6.4 房态日历管理

```typescript
// 查询房态
async getRoomCalendar(roomTypeId, checkInDate, checkOutDate) {
  const calendar = await this.calendarModel.find({
    where: {
      room_type_id: roomTypeId,
      date: Between(checkInDate, checkOutDate)
    }
  })
  
  // 计算最少可用房间数
  const minAvailable = Math.min(...calendar.map(c => c.available_count))
  
  return {
    available: minAvailable > 0,
    minAvailableCount: minAvailable,
    calendar
  }
}

// 预订时扣减库存（使用事务 + 行锁）
async bookRoom(roomTypeId, checkInDate, checkOutDate, roomCount) {
  await this.dataSource.transaction(async manager => {
    const dates = this.getDateRange(checkInDate, checkOutDate)
    
    for (const date of dates) {
      await manager.decrement(
        HomestayRoomCalendar,
        { room_type_id: roomTypeId, date },
        'available_count',
        roomCount
      )
      
      // 检查库存是否足够
      const calendar = await manager.findOne(HomestayRoomCalendar, {
        where: { room_type_id: roomTypeId, date }
      })
      
      if (calendar.available_count < 0) {
        throw new Error(`${date} 房间不足`)
      }
    }
  })
}
```

### 6.5 内容审核机制

```typescript
// 发布游记时自动审核
async createPost(userId, data) {
  // 1. 敏感词检测
  const hasSensitiveWord = await this.checkSensitiveWords(data.title + data.content)
  
  // 2. 创建游记
  const post = await this.postModel.save({
    user_id: userId,
    title: data.title,
    content: data.content,
    status: hasSensitiveWord ? 'pending' : 'published',  // 命中敏感词进入审核
    published_at: hasSensitiveWord ? null : new Date()
  })
  
  return post
}

// 敏感词检测（使用DFA算法优化）
async checkSensitiveWords(text) {
  const words = await this.sensitiveWordModel.find({ where: { status: 'active' } })
  
  for (const word of words) {
    if (text.includes(word.word)) {
      return true
    }
  }
  
  return false
}
```

### 6.6 多商家完全分离方案

#### 6.6.1 设计目标

**核心原则：**
- **数据隔离**：商家A无法查看或修改商家B的数据
- **权限隔离**：商家只能管理自己名下的资源（商品/订单/评价等）
- **业务隔离**：不同模块的商家独立管理（衣/食/住/行）
- **财务隔离**：每个商家独立的财务账户和结算

#### 6.6.2 数据隔离方案

**方案一：基于 merchant_id 字段隔离（推荐）✅**

**核心思路：** 所有业务表都包含 `merchant_id` 字段，通过中间件自动过滤数据。

**优势：**
- 实现简单，性能好
- 数据库层面统一管理
- 易于备份和维护
- 支持跨商家数据分析

**劣势：**
- 需要在每个查询中过滤 `merchant_id`
- 存在程序Bug导致数据泄露的风险（可通过Row-Level Security缓解）

**数据库设计：**

```sql
-- 1. 商家表
CREATE TABLE `merchants` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL COMMENT '关联用户ID',
  `shop_name` VARCHAR(100) NOT NULL COMMENT '店铺名称',
  `module_type` VARCHAR(20) NOT NULL COMMENT '模块类型: clothing/food/accommodation/travel',
  `contact_name` VARCHAR(50) NOT NULL,
  `contact_phone` VARCHAR(11) NOT NULL,
  `business_license` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(20) DEFAULT 'active' COMMENT 'active/suspended/closed',
  `commission_rate` DECIMAL(5,2) DEFAULT 10.00 COMMENT '平台抽佣比例',
  `balance` DECIMAL(10,2) DEFAULT 0.00 COMMENT '账户余额',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  KEY `idx_user_id` (`user_id`),
  KEY `idx_module_type` (`module_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家表';

-- 2. 商品表（加入 merchant_id）
CREATE TABLE `products` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `merchant_id` BIGINT NOT NULL COMMENT '所属商家ID', -- ⭐ 关键字段
  `category_id` BIGINT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `stock` INT DEFAULT 0,
  `status` VARCHAR(20) DEFAULT 'on_sale',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  
  KEY `idx_merchant_id` (`merchant_id`),  -- ⭐ 必须建索引
  KEY `idx_category` (`category_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 3. 订单表（记录商家信息）
CREATE TABLE `orders` (
  `id` BIGINT PRIMARY KEY,
  `user_id` BIGINT NOT NULL,
  `merchant_id` BIGINT NOT NULL COMMENT '所属商家ID', -- ⭐ 关键字段
  `order_type` VARCHAR(20) NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `merchant_amount` DECIMAL(10,2) NOT NULL COMMENT '商家实收金额',
  `platform_amount` DECIMAL(10,2) NOT NULL COMMENT '平台抽佣金额',
  `status` VARCHAR(20) DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  KEY `idx_user_id` (`user_id`),
  KEY `idx_merchant_id` (`merchant_id`), -- ⭐ 必须建索引
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- 4. 餐厅表（每个餐厅归属一个商家）
CREATE TABLE `restaurants` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `merchant_id` BIGINT NOT NULL COMMENT '所属商家ID',
  `name` VARCHAR(100) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  -- ... 其他字段
  KEY `idx_merchant_id` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. 民宿表
CREATE TABLE `homestays` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `merchant_id` BIGINT NOT NULL COMMENT '所属商家ID',
  `name` VARCHAR(100) NOT NULL,
  -- ... 其他字段
  KEY `idx_merchant_id` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. 路线套餐表
CREATE TABLE `route_packages` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `merchant_id` BIGINT NOT NULL COMMENT '所属商家ID',
  `title` VARCHAR(100) NOT NULL,
  -- ... 其他字段
  KEY `idx_merchant_id` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**方案二：独立数据库隔离**

**核心思路：** 每个商家使用独立的数据库实例。

**优势：**
- 数据隔离最彻底
- 安全性最高
- 单个商家数据库故障不影响其他商家

**劣势：**
- 运维复杂度高（需要管理N个数据库）
- 跨商家数据分析困难
- 成本高（每个数据库独立实例）
- 不适合中小型平台

**结论：** 对于乌东文旅平台（学生项目、商家数量可控），**推荐方案一（基于 merchant_id 隔离）**。

---

#### 6.6.3 权限隔离实现

**核心机制：基于 Cool-Admin 的 RBAC + 数据权限过滤**

##### 6.6.3.1 角色定义

```sql
-- 插入商家角色
INSERT INTO `roles` (`name`, `code`, `description`) VALUES
('商家-商品模块', 'merchant_clothing', '管理商品分类、商品、库存、评价'),
('商家-餐饮模块', 'merchant_food', '管理餐厅、菜品、预订、农产品'),
('商家-住宿模块', 'merchant_accommodation', '管理民宿、房型、房态、预订'),
('商家-票务模块', 'merchant_travel', '管理景区、票种、路线、电子票'),
('平台管理员', 'platform_admin', '管理全局数据、审核、财务');
```

##### 6.6.3.2 中间件：自动注入 merchant_id

```typescript
// src/middleware/merchant-scope.ts
import { Middleware } from '@midwayjs/decorator'
import { Context, NextFunction } from '@midwayjs/koa'

/**
 * 商家数据权限中间件
 * 自动在查询条件中注入 merchant_id
 */
@Middleware()
export class MerchantScopeMiddleware {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 1. 判断是否是商家角色
      if (ctx.userRole?.startsWith('merchant_')) {
        // 2. 从用户信息获取 merchant_id
        const merchantId = await this.getMerchantIdByUserId(ctx.userId)
        
        if (!merchantId) {
          ctx.status = 403
          ctx.body = { code: 1003, message: '未找到商家信息' }
          return
        }
        
        // 3. 将 merchant_id 注入到上下文
        ctx.merchantId = merchantId
      }
      
      await next()
    }
  }
  
  async getMerchantIdByUserId(userId: number): Promise<number | null> {
    const merchant = await this.merchantModel.findOne({ where: { user_id: userId } })
    return merchant?.id || null
  }
}
```

##### 6.6.3.3 Service层：自动过滤数据

```typescript
// src/modules/clothing/service/product.ts
import { Provide, Inject } from '@midwayjs/decorator'
import { BaseService } from '@cool-midway/core'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Repository } from 'typeorm'
import { ProductEntity } from '../entity/product'
import { Context } from '@midwayjs/koa'

@Provide()
export class ProductService extends BaseService {
  @InjectEntityModel(ProductEntity)
  productEntity: Repository<ProductEntity>
  
  @Inject()
  ctx: Context
  
  /**
   * 查询商品列表（自动过滤商家）
   */
  async list(query: any) {
    const where: any = {}
    
    // ⭐ 核心：自动注入 merchant_id
    if (this.ctx.merchantId) {
      where.merchant_id = this.ctx.merchantId
    }
    
    // 其他查询条件
    if (query.category_id) {
      where.category_id = query.category_id
    }
    if (query.status) {
      where.status = query.status
    }
    
    return await this.productEntity.find({
      where,
      order: { created_at: 'DESC' }
    })
  }
  
  /**
   * 更新商品（验证所属权）
   */
  async update(id: number, data: any) {
    // 1. 先查询商品是否存在
    const product = await this.productEntity.findOne({ where: { id } })
    if (!product) {
      throw new Error('商品不存在')
    }
    
    // 2. ⭐ 验证是否属于当前商家
    if (this.ctx.merchantId && product.merchant_id !== this.ctx.merchantId) {
      throw new Error('无权操作该商品')
    }
    
    // 3. 执行更新
    return await this.productEntity.update(id, data)
  }
  
  /**
   * 删除商品（验证所属权）
   */
  async delete(id: number) {
    const product = await this.productEntity.findOne({ where: { id } })
    if (!product) {
      throw new Error('商品不存在')
    }
    
    if (this.ctx.merchantId && product.merchant_id !== this.ctx.merchantId) {
      throw new Error('无权删除该商品')
    }
    
    return await this.productEntity.softDelete(id)  // 软删除
  }
}
```

##### 6.6.3.4 Controller层：使用装饰器简化

```typescript
// src/decorator/merchant-scope.ts
import { createCustomMethodDecorator } from '@midwayjs/decorator'

/**
 * 商家数据权限装饰器
 * 使用方式：@MerchantScope()
 */
export function MerchantScope(field: string = 'merchant_id') {
  return createCustomMethodDecorator((ctx, next) => {
    // 在执行方法前，自动注入商家ID过滤条件
    if (ctx.merchantId) {
      ctx.request.body[field] = ctx.merchantId
      ctx.request.query[field] = ctx.merchantId
    }
    return next()
  })
}

// 使用示例
@Controller('/api/admin/product')
export class AdminProductController extends BaseController {
  @Post('/add')
  @MerchantScope()  // ⭐ 自动注入 merchant_id
  async add(@Body() dto: AddProductDto) {
    // dto.merchant_id 已经被自动设置为当前商家ID
    return await this.productService.add(dto)
  }
  
  @Get('/list')
  @MerchantScope()  // ⭐ 自动过滤 merchant_id
  async list(@Query() query) {
    // query.merchant_id 已经被自动设置
    return await this.productService.page(query)
  }
}
```

---

#### 6.6.4 业务隔离实现

**场景1：商品管理**

```typescript
// 商家A只能看到自己的商品
GET /api/admin/product/list
// 自动过滤：WHERE merchant_id = 商家A的ID

// 商家A无法修改商家B的商品
PUT /api/admin/product/update
{
  "id": 999,  // 商家B的商品ID
  "title": "修改后的标题"
}
// 响应：{ code: 1003, message: "无权操作该商品" }
```

**场景2：订单管理**

```typescript
// 商家只能看到自己店铺的订单
GET /api/admin/order/list
// 自动过滤：WHERE merchant_id = 当前商家ID

// 平台管理员可以看到所有订单
GET /api/platform/order/list
// 不过滤 merchant_id，查询所有订单
```

**场景3：评价管理**

```typescript
// 商家只能回复自己商品的评价
POST /api/admin/review/:id/reply
{
  "reply_content": "感谢您的评价"
}

// 后端验证逻辑
async replyReview(reviewId, replyContent) {
  const review = await this.reviewModel.findOne({ where: { id: reviewId } })
  
  // 通过 review.product_id 查询商品，验证商品是否属于当前商家
  const product = await this.productModel.findOne({ where: { id: review.product_id } })
  
  if (product.merchant_id !== this.ctx.merchantId) {
    throw new Error('无权回复该评价')
  }
  
  // 保存回复
  await this.reviewModel.update(reviewId, {
    reply_content: replyContent,
    replied_at: new Date()
  })
}
```

---

#### 6.6.5 财务隔离实现

**核心设计：**
1. 每个商家拥有独立的账户余额
2. 订单金额自动分账（平台抽佣 + 商家实收）
3. 商家可以查看自己的财务流水
4. 平台管理员统一结算

**数据库设计：**

```sql
-- 商家账户表
CREATE TABLE `merchant_accounts` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `merchant_id` BIGINT NOT NULL COMMENT '商家ID',
  `balance` DECIMAL(10,2) DEFAULT 0.00 COMMENT '账户余额',
  `frozen_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '冻结金额',
  `total_income` DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计收入',
  `total_withdraw` DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计提现',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY `uk_merchant_id` (`merchant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家账户表';

-- 商家流水表
CREATE TABLE `merchant_transactions` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `merchant_id` BIGINT NOT NULL,
  `order_id` BIGINT DEFAULT NULL COMMENT '关联订单ID',
  `type` VARCHAR(20) NOT NULL COMMENT '类型: income/withdraw/refund',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '金额',
  `balance_before` DECIMAL(10,2) NOT NULL COMMENT '变动前余额',
  `balance_after` DECIMAL(10,2) NOT NULL COMMENT '变动后余额',
  `description` VARCHAR(255) DEFAULT '' COMMENT '描述',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家流水表';

-- 结算单表
CREATE TABLE `merchant_settlements` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `merchant_id` BIGINT NOT NULL,
  `settlement_no` VARCHAR(50) NOT NULL COMMENT '结算单号',
  `start_date` DATE NOT NULL COMMENT '结算开始日期',
  `end_date` DATE NOT NULL COMMENT '结算结束日期',
  `order_count` INT DEFAULT 0 COMMENT '订单数量',
  `total_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '订单总额',
  `platform_commission` DECIMAL(10,2) DEFAULT 0.00 COMMENT '平台抽佣',
  `settlement_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '结算金额',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/processing/completed',
  `settled_at` DATETIME DEFAULT NULL COMMENT '结算时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY `uk_settlement_no` (`settlement_no`),
  KEY `idx_merchant_id` (`merchant_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商家结算单表';
```

**分账逻辑：**

```typescript
// 订单支付成功后，自动分账
async handleOrderPaid(orderId: string) {
  const order = await this.orderModel.findOne({ where: { id: orderId } })
  
  // 1. 计算平台抽佣
  const merchant = await this.merchantModel.findOne({ where: { id: order.merchant_id } })
  const commissionRate = merchant.commission_rate / 100  // 10% = 0.1
  
  const platformAmount = order.total_amount * commissionRate
  const merchantAmount = order.total_amount - platformAmount
  
  // 2. 更新订单的分账信息
  await this.orderModel.update(orderId, {
    merchant_amount: merchantAmount,
    platform_amount: platformAmount
  })
  
  // 3. 增加商家账户余额（使用事务）
  await this.dataSource.transaction(async manager => {
    // 查询商家账户
    const account = await manager.findOne(MerchantAccount, {
      where: { merchant_id: order.merchant_id }
    })
    
    const balanceBefore = account.balance
    const balanceAfter = balanceBefore + merchantAmount
    
    // 更新余额
    await manager.increment(
      MerchantAccount,
      { merchant_id: order.merchant_id },
      'balance',
      merchantAmount
    )
    
    await manager.increment(
      MerchantAccount,
      { merchant_id: order.merchant_id },
      'total_income',
      merchantAmount
    )
    
    // 记录流水
    await manager.save(MerchantTransaction, {
      merchant_id: order.merchant_id,
      order_id: orderId,
      type: 'income',
      amount: merchantAmount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      description: `订单收入 - ${orderId}`
    })
  })
}

// 商家查看自己的流水
async getMerchantTransactions(merchantId: number, query: any) {
  return await this.transactionModel.find({
    where: { merchant_id: merchantId },
    order: { created_at: 'DESC' },
    skip: (query.page - 1) * query.pageSize,
    take: query.pageSize
  })
}

// 平台生成结算单
async generateSettlement(merchantId: number, startDate: string, endDate: string) {
  // 1. 统计该时段内的订单
  const orders = await this.orderModel.find({
    where: {
      merchant_id: merchantId,
      status: 'completed',
      paid_at: Between(startDate, endDate)
    }
  })
  
  const orderCount = orders.length
  const totalAmount = orders.reduce((sum, o) => sum + o.total_amount, 0)
  const platformCommission = orders.reduce((sum, o) => sum + o.platform_amount, 0)
  const settlementAmount = orders.reduce((sum, o) => sum + o.merchant_amount, 0)
  
  // 2. 创建结算单
  const settlement = await this.settlementModel.save({
    merchant_id: merchantId,
    settlement_no: this.generateSettlementNo(),
    start_date: startDate,
    end_date: endDate,
    order_count: orderCount,
    total_amount: totalAmount,
    platform_commission: platformCommission,
    settlement_amount: settlementAmount,
    status: 'pending'
  })
  
  return settlement
}
```

---

#### 6.6.6 前端实现：多商家入口

**管理后台登录后，根据角色跳转不同页面：**

```vue
<!-- src/modules/base/views/login.vue -->
<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogin = async (form) => {
  const res = await login(form)
  
  userStore.setToken(res.token)
  userStore.setUserInfo(res.user)
  
  // 根据角色跳转
  if (res.user.role === 'platform_admin') {
    // 平台管理员 → 数据看板
    router.push('/dashboard')
  } else if (res.user.role.startsWith('merchant_')) {
    // 商家 → 商家工作台
    router.push('/merchant/dashboard')
  } else {
    router.push('/404')
  }
}
</script>
```

**商家工作台（只显示自己的数据）：**

```vue
<!-- src/modules/merchant/views/dashboard.vue -->
<template>
  <div class="merchant-dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="label">今日订单</div>
            <div class="value">{{ stats.todayOrders }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="label">今日营业额</div>
            <div class="value">¥{{ stats.todayIncome }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="label">账户余额</div>
            <div class="value">¥{{ stats.balance }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="label">待处理订单</div>
            <div class="value">{{ stats.pendingOrders }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 订单列表（自动过滤当前商家） -->
    <el-card class="mt-20">
      <template #header>
        <span>最近订单</span>
      </template>
      <el-table :data="orders" stripe>
        <el-table-column prop="id" label="订单号" />
        <el-table-column prop="total_amount" label="金额" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="created_at" label="下单时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMerchantStats, getMerchantOrders } from '@/api/merchant'

const stats = ref({})
const orders = ref([])

onMounted(async () => {
  // 自动获取当前商家的数据
  stats.value = await getMerchantStats()
  orders.value = await getMerchantOrders({ page: 1, pageSize: 10 })
})
</script>
```

---

#### 6.6.7 安全加固

**1. SQL注入防护**
```typescript
// ❌ 错误：字符串拼接
const sql = `SELECT * FROM products WHERE merchant_id = ${merchantId}`

// ✅ 正确：使用参数化查询
const products = await this.productEntity.find({
  where: { merchant_id: merchantId }
})
```

**2. 越权访问防护**
```typescript
// 每个写操作都必须验证所属权
async updateProduct(id, data) {
  const product = await this.findById(id)
  
  // ⭐ 关键：验证是否属于当前商家
  if (product.merchant_id !== this.ctx.merchantId) {
    throw new ForbiddenException('无权操作该商品')
  }
  
  return await this.update(id, data)
}
```

**3. 日志审计**
```typescript
// 记录商家的所有操作
@Middleware()
export class AuditLogMiddleware {
  resolve() {
    return async (ctx, next) => {
      await next()
      
      // 记录操作日志
      if (ctx.merchantId && ['POST', 'PUT', 'DELETE'].includes(ctx.method)) {
        await this.logService.create({
          merchant_id: ctx.merchantId,
          action: `${ctx.method} ${ctx.path}`,
          params: JSON.stringify(ctx.request.body),
          ip: ctx.ip,
          user_agent: ctx.headers['user-agent']
        })
      }
    }
  }
}
```

**4. 数据库行级安全（可选，MySQL 8.0+）**
```sql
-- 创建行级安全策略（仅供参考，实际使用需配置MySQL Enterprise）
-- 确保即使代码有Bug，数据库层面也能防止数据泄露
CREATE POLICY merchant_isolation_policy ON products
  FOR ALL
  TO merchant_role
  USING (merchant_id = CURRENT_USER_MERCHANT_ID());
```

---

#### 6.6.8 测试用例

**测试场景1：商家A无法查看商家B的商品**

```typescript
// test/merchant-isolation.test.ts
describe('商家数据隔离', () => {
  it('商家A无法查看商家B的商品', async () => {
    // 1. 创建两个商家
    const merchantA = await createMerchant({ shop_name: '商家A' })
    const merchantB = await createMerchant({ shop_name: '商家B' })
    
    // 2. 商家A创建商品
    const productA = await createProduct({ merchant_id: merchantA.id, title: '商品A' })
    
    // 3. 商家B创建商品
    const productB = await createProduct({ merchant_id: merchantB.id, title: '商品B' })
    
    // 4. 商家A登录并查询商品列表
    const tokenA = await login(merchantA.user_id)
    const productsA = await request(app)
      .get('/api/admin/product/list')
      .set('Authorization', `Bearer ${tokenA}`)
    
    // 5. 断言：商家A只能看到自己的商品
    expect(productsA.body.data.length).toBe(1)
    expect(productsA.body.data[0].id).toBe(productA.id)
    expect(productsA.body.data[0].title).toBe('商品A')
  })
  
  it('商家A无法修改商家B的商品', async () => {
    const merchantA = await createMerchant({ shop_name: '商家A' })
    const merchantB = await createMerchant({ shop_name: '商家B' })
    
    const productB = await createProduct({ merchant_id: merchantB.id, title: '商品B' })
    
    const tokenA = await login(merchantA.user_id)
    const res = await request(app)
      .put('/api/admin/product/update')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ id: productB.id, title: '试图修改' })
    
    // 断言：返回403错误
    expect(res.status).toBe(403)
    expect(res.body.message).toContain('无权操作')
  })
})
```

---

#### 6.6.9 总结

**多商家完全分离的核心要点：**

1. **数据层**：所有业务表都包含 `merchant_id`，并建立索引
2. **权限层**：通过中间件自动注入 `merchant_id`，Service层自动过滤
3. **业务层**：所有写操作都验证所属权，防止越权访问
4. **财务层**：独立账户、自动分账、流水记录、统一结算
5. **前端层**：根据角色展示不同页面，商家只看自己的数据
6. **安全层**：参数化查询、越权防护、操作日志、行级安全

**实施清单：**
- [x] 设计多商家数据表结构
- [x] 实现 MerchantScopeMiddleware 中间件
- [x] 封装 @MerchantScope 装饰器
- [x] Service层自动过滤逻辑
- [x] 财务分账流程
- [x] 前端商家工作台
- [x] 安全加固措施
- [x] 测试用例编写

---

## 7. 安全方案

### 7.1 认证与授权

- **JWT Token**：7天有效期，存储在Redis
- **RBAC权限**：角色-菜单-按钮三级权限控制
- **密码安全**：bcrypt加密，salt轮次10

### 7.2 数据安全

- **SQL注入防护**：TypeORM参数化查询
- **XSS防护**：富文本使用DOMPurify过滤
- **CSRF防护**：验证Referer + CSRF Token
- **敏感信息脱敏**：手机号、身份证号脱敏展示

### 7.3 接口安全

- **请求限流**：基于IP和用户的请求频率限制
- **参数校验**：使用class-validator严格校验
- **文件上传安全**：文件类型、大小限制，文件重命名

---

## 8. 部署方案

### 8.1 服务器配置

- **系统**：CentOS 7.9 / Ubuntu 20.04
- **配置**：4核8GB内存，100GB SSD，5Mbps带宽

### 8.2 部署架构

```
用户 → CDN → Nginx → PM2(Node.js集群) → MySQL/Redis
```

### 8.3 Nginx配置示例

```nginx
server {
    listen 443 ssl http2;
    server_name api.wudong-tourist.com;
    
    # API代理
    location /api {
        proxy_pass http://127.0.0.1:7001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # 静态资源
    location /uploads {
        alias /var/www/wudong-tourist/uploads;
        expires 30d;
    }
}
```

---

## 9. 开发计划

### 9.1 总体规划（8周）

| 阶段 | 周数 | 内容 | 里程碑 |
|------|------|------|--------|
| 第1周 | 1周 | 项目搭建 + 基础功能 | 用户可以登录注册 |
| 第2周 | 1周 | 商品模块（衣） | 用户可以浏览商品、下单 |
| 第3周 | 1周 | 餐饮模块（食）+ 住宿模块（住） | 用户可以预订餐位和民宿 |
| 第4周 | 1周 | 票务模块（行）+ 支付集成 | 用户可以购买门票，支付流程完整 |
| 第5周 | 1周 | 社区模块 | 用户可以发布游记、互动 |
| 第6-7周 | 2周 | 管理后台 | 商家和管理员可以管理数据 |
| 第8周 | 1周 | 测试优化 + 部署 | 成功上线 |

### 9.2 详细任务分解

**第1周任务清单：**
- [ ] 初始化Midway.js + Cool-Admin项目
- [ ] 初始化uni-app项目
- [ ] 初始化管理后台项目
- [ ] 配置MySQL + Redis
- [ ] 用户注册/登录/JWT认证
- [ ] 文件上传功能
- [ ] 前端登录页面 + 首页框架

**第2周任务清单：**
- [ ] 商品分类CRUD
- [ ] 商品CRUD（含SKU）
- [ ] 商品列表/详情页面
- [ ] 购物车功能
- [ ] 订单创建流程

**后续周次任务详见之前生成的文档第9章节。**

---

## 文档结束

本技术设计方案完整定义了乌东文旅平台的：
- 整体架构（三层架构 + 三端设计）
- 技术选型（Cool-Admin + uni-app）
- 项目结构（后端/前端/管理后台）
- 数据库设计（30+张表）
- API接口规范
- 核心功能实现
- 安全方案
- 部署方案
- 开发计划（8周）

**下一步：**
请审查此技术设计方案，确认无误后，我将调用 `writing-plans` 技能生成详细的实施计划。