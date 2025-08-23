# Vola.fun 用户认证系统开发文档

## 功能开发总览

| 功能模块     | 功能点           | 开发状态    | 更新时间   |
| ------------ | ---------------- | ----------- | ---------- |
| **认证基础** | Firebase配置     | ✅ 开发完成 | 2025-08-21 |
| **认证基础** | JWT Token管理    | ✅ 开发完成 | 2025-08-21 |
| **认证基础** | Cookie存储机制   | ✅ 开发完成 | 2025-08-21 |
| **认证基础** | 请求拦截器       | ✅ 开发完成 | 2025-08-21 |
| **UI组件**   | 认证弹窗主框架   | ✅ 开发完成 | 2025-08-21 |
| **UI组件**   | 邮箱输入步骤     | ✅ 开发完成 | 2025-08-21 |
| **UI组件**   | 登录表单         | ✅ 开发完成 | 2025-08-21 |
| **UI组件**   | 注册表单         | ✅ 开发完成 | 2025-08-21 |
| **UI组件**   | 欢迎弹窗         | ✅ 开发完成 | 2025-08-21 |
| **认证流程** | Google OAuth登录 | ✅ 开发完成 | 2025-08-21 |
| **认证流程** | 邮箱登录注册逻辑 | ✅ 开发完成 | 2025-08-21 |
| **认证流程** | Token换取机制    | ✅ 开发完成 | 2025-08-21 |
| **认证流程** | Token刷新机制    | ✅ 开发完成 | 2025-08-21 |
| **用户状态** | 登录状态管理     | ✅ 开发完成 | 2025-08-21 |
| **用户状态** | 登出功能         | ✅ 开发完成 | 2025-08-21 |
| **错误处理** | 网络错误Toast    | ✅ 开发完成 | 2025-08-21 |
| **错误处理** | 认证错误处理     | ✅ 开发完成 | 2025-08-21 |

---

## 1. 需求分析

### 1.1 功能点列表

**核心认证功能：**

- ✅ Firebase Google OAuth 登录
- ✅ Firebase 邮箱登录/注册
- ✅ JWT Token 管理（access_token + refresh_token）
- ✅ 惰性 Token 刷新机制
- ✅ 用户登出功能

**UI/UX 交互：**

- ✅ 右上角"Get started"按钮替换现有登录注册按钮
- ✅ 认证弹窗系统（邮箱输入→登录/注册表单）
- ✅ 新用户欢迎弹窗
- ✅ 登录成功后页面刷新
- ✅ 网络错误 Toast 提示

**状态管理：**

- ✅ 登录状态持久化（Cookie）
- ✅ 用户信息状态管理
- ✅ 认证流程状态管理

### 1.2 额外要求

- **环境配置：** 全部连接生产环境
- **语言：** 开发阶段以中文为主
- **存储方案：** 使用 Cookie 存储 tokens
- **错误策略：** 请求失败直接报错，无降级策略
- **弹窗控制：** 环境变量 `NEXT_PUBLIC_SHOW_WELCOME_MODAL=true`

### 1.3 后端接口详情

**基础配置：**

- **Base URL：** `https://api.vola.fun`
- **认证方式：** `Authorization: Bearer <your-jwt-token>`
- **API Key：** `x-vola-key: <your-api-key>`

**接口列表：**

1. **登录接口**

   ```
   POST /api/v1/auth/login
   Headers: Authorization: Bearer <firebase-id-token>
   Response: {
     "success": true,
     "code": "SUCCESS",
     "message": "Login successful",
     "data": {
       "access_token": "...",
       "refresh_token": "...",
       "token_type": "bearer"
     }
   }
   ```

2. **刷新Token接口**

   ```
   POST /api/v1/auth/refresh
   Body: { "refresh_token": "..." }
   Response: {
     "success": true,
     "code": "SUCCESS",
     "message": "Token refresh successful",
     "data": {
       "access_token": "...",
       "refresh_token": "...",
       "token_type": "bearer"
     }
   }
   ```

3. **登出接口**
   ```
   POST /api/v1/auth/logout
   Headers: Authorization: Bearer <access-token>
   Response: {
     "success": true,
     "code": "LOGOUT_SUCCESS",
     "message": "Logout successful",
     "data": null
   }
   ```

---

## 2. 开发方案

