# Vola.fun 研发规则指南

*确保项目在技术和视觉方面的统一性和一致性*

## 📋 目录

1. [项目概述](#项目概述)
2. [核心技术栈](#核心技术栈)
3. [统一数据管理](#统一数据管理)
4. [视觉设计系统](#视觉设计系统)
5. [多语言系统](#多语言系统)
6. [组件开发规范](#组件开发规范)
7. [质量保证](#质量保证)

---

## 🎯 项目概述

### 核心定位
vola.fun是一个专为AI应用场景设计的API市场平台，旨在简化API管理、提供统一身份验证和集中化支付。

### 核心价值主张
1. **简化API管理**: 统一的API密钥，简化身份验证流程
2. **集中化支付**: 单一支付入口，统一计费管理
3. **面向AI优化**: 专为AI应用场景设计的API生态

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

## 🏗️ 统一数据管理

### 数据管理架构

#### 核心设计原则
- **单一数据源**: 所有API调用通过DataManager统一管理
- **智能缓存**: 避免重复请求，提升性能
- **请求去重**: 并发请求自动合并
- **订阅更新**: 数据变化实时通知组件

#### DataManager核心机制
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
| 数据类型 | 缓存策略 | 说明 |
|---------|----------|------|
| 用户信息 | 5分钟缓存 | 除非身份验证失效或手动登出 |
| 用户API列表 | 页面级强制刷新 | 页面访问时总是最新，页面内操作使用缓存 |
| 市场API列表 | 页面级强制刷新 | 页面访问时总是最新，页面内操作使用缓存 |
| API详情 | 页面级强制刷新 | 页面访问时总是最新，页面内操作使用缓存 |

### 统一Hooks接口
```typescript
// 推荐使用的数据获取Hooks (启用页面级强制刷新)
import { useUser, useUserAPIList, useMarketAPIList, useAPIDetail } from '@/hooks/useUnifiedData'

// 页面级强制刷新用法
const { data, loading, error, refresh } = useMarketAPIList(params, true) // pageLevelRefresh = true
const { data, loading, error, refresh } = useUserAPIList(params, true)   // pageLevelRefresh = true

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

### 性能优化效果
- **页面访问**: 总是获取最新数据，保证实时性
- **页面内操作**: 使用缓存，快速响应
- **用户信息**: 5分钟缓存，减少90%验证请求
- **并发控制**: 智能请求去重，避免重复调用

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
  --primary: #FFB800;           /* 主题色 */
  --background: #FFFFFF;        /* 背景色 */
  --foreground: #212121;        /* 主文本 */
  --muted: #F5F5F5;            /* 柔和背景 */
  --muted-foreground: #616161;  /* 次要文本 */
  --card: #FFFFFF;             /* 卡片背景 */
  --border: #E0E0E0;           /* 边框色 */
}

.dark {
  --primary: #FFB800;           /* 主题色保持一致 */
  --background: #121212;        /* 深色背景 */
  --foreground: #E0E0E0;        /* 亮色文本 */
  --muted: #1E1E1E;            /* 深色柔和背景 */
  --muted-foreground: #BDBDBD;  /* 深色次要文本 */
  --card: #1E1E1E;             /* 深色卡片 */
  --border: #424242;           /* 深色边框 */
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
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
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
  zh: { name: '中文', flag: '🇨🇳' }
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

// 3. 国际化支持
import { useTranslation } from '@/components/providers/LanguageProvider'

// 4. 样式使用Tailwind + CSS变量
className="bg-background text-foreground border-border"
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
  setState(prev => ({ ...prev, refresh })) // 会导致循环
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
- **规范**: 所有作为Hook依赖或传入数据Hook的“参数对象”，必须用`useMemo`稳定化；或改用`useRef`持久化。
- **示例**:

```tsx
// ✅ 正确：用 useMemo 稳定化
const queryParams = useMemo(() => ({
  page: 1,
  page_size: 50,
  sort_by: 'created_at' as const,
  sort_order: 'desc' as const,
}), [])

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

**文档版本：** v4.1.0  
**最后更新：** 2025-08-23  
**维护者：** Vola.fun 开发团队  
**重要更新：** 修复Hook循环依赖问题，完善React设计规范

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
