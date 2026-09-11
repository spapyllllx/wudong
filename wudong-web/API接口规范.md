# 乌东文旅项目 - API 接口规范

> **重要提示**：所有开发人员必须严格遵循此规范，确保代码整合时不会冲突！

## 📋 目录
- [通用规范](#通用规范)
- [认证接口](#认证接口)
- [响应格式](#响应格式)
- [错误码](#错误码)

---

## 通用规范

### 基础信息
- **API 基础地址**：`http://localhost:7001`
- **请求头要求**：
  ```
  Content-Type: application/json
  Authorization: Bearer {token}  // 需要登录的接口
  ```

### 命名规范
- **RESTful 风格**：使用小驼峰命名
- **路径规范**：`/app/{模块}/{功能}`
  - 用户端：`/app/user/...`
  - 管理端：`/admin/user/...`

---

## 认证接口

### 1. 用户名密码登录
```
POST /app/user/login/password
```

**请求参数：**
```json
{
  "username": "string",     // 必填，用户名
  "password": "string"      // 必填，密码
}
```

**响应数据：**
```json
{
  "code": 1000,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expire": 7200,         // token过期时间（秒）
    "user": {
      "id": 1,
      "phone": "13800138000",
      "nickName": "张三",
      "avatarUrl": "https://...",
      "gender": 1,           // 0未知 1男 2女
      "birthday": "1990-01-01",
      "region": "贵州省·贵阳市",
      "bio": "个人简介"
    }
  }
}
```

---

### 2. 手机号密码登录
```
POST /app/user/login/phone
```

**请求参数：**
```json
{
  "phone": "string",        // 必填，手机号
  "password": "string"      // 必填，密码
}
```

**响应数据：** 同上

---

### 3. 手机号验证码登录
```
POST /app/user/login/sms
```

**请求参数：**
```json
{
  "phone": "string",        // 必填，手机号
  "code": "string"          // 必填，短信验证码
}
```

**响应数据：** 同上

---

### 4. 用户注册
```
POST /app/user/register
```

**请求参数：**
```json
{
  "username": "string",     // 必填，用户名（4-20字符）
  "password": "string",     // 必填，密码（6-20字符）
  "phone": "string",        // 必填，手机号
  "code": "string"          // 必填，短信验证码
}
```

**响应数据：**
```json
{
  "code": 1000,
  "message": "注册成功",
  "data": {
    "token": "...",
    "refreshToken": "...",
    "expire": 7200,
    "user": { ... }
  }
}
```

---

### 5. 发送短信验证码
```
POST /app/user/sendSmsCode
```

**请求参数：**
```json
{
  "phone": "string",        // 必填，手机号
  "captchaCode": "string"   // 必填，图形验证码
}
```

**响应数据：**
```json
{
  "code": 1000,
  "message": "发送成功",
  "data": null
}
```

---

### 6. 获取图形验证码
```
GET /app/user/captcha
```

**响应数据：**
```json
{
  "code": 1000,
  "message": "success",
  "data": {
    "id": "uuid-string",           // 验证码ID
    "image": "data:image/svg+xml;base64,..."  // base64图片
  }
}
```

---

### 7. 获取用户信息
```
GET /app/user/info
Headers: Authorization: Bearer {token}
```

**响应数据：**
```json
{
  "code": 1000,
  "message": "success",
  "data": {
    "id": 1,
    "phone": "13800138000",
    "nickName": "张三",
    "avatarUrl": "https://...",
    "gender": 1,
    "birthday": "1990-01-01",
    "region": "贵州省·贵阳市",
    "bio": "个人简介"
  }
}
```

---

### 8. 更新用户信息
```
POST /app/user/update
Headers: Authorization: Bearer {token}
```

**请求参数：**
```json
{
  "nickName": "string",      // 可选
  "gender": 0,               // 可选，0未知 1男 2女
  "birthday": "string",      // 可选，格式：YYYY-MM-DD
  "region": "string",        // 可选
  "bio": "string"            // 可选
}
```

**响应数据：**
```json
{
  "code": 1000,
  "message": "更新成功",
  "data": null
}
```

---

### 9. 上传头像
```
POST /app/user/uploadAvatar
Headers: Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**请求参数：**
```
file: File  // 图片文件
```

**响应数据：**
```json
{
  "code": 1000,
  "message": "上传成功",
  "data": {
    "url": "https://cdn.example.com/avatar/xxx.jpg"
  }
}
```

---

### 10. 退出登录
```
POST /app/user/logout
Headers: Authorization: Bearer {token}
```

**响应数据：**
```json
{
  "code": 1000,
  "message": "退出成功",
  "data": null
}
```

---

## 响应格式

### 统一响应结构
所有接口返回格式必须统一：

```json
{
  "code": 1000,           // 业务状态码
  "message": "string",    // 提示信息
  "data": any             // 响应数据，可以是对象、数组或null
}
```

### 分页响应结构
```json
{
  "code": 1000,
  "message": "success",
  "data": {
    "list": [...],        // 数据列表
    "pagination": {
      "page": 1,          // 当前页码
      "size": 20,         // 每页数量
      "total": 100        // 总记录数
    }
  }
}
```

---

## 错误码

### 通用错误码
| 错误码 | 说明 | 处理方式 |
|--------|------|----------|
| 1000 | 成功 | 正常处理 |
| 1001 | 参数错误 | 提示用户检查输入 |
| 1002 | 未登录 | 跳转到登录页 |
| 1003 | 无权限 | 提示无权限 |
| 1004 | 请求过于频繁 | 提示稍后再试 |
| 1005 | 服务器错误 | 提示系统异常 |

### 用户模块错误码
| 错误码 | 说明 |
|--------|------|
| 2001 | 用户名已存在 |
| 2002 | 手机号已注册 |
| 2003 | 用户名或密码错误 |
| 2004 | 验证码错误 |
| 2005 | 验证码已过期 |
| 2006 | 手机号格式错误 |
| 2007 | 用户不存在 |
| 2008 | 账号已被禁用 |

---

## 开发约定

### 1. Token 使用规范
- **Access Token**：有效期 2 小时，用于日常请求
- **Refresh Token**：有效期 7 天，用于刷新 Access Token
- **存储位置**：LocalStorage
- **存储键名**：
  - `wudong_token`
  - `wudong_refresh_token`
  - `wudong_user_info`

### 2. 前端拦截器规范
```typescript
// 请求拦截器
if (token) {
  config.headers.Authorization = `Bearer ${token}`
}

// 响应拦截器
if (response.data.code === 1000) {
  return response.data.data  // 只返回data字段
} else if (response.data.code === 1002) {
  // 未登录，跳转登录页
  removeToken()
  router.push('/login')
} else {
  // 其他错误，提示消息
  ElMessage.error(response.data.message)
  throw new Error(response.data.message)
}
```

### 3. 路由守卫规范
```typescript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})
```

### 4. 后端必须实现的功能
- ✅ JWT Token 生成和验证
- ✅ Token 刷新机制
- ✅ 密码加密存储（bcrypt）
- ✅ 短信验证码发送（集成阿里云或腾讯云）
- ✅ 图形验证码生成（svg-captcha）
- ✅ 手机号格式校验
- ✅ 用户名唯一性校验
- ✅ 密码强度校验（最少6位）

---

## 注意事项

### ⚠️ 重要提醒

1. **不要擅自修改接口路径和参数名**
   - 如需修改，必须通知所有组员
   - 在群里发消息 + 更新此文档

2. **响应格式必须统一**
   - 所有接口返回 `{code, message, data}` 结构
   - 不要返回其他格式

3. **错误码必须使用约定的编码**
   - 不要自己发明新的错误码
   - 新增错误码需在此文档更新

4. **Token 必须放在 Authorization 请求头**
   - 不要放在 URL 参数或 Body 中
   - 格式：`Bearer {token}`

5. **测试数据使用统一账号**
   - 用户名：`test`
   - 密码：`123456`
   - 手机号：`13800138000`

---

## 开发流程

### 新功能开发流程
1. **先约定接口**：在此文档添加接口规范
2. **前端按规范开发**：调用约定好的接口
3. **后端按规范实现**：返回约定好的数据格式
4. **联调测试**：前后端对接测试
5. **提交代码**：提交到各自分支

### 代码整合流程
1. **各自完成模块**：在自己分支开发
2. **本地自测通过**：确保功能正常
3. **提交 PR**：提交 Pull Request 到 develop 分支
4. **代码审查**：组长审查代码
5. **合并代码**：审查通过后合并
6. **集成测试**：测试整合后的功能

---

## 团队分工

### 前端开发
- **成员A**：用户模块（登录、注册、个人中心）
- **成员B**：商城模块（商品列表、详情、购物车）
- **成员C**：社区模块（帖子列表、发布、详情）

### 后端开发
- **成员D**：用户认证（JWT、验证码、短信）
- **成员E**：商城接口（商品、订单）
- **成员F**：社区接口（帖子、评论、点赞）

---

## 联系方式

有任何疑问请在微信群讨论，或联系：
- **组长**：xxx（微信号：xxx）
- **技术负责人**：xxx（微信号：xxx）

---

**最后更新时间**：2026-09-10
**文档版本**：v1.0