### 2.1 技术栈

**前端框架：**

- Next.js 15.5.0 (App Router)
- React 19.1.0
- TypeScript

**状态管理：**

- Jotai (已有) + 新增认证 atoms

**UI组件库：**

- shadcn/ui (已有)
- Tailwind CSS 4
- React Hook Form + Zod

**认证服务：**

- Firebase Authentication v9+
- Firebase Analytics

**网络请求：**

- Axios (已有) + 请求拦截器

**新增依赖：**

```bash
npm install firebase react-hook-form @hookform/resolvers zod js-cookie @types/js-cookie react-hot-toast
```

### 2.2 核心逻辑设计

**2.2.1 认证流程逻辑**

1. **邮箱认证判断逻辑：**
   - 用户输入邮箱 → 使用假密码 `123456789` 尝试 Firebase 登录
   - `auth/user-not-found` → 展示注册表单
   - `auth/wrong-password` → 展示登录表单
   - 其他错误 → 显示错误提示

2. **Google OAuth 流程：**
   - Firebase Google 弹窗登录 → 获取 ID Token → 调用后端换取 JWT → 存储到 Cookie

3. **Token 刷新机制：**
   - Axios 请求拦截器检测 401 响应
   - 自动调用刷新接口获取新 tokens
   - 更新 Cookie 中的 tokens
   - 重试原请求

**2.2.2 状态管理架构**

```typescript
// 认证相关 Atoms
const userAtom = atom<User | null>(null)
const isLoggedInAtom = atom((get) => get(userAtom) !== null)
const authModalAtom = atom<AuthModalState>({ isOpen: false, step: 'email' })
const welcomeModalAtom = atom<boolean>(false)
```

**2.2.3 数据持久化方案**

- **Tokens：** 使用 `js-cookie` 存储到 httpOnly cookie
- **用户状态：** 页面加载时从 cookie 恢复认证状态
- **弹窗状态：** localStorage 记录欢迎弹窗显示状态

### 2.3 重点技术要点

**2.3.1 安全考虑**

- Firebase ID Token 验证
- JWT Token 安全存储（httpOnly cookie）
- 请求拦截器中的 token 刷新竞态条件处理

**2.3.2 用户体验优化**

- 认证弹窗无缝切换
- 登录成功后的页面刷新策略
- 网络错误的友好提示

**2.3.3 错误处理策略**

- Firebase 认证错误的中文化处理
- 网络请求超时和重试机制
- Toast 消息的统一管理

**2.3.4 性能优化**

- Firebase SDK 按需加载
- 认证状态的缓存策略
- 组件懒加载

---

## 3. 开发进度

### 3.1 ~~待规划阶段~~ ✅ 已完成

- ✅ 项目依赖安装和配置
- ✅ Firebase 配置文件创建
- ✅ 基础类型定义
- ✅ 项目结构规划

### 3.2 ~~待开发阶段~~ ✅ 已完成

所有开发阶段都已完成，详见下方开发完成部分。

### 3.3 开发完成

**Phase 1: 基础设施 (v0.1.0) ✅**

- ✅ Firebase 配置和初始化
- ✅ Axios 拦截器配置
- ✅ Cookie 管理工具
- ✅ 基础 Atoms 定义
- ✅ Toast 组件集成

**Phase 2: 认证组件 (v0.2.0) ✅**

- ✅ 认证弹窗主框架
- ✅ 邮箱输入组件
- ✅ 登录表单组件
- ✅ 注册表单组件
- ✅ 欢迎弹窗组件

**Phase 3: 认证逻辑 (v0.3.0) ✅**

- ✅ Firebase Google OAuth 集成
- ✅ 邮箱登录注册逻辑
- ✅ 后端 API 集成
- ✅ Token 管理服务

**Phase 4: 状态管理 (v0.4.0) ✅**

- ✅ 用户状态管理
- ✅ 认证状态持久化
- ✅ 请求拦截器实现
- ✅ Token 刷新机制

**Phase 5: UI集成 (v0.5.0) ✅**

- ✅ Header 组件改造
- ✅ 认证流程集成
- ✅ 错误处理完善
- ✅ 整体测试和优化

---

**文档最后更新：** 2025-08-21  
**当前版本：** v1.0.0 (认证系统完成)  
**下一里程碑：** 功能测试和优化
