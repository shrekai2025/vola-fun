# 🔍 API创建功能调试指南

## 🚀 当前状态：直接请求模式
**已启用直接请求后端API，跳过代理层以排查问题**

- ✅ **直接请求**: `https://api.vola.fun/api/v1/apis`
- ❌ **跳过代理**: 不使用 `/api/proxy/...` 路由
- 🎯 **目的**: 确定问题是否出在代理层

## 问题描述
POST请求在到达后端时可能被错误地转换为GET请求。

## 🚨 可能的原因（按概率排序）

### 1. 重定向问题 (最可能)
- 后端返回301/302重定向
- 浏览器自动将POST改为GET进行跟随
- **检查方法**: Network面板查看是否有重定向状态码

### 2. 认证令牌刷新问题
- 401响应触发令牌刷新
- 重试时`originalRequest.method`丢失
- **检查方法**: 控制台查看是否有401错误和令牌刷新日志

### 3. CORS预检请求问题
- OPTIONS预检请求处理不当
- 某些中间件fallback到GET
- **检查方法**: Network面板查看OPTIONS请求

### 4. URL路径问题
- 缺少或多余的尾部斜杠
- 触发路径重定向
- **检查方法**: 对比原始URL和最终URL

## 📊 调试步骤

### Step 1: 打开浏览器调试工具
1. 按F12打开开发者工具
2. 切换到**Network**面板
3. ✅ 勾选 **"Preserve log"** (保留日志)
4. ✅ 勾选 **"Disable cache"** (禁用缓存)

### Step 2: 执行API创建测试
1. 访问 `/admin2025` 页面
2. 点击 "Create New API" 按钮
3. 填写表单（使用测试数据）：
   ```json
   {
     "name": "Test Weather API",
     "slug": "test-weather-api",
     "short_description": "测试天气API服务",
     "category": "data",
     "base_url": "https://api.myweather.com"
   }
   ```
4. 点击"创建API"按钮

### Step 3: 分析Network面板
查找以下请求序列：

#### 🔍 直接请求模式 - 正常情况（期望）:
1. `OPTIONS https://api.vola.fun/api/v1/apis` - **Status: 200** (CORS预检)
2. `POST https://api.vola.fun/api/v1/apis` - **Status: 200/201** (创建)

#### 🚨 直接请求模式 - CORS问题:
1. `OPTIONS https://api.vola.fun/api/v1/apis` - **Status: Failed** ❌ (CORS预检失败)
2. 无POST请求（被浏览器阻止）

#### 🚨 直接请求模式 - 认证问题:
1. `POST https://api.vola.fun/api/v1/apis` - **Status: 401** ⚠️
2. `POST https://api.vola.fun/api/v1/auth/refresh` - **Status: 200**
3. `GET https://api.vola.fun/api/v1/apis` - **Status: xxx** ❌ (重试变成GET)

#### 📊 对比分析：
- **如果直接请求成功** → 问题在代理层
- **如果直接请求也变GET** → 问题在axios拦截器或认证逻辑  
- **如果出现CORS错误** → 后端CORS配置问题，但能排除代理问题

### Step 4: 检查控制台日志
控制台会显示详细的请求链路：

#### 🔍 查找关键日志:
- `🚀 [CreateAPIForm] 开始创建API请求`
- `🌐 [proxy] 接收到代理请求`
- `✅ [proxy] POST请求验证`
- `🚨 [proxy] 检测到重定向` (如果有重定向)
- `🔄 [api-client] 检测到401错误` (如果需要令牌刷新)

#### 🚨 错误标志:
- `🚨 [proxy] HTTP 405 Method Not Allowed`
- `🚨 [api-client] originalRequest.method 丢失!`
- `🚨 [proxy] 检测到重定向 - 这可能导致POST变GET!`

## 🛠️ 解决方案

### 如果是重定向问题:
1. **缺少尾部斜杠**: 将URL从 `/apis` 改为 `/apis/`
2. **HTTP→HTTPS重定向**: 确保API基础URL使用HTTPS
3. **路径重写错误**: 检查代理配置的路径映射

### 如果是认证问题:
1. **检查TokenManager**: 确保访问令牌正常获取
2. **method丢失**: 已添加保护措施检测并报错
3. **重试逻辑**: 确认重试时保持原始HTTP方法

### 如果是CORS问题:
1. **预检响应**: 确保OPTIONS请求返回正确的方法列表
2. **头部配置**: 确认允许的头部包含所需字段

## 📋 测试检查清单

- [ ] Network面板已打开且保留日志
- [ ] 控制台显示完整的请求链路日志
- [ ] 检查是否有301/302重定向响应
- [ ] 确认POST请求没有变成GET请求
- [ ] 验证认证令牌是否正常工作
- [ ] 检查CORS预检请求是否成功

## 🔧 模式切换

### 切换到代理模式（如果需要）:
修改 `src/services/api-client.ts` 中的配置：
```typescript
const USE_DIRECT_API = false // 改为false使用代理
```

### 切换到直接请求模式（当前）:
```typescript
const USE_DIRECT_API = true // 改为true直接请求后端
```

## 🎯 快速诊断命令

在控制台执行以下命令来快速检查关键信息：

```javascript
// 检查当前认证状态
console.log('Access Token:', localStorage.getItem('vola_access_token') ? '✅ 存在' : '❌ 不存在');

// 检查当前请求模式
console.log('当前正在使用: 🎯 直接请求后端 (跳过代理)');

// 手动测试后端连通性（直接请求）
fetch('https://api.vola.fun/api/v1/health', { 
  method: 'GET',
  headers: { 'Authorization': `Bearer ${localStorage.getItem('vola_access_token')}` }
})
  .then(r => console.log('Direct Health Check:', r.status, r.statusText))
  .catch(e => console.error('Direct Health Check Failed:', e));
```

## 📊 测试结果分析

### ✅ 如果直接请求成功:
- **结论**: 问题出在代理层
- **下一步**: 切换回代理模式并检查代理日志

### ❌ 如果直接请求也出现POST→GET:  
- **结论**: 问题在axios拦截器或认证逻辑
- **下一步**: 重点检查令牌刷新逻辑

### 🚫 如果出现CORS错误:
- **结论**: 后端CORS配置问题，但排除了代理问题  
- **下一步**: 需要后端配置CORS或使用代理

---

💡 **提示**: 每次测试后，记录Network面板的结果和控制台日志，这样可以逐步定位问题所在。
