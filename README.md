# 乌东文旅"衣食住行"服务平台

## 项目简介

基于贵州乌东苗寨文旅资源构建的"衣食住行+社区分享+平台管理"一站式数字化服务平台。

## 技术栈

- **后端**: Spring Boot 2.7 + MyBatis Plus + MySQL 8.0
- **前端**: 微信小程序 + Vue 3 (PC端/管理后台)
- **认证**: JWT Token
- **缓存**: Redis
- **存储**: 腾讯云COS / 阿里云OSS

## 模块划分

| 组别 | 模块 | 业务 | 接口前缀 |
|------|------|------|---------|
| 第1组 | 衣 | 非遗商品电商 | /api/yi |
| 第2组 | 食 | 餐饮美食+农产品 | /api/shi |
| 第3组 | 住 | 民宿预订 | /api/zhu |
| 第4组 | 行 | 门票+路线套餐 | /api/xing |
| 第5组 | 社区 | UGC照片分享 | /api/shequ |
| 第6组 | 管理后台 | 全局管理+公共框架 | /api/admin |

## 快速开始

### 环境要求
- JDK 1.8+
- Maven 3.6+
- MySQL 8.0
- Node.js 18+ (前端开发)

### 后端启动
```bash
cd backend
# 1. 初始化数据库
mysql -u root -p < database/schema.sql
# 2. 修改配置文件 database/application.yml 中的数据库连接
# 3. 运行
mvn spring-boot:run
```

### 数据库配置
编辑 `backend/src/main/resources/application.yml`：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/wudong_tourism
    username: root
    password: 你的密码
```

### 默认管理员账号
- 用户名: `admin`
- 密码: `admin123`

## API 文档

服务启动后访问：http://localhost:8080/doc.html

## 目录结构

```
wudong-tourism-platform/
├── backend/                    # Spring Boot 后端
│   ├── src/main/java/com/wudong/
│   │   ├── common/            # 公共模块（配置、工具、拦截器）
│   │   ├── user/              # 用户服务
│   │   ├── order/             # 订单服务
│   │   ├── yi/                # 模块一：非遗商品
│   │   ├── admin/             # 模块六：管理后台
│   │   └── WudongTourismApplication.java
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
├── database/
│   └── schema.sql             # 数据库初始化脚本
└── frontend/                  # 前端代码（待创建）
```
