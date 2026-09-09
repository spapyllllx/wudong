# 乌东文旅平台 - 用户端

## 项目简介

乌东文旅"衣食住行"综合服务平台用户端，提供非遗商品、特色餐饮、民宿预订、景区票务及社区分享功能。

## 技术栈

- **框架**: Vue 3.4 + TypeScript
- **构建工具**: Vite 5
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **UI 组件**: Element Plus 2
- **HTTP 客户端**: Axios
- **样式**: SCSS

## 项目结构

```
wudong-web/
├── src/
│   ├── api/                # API 接口
│   │   ├── user.ts         # 用户相关
│   │   ├── community.ts    # 社区相关
│   │   └── product.ts      # 商品相关
│   ├── assets/             # 静态资源
│   ├── components/         # 组件
│   │   ├── layout/         # 布局组件
│   │   │   ├── Header.vue
│   │   │   └── Footer.vue
│   │   └── common/         # 通用组件
│   ├── router/             # 路由配置
│   ├── stores/             # 状态管理
│   │   └── user.ts
│   ├── styles/             # 全局样式
│   │   ├── variables.scss  # 变量
│   │   ├── mixins.scss     # 混入
│   │   └── global.scss     # 全局样式
│   ├── utils/              # 工具函数
│   │   ├── request.ts      # 请求封装
│   │   ├── auth.ts         # 认证工具
│   │   └── format.ts       # 格式化工具
│   ├── views/              # 页面
│   │   ├── home/           # 首页
│   │   ├── user/           # 用户模块 ✅
│   │   ├── community/      # 社区模块 ✅
│   │   ├── product/        # 商品模块 ✅
│   │   ├── order/          # 订单模块（骨架）
│   │   ├── restaurant/     # 餐饮模块（骨架）
│   │   ├── homestay/       # 民宿模块（骨架）
│   │   └── ticket/         # 票务模块（骨架）
│   ├── App.vue
│   └── main.ts
├── .env.development        # 开发环境配置
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 功能模块

### ✅ 已完整实现

1. **用户模块**
   - 登录/注册（密码登录、验证码登录）
   - 个人中心
   - 我的动态
   - 地址管理（骨架）

2. **社区模块**
   - 帖子列表（瀑布流布局）
   - 筛选（最新、热门、精华）
   - 帖子详情（骨架）
   - 发布游记（骨架）
   - 评论功能（接口已对接）
   - 点赞功能（接口已对接）

3. **商品模块**
   - 商品列表（网格布局）
   - 筛选和排序
   - 商品详情（骨架）
   - 购物车（骨架）

### ⚠️ 骨架页面（待实现）

- 订单模块（确认订单、订单列表、订单详情）
- 餐饮模块（餐厅列表、餐厅详情）
- 民宿模块（民宿列表、民宿详情）
- 票务模块（景点列表、景点详情）

## 安装依赖

```bash
npm install
# 或
pnpm install
```

## 开发

```bash
npm run dev
```

访问: http://localhost:3000

## 构建

```bash
npm run build
```

## 后端对接

### API 基础地址

开发环境: `http://localhost:7001`

### 已对接的接口

**用户模块**:
- POST `/app/user/login/password` - 密码登录
- POST `/app/user/login/phone` - 验证码登录
- POST `/app/user/login/smsCode` - 发送验证码
- GET `/app/user/login/captcha` - 获取图形验证码
- GET `/app/user/info/person` - 获取用户信息
- POST `/app/user/info/updatePerson` - 更新用户信息

**社区模块**:
- POST `/app/shequ/community/postList` - 帖子列表
- GET `/app/shequ/community/postDetail` - 帖子详情
- POST `/app/shequ/community/publishPost` - 发布帖子
- POST `/app/shequ/community/likePost` - 点赞帖子
- POST `/app/shequ/community/unlikePost` - 取消点赞
- POST `/app/shequ/community/commentList` - 评论列表
- POST `/app/shequ/community/publishComment` - 发表评论
- POST `/app/shequ/community/myPostList` - 我的帖子

## 设计说明

### 设计风格

- **简约现代**: 大量留白、清晰层次、微妙阴影
- **克制的动画**: 过渡自然，不花哨
- **高级感色彩**: 低饱和度配色（灰调 + 主题色点缀）
- **内容优先**: 弱化装饰，突出内容本身

### 色彩方案

- 主题色: #3B82F6
- 成功: #10B981
- 警告: #F59E0B
- 危险: #EF4444
- 主文本: #1F2937
- 次要文本: #6B7280

### 响应式断点

- xs: 480px
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## 待完善功能

### 高优先级
1. 完善社区模块
   - 帖子详情页（图片轮播、评论区）
   - 发布游记页（图片上传、富文本编辑）
   - 优化瀑布流布局（虚拟滚动）

2. 完善商品模块
   - 商品详情页（规格选择、评价系统）
   - 购物车功能
   - 收藏功能

3. 完善用户模块
   - 地址管理（CRUD）
   - 个人资料编辑
   - 密码修改

### 中优先级
4. 订单模块实现
5. 支付功能对接
6. 图片上传组件

### 低优先级
7. 餐饮、民宿、票务模块实现
8. 搜索功能
9. 消息通知

## 注意事项

1. **Token 管理**: 已实现自动刷新，但需后端配合
2. **图片上传**: 需要实现上传组件并对接后端上传接口
3. **权限控制**: 路由守卫已实现，需登录的页面会自动跳转
4. **错误处理**: 统一在 axios 拦截器中处理

## 团队协作建议

1. 每个模块由一个人负责
2. 参考已完成的模块（用户、社区、商品）的代码风格
3. 复用通用组件和工具函数
4. API 接口统一放在 `src/api/` 目录下
5. 页面组件放在 `src/views/` 对应模块目录下

## License

MIT
