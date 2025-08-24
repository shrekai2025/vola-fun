# vola.fun - 面向AI的API市场

vola.fun是一个专为AI应用场景设计的API市场平台，旨在简化API管理、提供统一身份验证和集中化支付。

## 🚀 技术栈

- **框架**: Next.js 15.5.0 + TypeScript 5
- **运行时**: React 19.1.0
- **样式**: Tailwind CSS 4 + CSS Variables
- **UI组件**: shadcn/ui (Radix UI)
- **状态管理**: Jotai 原子化状态
- **HTTP客户端**: Axios + 统一数据管理器 (DataManager)
- **认证**: Firebase Authentication v12 + NextAuth.js 4
- **表单**: React Hook Form + Zod 验证
- **图标**: Lucide React
- **国际化**: React i18next + 浏览器语言检测
- **动画**: Framer Motion + 自定义动画
- **工具链**: ESLint 9 + Prettier 3 + TypeScript 严格模式

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router (v15)
│   ├── api/               # API路由 (NextAuth + 代理)
│   ├── apis/              # API管理页面
│   ├── admin/             # 管理后台
│   ├── profile/           # 用户资料
│   ├── pricing/           # 价格页面
│   └── page.tsx           # 首页
├── atoms/                  # Jotai状态原子
│   ├── user.ts            # 用户状态
│   ├── auth.ts            # 认证状态
│   └── api.ts             # API相关状态
├── components/             # UI组件系统
│   ├── ui/                # shadcn/ui基础组件
│   ├── auth/              # 认证相关组件
│   ├── sections/          # 页面区块组件
│   ├── organisms/         # 复合功能组件
│   ├── providers/         # Context Providers
│   │   ├── JotaiProvider.tsx    # 状态管理
│   │   ├── ThemeProvider.tsx    # 主题系统
│   │   ├── I18nextProvider.tsx  # 国际化
│   │   └── LanguageProvider.tsx # 语言切换
│   └── templates/         # 页面模板
├── lib/                   # 核心库
│   ├── api/               # API服务层
│   │   ├── client.ts      # Axios配置
│   │   ├── config.ts      # API配置
│   │   ├── hooks/         # API Hooks
│   │   ├── services/      # 业务服务
│   │   └── types.ts       # API类型
│   ├── data-manager.ts    # 统一数据管理器
│   ├── firebase-config.ts # Firebase配置
│   ├── auth-config.ts     # NextAuth配置
│   └── i18n-config.ts     # 国际化配置
├── hooks/                 # 自定义Hooks
│   ├── auth/              # 认证相关
│   ├── data/              # 数据管理
│   └── ui/                # UI交互
├── types/                 # TypeScript类型定义
│   ├── api/               # API类型
│   ├── auth.ts            # 认证类型
│   ├── common/            # 通用类型
│   ├── data/              # 数据类型
│   ├── hooks/             # Hook类型
│   └── ui/                # UI类型
├── utils/                 # 工具函数
├── constants/             # 常量定义
└── styles/                # 全局样式
    └── globals.css        # CSS变量 + 主题
```

## 🏗️ 核心功能架构

### 1. 数据管理系统 (DataManager)

- **统一数据源**: 所有API调用通过DataManager管理
- **智能缓存**: 用户信息5分钟缓存，API数据页面级强制刷新
- **请求去重**: 防止并发重复请求，自动合并相同请求
- **订阅更新**: 数据变化实时通知组件

### 2. 状态管理（Jotai）

- **用户状态**: 用户信息、登录状态、认证模态框
- **API状态**: API服务列表、筛选条件、使用记录
- **UI状态**: 主题、语言、加载状态

### 3. 认证架构 (Firebase + NextAuth)

```
用户登录 → Firebase Auth → 获取ID Token → 后端验证 → 返回JWT → Cookie存储
     ↓
自动刷新 → Axios拦截器 → 检测401 → 刷新Token → 重试请求
```

### 4. 国际化系统

- **语言支持**: 英文(默认) + 中文
- **检测机制**: 浏览器语言 → 用户偏好 → 默认英文
- **存储策略**: localStorage持久化用户偏好

### 5. API网关架构

- 用户通过统一的Vola Key调用API
- 请求验证 → 重构请求 → 调用上游API → 返回数据 → 记录日志

### 6. 组件设计系统

- **UI层**: shadcn/ui基础组件 + Tailwind CSS 4
- **业务层**: 功能区块组件 + 页面模板
- **提供者**: 状态管理 + 主题 + 国际化提供者
- **主题系统**: CSS变量 + 明暗主题切换

## 🛠️ 开发指南

### 开发环境设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 代码质量检查
npm run lint            # ESLint检查
npm run format          # Prettier格式化
npm run type-check      # TypeScript类型检查
npm run code-quality    # 全面质量检查
```

### 添加新的UI组件

```bash
# 从shadcn/ui添加组件
npx shadcn@latest add [component-name]

# 常用组件
npx shadcn@latest add button dialog card input select
```

### 环境变量配置

复制 `.env.example` 为 `.env.local` 并配置：

```env
# NextAuth配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# API配置
NEXT_PUBLIC_API_BASE_URL=https://api.vola.fun

# Firebase配置
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# 支付配置（可选）
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

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

## 🔧 开发规范与注意事项

### 核心开发规范

- **数据获取**: 必须使用统一数据管理器 (`lib/data-manager.ts`)
- **状态管理**: 全局状态使用Jotai，组件状态使用useState
- **类型安全**: 所有代码使用TypeScript严格模式
- **表单处理**: React Hook Form + Zod验证
- **国际化**: 所有用户可见文本使用翻译系统，禁止硬编码
- **UI组件**: 优先使用现有组件，次选shadcn/ui，最后自定义

### 页面级数据刷新策略

```typescript
// 页面组件启用强制刷新
const { data, loading, error, refresh } = useMarketAPIList(params, true)

// 页面内操作使用缓存，响应迅速
// 仅页面访问时获取最新数据
```

### 质量保证工具

- **ESLint 9**: 代码规范 + 未使用导入检测
- **TypeScript 5**: 严格类型检查
- **Prettier 3**: 代码格式化
- **shadcn/ui**: 一致的UI组件库

### 项目特色功能

- **智能缓存**: 避免重复请求，提升性能
- **请求去重**: 防止并发重复API调用
- **自动认证**: Token刷新 + 请求重试
- **主题系统**: CSS变量 + 明暗模式
- **国际化**: 中英双语支持
- **响应式**: 移动端优先设计

---

**开发服务器**: http://localhost:3000  
**API文档**: 参见 `/docs/api-documentation.md`  
**开发规范**: 参见 `/docs/development-standards.md`
