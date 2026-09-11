# 数据库初始化说明

## 数据库信息
- 数据库名：`cool-admin-midway`
- 字符集：`utf8mb4`
- 引擎：MySQL 5.7+

## 快速开始

### 1. 导入数据库结构

```bash
# Windows (PowerShell)
Get-Content database/schema_only.sql | mysql -u root -p

# 或者使用 mysql 命令
mysql -u root -p < cool-admin-midway/database/schema_only.sql

# Linux/Mac
mysql -u root -p < cool-admin-midway/database/schema_only.sql
```

### 2. 修改配置文件

修改 `src/config/config.local.ts` 中的数据库配置：

```typescript
typeorm: {
  dataSource: {
    default: {
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '你的密码',
      database: 'cool-admin-midway',
      synchronize: true,  // 开发环境可开启
      charset: 'utf8mb4',
    },
  },
}
```

### 3. 启动项目

```bash
npm install
npm run dev
```

## 文件说明

- `schema_only.sql` - **完整数据库结构**（不含数据，适合团队协作）
- 其他模块SQL文件 - 单独模块的数据库文件（历史文件，仅供参考）

## 注意事项

1. **生产环境**：请将 `synchronize` 设置为 `false`，避免数据丢失
2. **密码安全**：不要将包含真实密码的配置文件提交到Git
3. **数据初始化**：导入结构后，TypeORM会根据Entity自动同步表结构
4. **更新结构**：如需更新数据库结构，运行：
   ```bash
   mysqldump -u root -p --no-data cool-admin-midway > database/schema_only.sql
   # 然后移除不兼容语法
   ```

## 模块说明

项目包含以下业务模块：
- 用户模块（user）- 用户、地址管理
- 商品模块（product）- 商品管理
- 购物车模块（cart）- 购物车
- 订单模块（order）- 订单管理
- 餐厅模块（restaurant）- 餐厅信息
- 民宿模块（homestay）- 民宿信息
- 门票模块（ticket）- 门票管理
- 社区模块（shequ）- 社区帖子
- 推荐模块（recommend）- 推荐系统
- 搜索模块（search）- 搜索功能

## 数据导入说明

由于项目采用 TypeORM，建议：
1. 先导入数据库结构（schema_only.sql）
2. 启动项目后，TypeORM 会自动同步 Entity 到数据库
3. 如需测试数据，可以通过后台管理系统手动添加

这样可以确保数据库结构始终与代码中的 Entity 定义保持一致。
