# Vola.fun 开发规范

_确保项目在技术架构、代码规范和视觉设计方面的统一性和一致性_

## 📋 目录

1. [项目概述](#项目概述)
2. [系统架构](#系统架构)
3. [核心技术栈](#核心技术栈)
4. [数据管理系统](#数据管理系统)
5. [认证系统](#认证系统)
6. [视觉设计系统](#视觉设计系统)
7. [多语言系统](#多语言系统)
8. [组件开发规范](#组件开发规范)
9. [质量保证](#质量保证)
10. [开发流程](#开发流程)

---

## 🎯 项目概述

### 核心定位

vola.fun是一个专为AI应用场景设计的API市场平台，旨在简化API管理、提供统一身份验证和集中化支付。

### 核心价值主张

1. **简化API管理**: 统一的API密钥，简化身份验证流程
2. **集中化支付**: 单一支付入口，统一计费管理
3. **面向AI优化**: 专为AI应用场景设计的API生态

---

## 🏗️ 系统架构

### 前端架构图

```
┌─────────────────────────────────────────────────────────────┐
│                     Vola.fun 前端架构                        │
├─────────────────────────────────────────────────────────────┤
│  UI层                                                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  页面组件    │ │  组件库     │ │  样式系统    │           │
│  │  (Pages)    │ │ (shadcn/ui) │ │ (Tailwind)  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  业务逻辑层                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  状态管理    │ │  数据管理    │ │  认证系统    │           │
│  │  (Jotai)    │ │(DataManager)│ │ (Firebase)  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
├─────────────────────────────────────────────────────────────┤
│  数据层                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  API服务    │ │  缓存系统    │ │  本地存储    │           │
│  │  (Axios)    │ │  (内存)     │ │  (Cookie)   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### 核心模块关系

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  用户界面     │────│  数据管理器   │────│  API服务     │
│  (UI Layer)  │    │ (DataManager)│    │ (Services)   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                    │                   │
        │                    │                   │
        ▼                    ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  状态管理     │    │  缓存层       │    │  认证系统     │
│  (Jotai)     │    │  (Cache)     │    │ (Firebase)   │
└──────────────┘    └──────────────┘    └──────────────┘
```

### 文件组织架构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── apis/              # API管理页面
│   ├── profile/           # 用户资料页面
│   └── admin/             # 管理后台页面
├── components/             # 组件系统
│   ├── ui/                # 基础UI组件 (shadcn/ui)
│   ├── auth/              # 认证相关组件
│   ├── sections/          # 页面区块组件
│   ├── organisms/         # 复合功能组件
│   ├── providers/         # Context提供者
│   └── templates/         # 页面模板
├── lib/                   # 核心库
│   ├── api/               # API服务层
│   ├── data-manager.ts    # 统一数据管理器
│   ├── firebase-config.ts # Firebase配置
│   └── i18n-config.ts     # 国际化配置
├── hooks/                 # 自定义Hooks
│   ├── auth/              # 认证相关Hooks
│   ├── data/              # 数据获取Hooks
│   └── ui/                # UI交互Hooks
├── atoms/                 # Jotai状态原子
├── types/                 # TypeScript类型定义
├── utils/                 # 工具函数
└── constants/             # 常量定义
```

---

## 🛠️ 核心技术栈

### 前端框架

- **框架**: Next.js 15.5.0 (App Router)
- **语言**: TypeScript (严格模式)
- **样式**: Tailwind CSS 4
- **运行时**: React 19.1.0

### UI组件和样式

- **组件库**: shadcn/ui (原子设计模式)
- **图标**: Lucide React
- **CSS方案**: Tailwind CSS + CSS Variables
- **主题系统**: Dark/Light Mode

### 状态管理

- **全局状态**: Jotai (原子化状态管理)
- **数据管理**: 统一数据管理器 (DataManager)
- **表单状态**: React Hook Form + Zod

### 网络和认证

- **HTTP客户端**: Axios + 拦截器
- **认证系统**: Firebase Authentication v9+
- **数据缓存**: 内存缓存 + localStorage
- **Token管理**: JWT + Cookie 存储

### 开发工具

```bash
# 添加新的UI组件
npx shadcn@latest add [component-name]

# 核心依赖
npm install jotai axios firebase react-hook-form @hookform/resolvers zod
npm install js-cookie @types/js-cookie react-hot-toast lucide-react
```

---

## 🗄️ 数据管理系统

### DataManager 架构设计

#### 核心设计原则

- **单一数据源**: 所有API调用通过DataManager统一管理
- **智能缓存**: 避免重复请求，提升性能
- **请求去重**: 并发请求自动合并
- **订阅更新**: 数据变化实时通知组件

#### 核心机制

```typescript
class DataManager {
  // 缓存层：避免重复网络请求
  private cache = new Map<string, CacheEntry<any>>()

  // 请求去重：防止并发重复请求
  private pendingRequests = new Map<string, Promise<any>>()

  // 订阅机制：数据变化实时通知
  private subscribers = new Map<string, Set<Function>>()
}
```

### 缓存策略配置

| 数据类型    | 缓存策略       | 说明                                   |
| ----------- | -------------- | -------------------------------------- |
| 用户信息    | 5分钟缓存      | 除非身份验证失效或手动登出             |
| 用户API列表 | 页面级强制刷新 | 页面访问时总是最新，页面内操作使用缓存 |
| 市场API列表 | 页面级强制刷新 | 页面访问时总是最新，页面内操作使用缓存 |
| API详情     | 页面级强制刷新 | 页面访问时总是最新，页面内操作使用缓存 |

### 统一Hooks接口

```typescript
// 推荐使用的数据获取Hooks (启用页面级强制刷新)
import { useUser, useUserAPIList, useMarketAPIList, useAPIDetail } from '@/hooks/useUnifiedData'

// 页面级强制刷新用法
const { data, loading, error, refresh } = useMarketAPIList(params, true) // pageLevelRefresh = true
const { data, loading, error, refresh } = useUserAPIList(params, true) // pageLevelRefresh = true

// 兼容性Hook (逐步迁移)
import { useUnifiedUserCache } from '@/hooks/useUnifiedData'
```

### 页面级强制刷新策略

#### 触发时机

- ✅ **URL直接访问**: 用户在地址栏输入URL
- ✅ **导航菜单点击**: 点击导航栏链接
- ✅ **浏览器前进/后退**: 浏览器历史记录导航
- ✅ **页面刷新**: F5或刷新按钮
- ❌ **页面内状态变化**: 搜索、筛选、分页等操作

#### 实现原理

```typescript
// 页面组件启用页面级强制刷新
export default function APIMarketPage() {
  // pageLevelRefresh = true 确保页面挂载时获取最新数据
  const { data, loading, error, refresh } = useMarketAPIList(params, true)

  // 页面内的搜索、筛选等操作会使用缓存，响应迅速
  // 只有手动点击刷新按钮时才会强制获取最新数据
}
```

---

## 🔐 认证系统

### 认证架构

```
用户登录 → Firebase Auth → 获取ID Token → 后端验证 → 返回JWT Token → Cookie存储
     ↓
自动刷新机制 → Axios拦截器 → 检测401 → 刷新Token → 重试请求
```

### 核心功能模块

#### 认证状态管理

```typescript
// 认证相关 Atoms
const userAtom = atom<User | null>(null)
const isLoggedInAtom = atom((get) => get(userAtom) !== null)
const authModalAtom = atom<AuthModalState>({ isOpen: false, step: 'email' })
const welcomeModalAtom = atom<boolean>(false)
```

#### Token管理机制

- **存储方案**: httpOnly Cookie + 双Token机制
- **刷新策略**: 请求拦截器自动检测401并刷新
- **安全考虑**: Firebase ID Token验证 + JWT安全存储

#### 认证流程

1. **邮箱认证判断逻辑**:
   - 用户输入邮箱 → 使用假密码尝试Firebase登录
   - `auth/user-not-found` → 展示注册表单
   - `auth/wrong-password` → 展示登录表单

2. **Google OAuth流程**:
   - Firebase Google弹窗登录 → 获取ID Token → 调用后端换取JWT → 存储到Cookie

3. **Token刷新机制**:
   - Axios请求拦截器检测401响应
   - 自动调用刷新接口获取新tokens
   - 更新Cookie中的tokens并重试原请求

### API接口规范

**基础配置**:

- **Base URL**: `https://api.vola.fun`
- **认证方式**: `Authorization: Bearer <your-jwt-token>`

**核心接口**:

```typescript
// 登录接口
POST /api/v1/auth/login
Headers: Authorization: Bearer <firebase-id-token>
Response: {
  "data": {
    "access_token": "...",
    "refresh_token": "...",
    "token_type": "bearer"
  }
}

// 刷新Token接口
POST /api/v1/auth/refresh
Body: { "refresh_token": "..." }

// 登出接口
POST /api/v1/auth/logout
Headers: Authorization: Bearer <access-token>
```

---

## 🎨 视觉设计系统

### 设计理念

- **理性清晰**: 以大量中性色平衡活力黄色 `#FFB800`
- **60-30-10法则**: 60%中性色 + 30%辅助色 + 10%主题色
- **层次分明**: 通过颜色深浅构建清晰的视觉层次
- **可访问性**: 对比度至少4.5:1，符合WCAG标准

### 主题系统

#### CSS变量定义

```css
/* 在 globals.css 中定义 */
:root {
  --primary: #ffb800; /* 主题色 */
  --background: #ffffff; /* 背景色 */
  --foreground: #212121; /* 主文本 */
  --muted: #f5f5f5; /* 柔和背景 */
  --muted-foreground: #616161; /* 次要文本 */
  --card: #ffffff; /* 卡片背景 */
  --border: #e0e0e0; /* 边框色 */
}

.dark {
  --primary: #ffb800; /* 主题色保持一致 */
  --background: #121212; /* 深色背景 */
  --foreground: #e0e0e0; /* 亮色文本 */
  --muted: #1e1e1e; /* 深色柔和背景 */
  --muted-foreground: #bdbdbd; /* 深色次要文本 */
  --card: #1e1e1e; /* 深色卡片 */
  --border: #424242; /* 深色边框 */
}
```

### 核心配色规范

#### 主色系 (Primary)

- **主色**: `#FFB800` - CTA按钮、链接、图标、选中状态
- **主色浅**: `#FFE082` - Hover状态、标签背景
- **主色深**: `#E6A600` - Active状态

#### 功能色系 (Semantic)

- **成功**: `#2E7D32` (亮) / `#66BB6A` (暗)
- **错误**: `#C62828` (亮) / `#EF5350` (暗)
- **警告**: `#FF8F00` (亮) / `#FFA726` (暗)
- **信息**: `#0277BD` (亮) / `#42A5F5` (暗)

### 加载状态设计

#### 骨架屏规范

```css
/* 基础骨架屏样式 */
.skeleton {
  @apply animate-pulse rounded-md bg-muted/60 dark:bg-muted/40;
  @apply relative overflow-hidden;
  @apply before:absolute before:inset-0 before:-translate-x-full;
  @apply before:animate-[shimmer_2s_infinite];
  @apply before:bg-gradient-to-r before:from-transparent;
  @apply before:via-white/20 dark:before:via-white/10 before:to-transparent;
}

/* 闪光动画 */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

#### 加载状态层级

1. **页面级**: 骨架屏网格 (9个卡片)
2. **组件级**: 单个组件骨架屏
3. **按钮级**: 加载旋转图标 + 禁用状态

---

## 🌍 多语言系统

### 语言支持

- **默认语言**: 英文 (en)
- **支持语言**: 中文 (zh)
- **检测机制**: 浏览器语言 → 用户偏好 → 默认英文

### 语言配置

```typescript
// 支持的语言类型
export type SupportedLanguage = 'en' | 'zh'

// 语言配置
export const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  zh: { name: '中文', flag: '🇨🇳' },
} as const
```

### 翻译系统结构

```typescript
interface Translations {
  common: {
    loading: string
    verifying: string
    error: string
    success: string
    // ...
  }
  nav: {
    docs: string
    pricing: string
    // ...
  }
  home: {
    title: string
    description: string
    // ...
  }
  // ... 其他模块
}
```

### 使用规范

```typescript
// 在组件中使用翻译
import { useTranslation } from '@/components/providers/LanguageProvider'

function MyComponent() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t.common.loading}</h1>
      <p>{t.home.description}</p>
    </div>
  )
}
```

### 存储策略

- **用户偏好**: localStorage ('language')
- **自动检测**: navigator.language
- **fallback**: 英文作为默认语言

---

## 🧩 组件开发规范

### 原子设计架构

- **Atoms**: Button, Input, Badge等基础组件
- **Molecules**: SearchBar, ApiCard等复合组件
- **Organisms**: Header, ApiList等功能模块
- **Templates**: MainLayout等页面模板

### 核心开发规范

#### UI组件使用优先级

1. **首选**: 使用现有的UI组件 (`components/ui`)
   - 优先检查项目中已有的基础组件
   - 保持视觉风格和交互的一致性

2. **次选**: 从 shadcn/ui 安装新组件

   ```bash
   npx shadcn@latest add [component-name]
   ```

   - 当现有组件无法满足需求时
   - 确保与项目主题系统兼容

3. **最后**: 自定义开发新组件
   - 仅在前两种方案都无法满足需求时
   - 需遵循项目的设计系统规范

#### 文案国际化规范

所有用户界面文本内容**严禁硬编码**，必须通过国际化系统管理：

```typescript
// ❌ 错误示例 - 硬编码文本
const submitButton = <Button>提交</Button>
const errorMessage = "请输入有效的邮箱地址"

// ✅ 正确示例 - 使用i18n
const { t } = useTranslation()
const submitButton = <Button>{t.common.submit}</Button>
const errorMessage = t.form.validation.invalidEmail
```

#### 项目结构组织规范

避免将所有代码集中在单一目录，按功能模块合理分类：

- **自定义Hooks**: 统一放置在 `hooks/` 目录
- **类型定义**: 组织在 `types/` 或 `interfaces/` 目录
- **常量配置**: 集中管理在 `constants/` 目录
- **业务组件**: 按功能领域分类在 `components/` 的子目录中

```
src/
├── hooks/              # 自定义Hooks
│   ├── auth/          # 认证相关
│   ├── data/          # 数据管理
│   └── ui/            # UI交互
├── types/             # TypeScript类型定义
├── constants/         # 常量定义
└── components/        # 组件按功能分类
```

#### 文件复杂度控制

- **单文件代码行数上限**: 800行
- **超出限制时必须进行拆分重构**:
  - 提取独立的工具函数
  - 分离业务逻辑和展示逻辑
  - 拆分大型组件为更小的子组件
  - 将复杂的状态逻辑提取为自定义Hooks

**拆分策略示例**:

```typescript
// 原始大文件 (>800行)
// UserProfilePage.tsx

// 拆分后
// UserProfilePage.tsx (主文件 <300行)
// hooks/useUserProfile.ts (业务逻辑)
// components/UserProfileForm.tsx (表单组件)
// components/UserAvatarUpload.tsx (头像上传)
// utils/userProfileValidation.ts (验证逻辑)
```

### 组件开发规则

#### 基础规范

```typescript
// 1. 使用TypeScript严格模式
interface ComponentProps {
  title: string
  description?: string
  onClick?: () => void
}

// 2. 使用统一数据管理
import { useUser, useMarketAPIList } from '@/hooks/useUnifiedData'

// 3. 国际化支持 - 必须使用，不能硬编码文本
import { useTranslation } from '@/components/providers/LanguageProvider'

// 4. 样式使用Tailwind + CSS变量
className = 'bg-background text-foreground border-border'
```

#### 状态管理

```typescript
// 全局状态使用Jotai
import { atom } from 'jotai'

// 用户状态原子
export const userAtom = atom<User | null>(null)
export const isLoggedInAtom = atom((get) => !!get(userAtom))

// 表单状态使用React Hook Form + Zod
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
```

#### 错误处理

```typescript
// 统一错误处理模式
try {
  const data = await apiCall()
  setData(data)
} catch (error) {
  const message = error instanceof Error ? error.message : '操作失败'
  toast.error(message)
} finally {
  setLoading(false)
}
```

### UI固定风格

#### 卡片设计

```typescript
<Card className="hover:shadow-lg transition-shadow cursor-pointer group">
  <CardHeader className="pb-3">
    {/* 标题区域 */}
  </CardHeader>
  <CardContent>
    {/* 内容区域 */}
  </CardContent>
</Card>
```

#### 按钮规范

- **主要按钮**: `variant="default"` 使用主题色
- **次要按钮**: `variant="outline"` 边框样式
- **危险按钮**: `variant="destructive"` 错误色
- **加载状态**: 禁用 + 旋转图标

---

## 🔍 质量保证

### 开发规范

- **数据获取**: 必须使用统一数据管理器 (DataManager)
- **状态管理**: 全局状态使用Jotai，组件状态使用useState
- **类型安全**: 所有代码使用TypeScript严格模式
- **表单验证**: 使用React Hook Form + Zod验证
- **国际化**: 所有用户可见文本使用翻译系统

### 性能优化

- **智能缓存**: 用户信息5分钟缓存，API数据页面级强制刷新
- **请求去重**: 防止并发重复请求，智能合并相同请求
- **页面级刷新**: 页面访问时总是最新，页面内操作使用缓存
- **组件优化**: 使用React.memo、useMemo、useCallback优化渲染
- **懒加载**: 大组件使用dynamic import

### 错误处理

- **网络错误**: 统一Toast提示 + 重试机制
- **认证错误**: 自动Token刷新 + 登录引导
- **表单错误**: Zod验证 + 错误状态高亮
- **加载状态**: 骨架屏 + 优雅降级

### Hook设计规范

- **避免状态循环**: 使用独立useState而非复合状态对象
- **依赖数组**: 仅包含原始值，避免函数引用造成循环
- **状态分离**: data、loading、error分别管理，避免setState嵌套
- **函数稳定**: useCallback依赖最小化，避免不必要的重新创建

```typescript
// ❌ 错误模式 - 状态循环
const [state, setState] = useState({ data: null, refresh: () => {} })
useEffect(() => {
  setState((prev) => ({ ...prev, refresh })) // 会导致循环
}, [refresh])

// ✅ 正确模式 - 状态分离
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
const refresh = useCallback(async () => {
  setLoading(true)
  // ... 数据获取逻辑
}, [params]) // 只依赖必要的原始值
```

#### 请求参数稳定化（防抖动、防重复请求）

- **问题**: 在依赖数组中直接使用对象字面量（如查询参数）会每次渲染创建新引用，导致Effect重复执行、产生多次请求与页面频闪。
- **规范**: 所有作为Hook依赖或传入数据Hook的"参数对象"，必须用`useMemo`稳定化；或改用`useRef`持久化。
- **示例**:

```tsx
// ✅ 正确：用 useMemo 稳定化
const queryParams = useMemo(
  () => ({
    page: 1,
    page_size: 50,
    sort_by: 'created_at' as const,
    sort_order: 'desc' as const,
  }),
  []
)

const { data, loading } = useUserAPIList(queryParams, true)

// ❌ 错误：每次渲染都创建新对象，导致重复请求
// const { data, loading } = useUserAPIList({ page: 1, page_size: 50, sort_by: 'created_at', sort_order: 'desc' }, true)
```

### 调试工具

```typescript
// 数据管理器调试
console.log(dataManager.getCacheState('user-info'))
dataManager.clearCache('user-apis')

// 开发环境监控日志
📦 [DataManager] 缓存命中: user-info
🔄 [DataManager] 发起新请求: user-apis
⏳ [DataManager] 等待进行中的请求: market-apis
```

### 代码质量

- **ESLint**: 代码规范检查
- **TypeScript**: 类型检查
- **组件测试**: 关键功能组件测试
- **E2E测试**: 核心用户流程测试

---

## 🚀 开发流程

### 环境设置

```bash
# 克隆项目
git clone [repository-url]
cd vola-fun

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 配置必要的API密钥

# 启动开发服务器
npm run dev
```

### 日常开发

```bash
# 添加新的UI组件
npx shadcn@latest add [component-name]

# 运行类型检查
npm run type-check

# 运行代码检查
npm run lint

# 构建项目
npm run build
```

### 新功能开发检查清单

- [ ] 使用统一数据管理器获取数据
- [ ] API数据页面启用页面级强制刷新 (`pageLevelRefresh = true`)
- [ ] 添加手动刷新按钮给用户主动控制权
- [ ] 添加TypeScript类型定义
- [ ] 实现国际化翻译
- [ ] 添加骨架屏加载状态
- [ ] 适配明暗主题
- [ ] 添加错误处理
- [ ] 测试响应式布局
- [ ] 验证可访问性标准

### Git工作流程

```bash
# 创建功能分支
git checkout -b feature/new-feature

# 提交代码
git add .
git commit -m "feat: add new feature"

# 推送并创建PR
git push origin feature/new-feature
```

---

**文档版本**: v1.0.0  
**最后更新**: 2025-08-24  
**维护者**: Vola.fun 开发团队
