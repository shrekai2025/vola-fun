# vola.fun - 面向AI的API市场

vola.fun是一个专为AI应用场景设计的API市场平台，旨在简化API管理、提供统一身份验证和集中化支付。

## 🚀 技术栈

- **框架**: Next.js 14 + TypeScript
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui（原子设计）
- **状态管理**: Jotai（原子化状态管理）
- **HTTP客户端**: axios + SWR
- **认证**: NextAuth.js
- **表单**: React Hook Form + Zod
- **图标**: Lucide React

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   ├── market/            # API市场页面
│   └── page.tsx           # 首页
├── atoms/                  # Jotai状态原子
│   ├── user.ts            # 用户状态
│   └── api.ts             # API相关状态
├── components/             # UI组件（原子设计）
│   ├── atoms/             # 原子组件
│   ├── molecules/         # 分子组件
│   ├── organisms/         # 有机体组件
│   │   └── Header.tsx     # 导航栏
│   ├── templates/         # 模板组件
│   │   └── MainLayout.tsx # 主布局
│   ├── providers/         # Context Providers
│   └── ui/                # shadcn/ui组件
├── config/                 # 配置文件
│   └── auth.ts            # NextAuth配置
├── services/               # API服务
│   └── api.ts             # API调用服务
├── types/                  # TypeScript类型定义
│   └── index.ts           # 主要类型
├── hooks/                  # 自定义Hooks
└── lib/                    # 工具库
    └── utils.ts           # shadcn/ui工具函数
```

## 🏗️ 核心功能架构

### 1. 状态管理（Jotai）

- **用户状态**: 用户信息、登录状态、积分余额、API密钥
- **API状态**: API服务列表、筛选条件、使用记录

### 2. API网关架构

- 用户通过统一的Vola Key调用API
- 请求验证 → 重构请求 → 调用上游API → 返回数据 → 记录日志

### 3. 组件设计（原子设计）

- **Atoms**: Button, Input, Badge等基础组件
- **Molecules**: SearchBar, ApiCard等复合组件
- **Organisms**: Header, ApiList等功能模块
- **Templates**: MainLayout等页面模板

## 🛠️ 开发指南

### 启动开发服务器

```bash
npm run dev
```

### 添加新的UI组件

```bash
npx shadcn@latest add [component-name]
```

### 环境变量配置

复制 `.env.example` 为 `.env.local` 并配置相关变量：

- NextAuth配置
- API基础URL
- Stripe支付密钥
- Firebase认证（可选）

## 📋 下一步开发计划

### 短期目标

1. **用户认证系统**
   - 实现Firebase/其他OAuth登录
   - 用户注册和个人资料管理

2. **API市场功能**
   - API详情页面
   - 搜索和筛选功能
   - 分类管理

3. **用户中心**
   - API密钥管理
   - 使用记录和统计
   - 积分充值和订阅

### 中期目标

4. **API调用功能**
   - API代理网关集成
   - 请求/响应处理
   - 错误处理和重试机制

5. **支付系统**
   - Stripe集成
   - 订阅管理
   - 计费系统

### 长期目标

6. **高级功能**
   - API性能监控
   - 使用分析
   - API供应商后台

## 🎯 核心价值主张

1. **简化API管理**: 统一的API密钥，简化身份验证流程
2. **集中化支付**: 单一支付入口，统一计费管理
3. **面向AI优化**: 专为AI应用场景设计的API生态

## 🔧 开发注意事项

- 所有API调用都应通过 `services/api.ts` 进行
- 使用Jotai atoms管理全局状态
- 遵循原子设计原则构建UI组件
- 使用TypeScript确保类型安全
- 所有表单使用React Hook Form + Zod验证

---

项目已成功初始化，开发服务器运行在 http://localhost:3000
