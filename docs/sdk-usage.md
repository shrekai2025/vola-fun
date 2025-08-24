# Vola API SDK 使用文档

Vola API SDK 是一个完整的 TypeScript SDK，为 Vola 平台提供了类型安全的 API 访问接口。

## 目录

- [快速开始](#快速开始)
- [核心概念](#核心概念)
- [认证管理](#认证管理)
- [API 服务](#api-服务)
- [错误处理](#错误处理)
- [类型定义](#类型定义)
- [最佳实践](#最佳实践)

## 快速开始

### 导入 SDK

```typescript
import { AuthService, UserService, APIService, BillingService } from '@/lib/api'

// 或者导入单个服务
import { AuthService } from '@/lib/api/services'
```

### 基本使用示例

```typescript
// 用户登录
const loginResult = await AuthService.login({
  email: 'user@example.com',
  password: 'password123',
})

// 获取用户信息
const userInfo = await UserService.getCurrentUser()

// 创建API
const newAPI = await APIService.createAPI({
  name: 'My API',
  description: 'API description',
  category: 'AI',
  // ... 其他字段
})
```

## 核心概念

### API 响应格式

所有 API 调用都返回统一的响应格式：

```typescript
interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  data: T
}
```

### 分页响应

对于需要分页的接口，返回 `PaginatedResponse` 格式：

```typescript
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}
```

## 认证管理

### AuthService

用户认证相关功能：

```typescript
// 登录
const loginResponse = await AuthService.login({
  email: 'user@example.com',
  password: 'password123',
})

// 注册
const registerResponse = await AuthService.register({
  email: 'user@example.com',
  password: 'password123',
  username: 'myusername',
  full_name: 'My Full Name',
})

// 登出
await AuthService.logout()

// 刷新token
const tokenResponse = await AuthService.refreshToken('refresh_token')

// 重置密码
await AuthService.resetPassword('user@example.com')

// 验证重置令牌
const verifyResponse = await AuthService.verifyResetToken('reset_token')

// 确认重置密码
await AuthService.confirmResetPassword({
  token: 'reset_token',
  new_password: 'newpassword123',
})
```

### 自动token管理

SDK 自动处理token的刷新和重试机制。当API调用返回401错误时，SDK会：

1. 自动使用refresh token获取新的access token
2. 重试原始请求
3. 如果refresh失败，清除本地token并抛出错误

## API 服务

### UserService

用户信息管理：

```typescript
// 获取当前用户基本信息
const user = await UserService.getCurrentUser()

// 获取当前用户详细信息（包含支付信息）
const detailedUser = await UserService.getCurrentUserDetailed()

// 获取用户统计信息
const stats = await UserService.getCurrentUserStats()

// 更新用户资料
const updatedUser = await UserService.updateProfile({
  full_name: 'New Name',
  bio: 'Updated bio',
  website: 'https://example.com',
})

// 删除账户
await UserService.deleteAccount()

// 获取其他用户公开信息
const publicProfile = await UserService.getUserProfile('user_id')
```

### AdminService

管理员功能（需要管理员权限）：

```typescript
// 获取用户列表
const userList = await AdminService.getUserList({
  page: 1,
  page_size: 20,
  role: 'USER',
  is_verified: true,
})

// 更新用户信息
await AdminService.updateUser('user_id', {
  is_active: false,
  role: 'PROVIDER',
})

// 验证用户邮箱
await AdminService.verifyUserEmail('user_id')

// 删除用户
await AdminService.deleteUser('user_id')
```

### APIService

API管理功能：

```typescript
// 获取API列表
const apiList = await APIService.getAPIs({
  page: 1,
  page_size: 20,
  category: 'AI',
  search: 'keyword',
})

// 获取API详情
const apiDetail = await APIService.getAPI('api_id')

// 创建API
const newAPI = await APIService.createAPI({
  name: 'My API',
  description: 'API description',
  category: 'AI',
  base_url: 'https://api.example.com',
  pricing_model: 'free',
  // ... 其他字段
})

// 更新API
const updatedAPI = await APIService.updateAPI('api_id', {
  name: 'Updated API Name',
  description: 'Updated description',
})

// 删除API
await APIService.deleteAPI('api_id')

// 获取热门APIs
const popularAPIs = await APIService.getPopularAPIs()

// 获取我的APIs
const myAPIs = await APIService.getMyAPIs()

// 创建API版本
const newVersion = await APIService.createAPIVersion('api_id', {
  version: '2.0',
  changelog: 'Added new features',
  is_active: true,
})
```

### BillingService

账单和使用统计：

```typescript
// 获取账户余额
const balance = await BillingService.getBalance()

// 获取交易记录
const transactions = await BillingService.getTransactions({
  page: 1,
  page_size: 20,
})

// 获取使用记录
const usageRecords = await BillingService.getUsageRecords({
  page: 1,
  page_size: 50,
  start_date: '2024-01-01',
  end_date: '2024-01-31',
})

// 获取使用统计
const usageStats = await BillingService.getUsageStats('2024-01-01', '2024-01-31')

// 获取订阅信息
const subscriptions = await BillingService.getSubscriptions()

// 获取发票列表
const invoices = await BillingService.getInvoices()

// 导出使用数据
const exportData = await BillingService.exportUsageData({
  format: 'csv',
  start_date: '2024-01-01',
  end_date: '2024-01-31',
})

// 获取本月统计
const currentMonthStats = await BillingService.getCurrentMonthStats()
```

### PaymentService

支付相关功能：

```typescript
// 获取支付计划
const plans = await PaymentService.getPlans()

// 获取用户支付信息
const paymentInfo = await PaymentService.getPaymentInfo()

// 创建Stripe支付意向
const stripeIntent = await PaymentService.createStripeIntent({
  amount: 1000,
  currency: 'usd',
  description: 'Payment for service',
})

// 创建Stripe Checkout会话
const checkout = await PaymentService.createStripeCheckout({
  plan_id: 'plan_123',
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel',
})

// 创建一次性支付
const oneTimePayment = await PaymentService.createOneTimePayment(1000, 'One-time payment', {
  order_id: 'order_123',
})
```

### KeyService

API密钥管理：

```typescript
// 获取API密钥列表
const keys = await KeyService.getKeys({
  page: 1,
  page_size: 20,
  is_active: true,
})

// 获取密钥详情
const keyDetail = await KeyService.getKey('key_id')

// 创建新密钥
const newKey = await KeyService.createKey({
  name: 'My API Key',
  description: 'Key for production use',
  rate_limit: 1000,
})

// 更新密钥
const updatedKey = await KeyService.updateKey('key_id', {
  name: 'Updated Key Name',
  rate_limit: 2000,
})

// 重新生成密钥
const regeneratedKey = await KeyService.regenerateKey('key_id')

// 删除密钥
await KeyService.deleteKey('key_id')
```

### FavoriteService

收藏功能：

```typescript
// 获取收藏列表
const favorites = await FavoriteService.getFavorites({
  page: 1,
  page_size: 20,
  resource_type: 'api',
})

// 添加收藏
const favorite = await FavoriteService.addFavorite({
  resource_type: 'api',
  resource_id: 'api_123',
})

// 移除收藏
await FavoriteService.removeFavorite('favorite_id')

// 检查收藏状态
const isFavorite = await FavoriteService.checkFavoriteStatus('api', 'api_123')

// 切换收藏状态
const toggleResult = await FavoriteService.toggleFavorite('api', 'api_123')

// 获取收藏统计
const favoriteStats = await FavoriteService.getFavoriteStats()
```

### GatewayService

API网关代理：

```typescript
// 通用代理请求
const response = await GatewayService.proxyRequest('/external-api/endpoint', {
  method: 'POST',
  body: { data: 'value' },
  headers: { 'Custom-Header': 'value' },
  timeout: 10000,
})

// GET请求代理
const getResponse = await GatewayService.get('/external-api/data')

// POST请求代理
const postResponse = await GatewayService.post('/external-api/create', {
  name: 'New Item',
})

// 检查API健康状态
const healthStatus = await GatewayService.checkAPIHealth('api_slug')

// 批量检查API健康状态
const multipleHealth = await GatewayService.checkMultipleAPIHealth(['api1_slug', 'api2_slug'])

// 带API Key的代理请求
const apiKeyResponse = await GatewayService.proxyWithAPIKey(
  '/external-api/endpoint',
  'your-api-key',
  { method: 'GET' }
)

// 带Bearer Token的代理请求
const tokenResponse = await GatewayService.proxyWithBearerToken(
  '/external-api/endpoint',
  'your-bearer-token',
  { method: 'GET' }
)
```

## 错误处理

### 基本错误处理

```typescript
try {
  const user = await UserService.getCurrentUser()
  console.log(user.data)
} catch (error) {
  if (error.code === 'UNAUTHORIZED') {
    // 处理未授权错误
    console.log('用户未登录')
  } else {
    console.error('请求失败:', error.message)
  }
}
```

### 错误类型

```typescript
interface ApiError {
  code: string
  message: string
  details?: Record<string, string | number | boolean>
}
```

### 常见错误代码

- `UNAUTHORIZED` - 未授权，需要登录
- `FORBIDDEN` - 禁止访问，权限不足
- `NOT_FOUND` - 资源不存在
- `VALIDATION_ERROR` - 数据验证失败
- `RATE_LIMIT_EXCEEDED` - 超出请求限制

## 类型定义

SDK 提供了完整的 TypeScript 类型定义，主要类型包括：

### 用户相关类型

```typescript
interface User {
  id: string
  firebase_uid: string
  email: string
  username: string
  full_name: string
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  is_verified: boolean
  // ... 其他字段
}

type UserRole = 'USER' | 'PROVIDER' | 'ADMIN'
```

### API相关类型

```typescript
interface API {
  id: string
  name: string
  description: string
  category: string
  base_url: string
  pricing_model: 'free' | 'paid' | 'freemium'
  // ... 其他字段
}
```

### 支付相关类型

```typescript
interface PaymentPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  is_popular: boolean
}
```

## 最佳实践

### 1. 错误处理

始终使用 try-catch 包装 API 调用：

```typescript
const handleAPICall = async () => {
  try {
    const result = await UserService.getCurrentUser()
    if (result.success) {
      // 处理成功响应
      console.log(result.data)
    }
  } catch (error) {
    // 处理错误
    console.error('API调用失败:', error)
  }
}
```

### 2. 类型安全

充分利用 TypeScript 类型：

```typescript
// 使用泛型指定返回类型
const apiList = await APIService.getAPIs<API[]>()

// 使用类型断言确保类型安全
const userStats = result.data as UserStats
```

### 3. 缓存策略

对于不经常变化的数据，考虑实现客户端缓存：

```typescript
let cachedPlans: PaymentPlan[] | null = null

const getPlans = async (): Promise<PaymentPlan[]> => {
  if (cachedPlans) {
    return cachedPlans
  }

  const response = await PaymentService.getPlans()
  if (response.success) {
    cachedPlans = response.data
    return response.data
  }

  throw new Error(response.message)
}
```

### 4. 请求取消

对于长时间运行的请求，使用 AbortController：

```typescript
const controller = new AbortController()

// 设置超时
setTimeout(() => controller.abort(), 5000)

try {
  const response = await APIService.getAPIs(
    { page: 1, page_size: 20 },
    { signal: controller.signal }
  )
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('请求已取消')
  }
}
```

### 5. 分页处理

处理分页数据时的常见模式：

```typescript
const loadAllPages = async () => {
  const allItems: API[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await APIService.getAPIs({
      page,
      page_size: 50,
    })

    if (response.success) {
      allItems.push(...response.data)
      hasMore = response.pagination.has_next
      page++
    } else {
      break
    }
  }

  return allItems
}
```

### 6. 环境配置

SDK 支持开发环境调试配置，可以通过修改 `client.ts` 中的 `USE_DIRECT_API` 开关来切换直接API访问或代理模式。

```typescript
// 在 client.ts 中
const USE_DIRECT_API = false // 设置为 true 直接访问后端API
```

## 总结

Vola API SDK 提供了完整的类型安全API访问能力，包括：

- 🔐 自动认证管理
- 📝 完整的TypeScript类型支持
- 🔄 自动token刷新和重试
- 📊 丰富的API服务覆盖
- 🛡️ 统一的错误处理
- 🚀 易于使用的接口设计

通过遵循本文档中的最佳实践，您可以高效、安全地使用 Vola 平台的所有功能。
