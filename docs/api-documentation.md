# Vola API 文档

## 概述

Vola API 提供了完整的 RESTful 接口，用于管理 API 市场、节点市场、收藏管理、用户认证、计费和支付等功能。所有 API 端点都位于 `/api/v1` 前缀下。

## 基础信息

### API 基础 URL

```
测试环境: http://43.153.40.155:8001/api/v1
开发环境: http://localhost:{PORT}/api/v1
生产环境: https://api.vola.fun/api/v1
```

**注意**：{PORT} 是可配置的端口号，在开发环境中默认为 8000。您可以通过环境变量或配置文件修改此端口。

### 认证方式

#### 1. JWT Bearer Token 认证

大部分 API 需要使用 JWT Bearer Token 进行认证：

```
Authorization: Bearer <your-jwt-token>
```

#### 2. API Key 认证

API 网关调用需要使用 API Key：

```
x-vola-key: <your-api-key>
```

### 响应格式

所有 API 响应都遵循统一的格式：

**成功响应**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "操作成功",
  "data": {
    // 响应数据
  }
}
```

**错误响应**

```json
{
  "success": false,
  "code": "ERROR_CODE",
  "message": "错误描述",
  "data": null
}
```

### 错误代码

| 错误代码             | HTTP 状态码 | 描述                         |
| -------------------- | ----------- | ---------------------------- |
| UNAUTHORIZED         | 401         | 未授权，缺少或无效的认证信息 |
| FORBIDDEN            | 403         | 禁止访问，没有权限           |
| NOT_FOUND            | 404         | 资源不存在                   |
| VALIDATION_ERROR     | 422         | 请求参数验证失败             |
| INTERNAL_ERROR       | 500         | 服务器内部错误               |
| INSUFFICIENT_BALANCE | 402         | 余额不足                     |
| RATE_LIMIT_EXCEEDED  | 429         | 超过速率限制                 |

## API 端点详细说明

### 0. 根级别端点

#### 0.1 应用信息

```http
GET /
```

获取应用的基本信息，包括名称、版本和状态。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Application root endpoint",
  "data": {
    "name": "Vola API Store",
    "version": "1.0.0",
    "status": "running"
  }
}
```

**响应字段说明**

| 字段    | 类型   | 描述                                               |
| ------- | ------ | -------------------------------------------------- |
| name    | string | 应用名称                                           |
| version | string | 应用版本号                                         |
| status  | string | 应用运行状态：running（运行中）, stopped（已停止） |

#### 0.2 健康检查

```http
GET /health
```

检查应用和依赖服务的健康状态。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Health check completed",
  "data": {
    "status": "healthy",
    "environment": "development",
    "dependencies": {
      "redis": {
        "status": "healthy"
      },
      "database": {
        "status": "healthy"
      }
    }
  }
}
```

**响应字段说明**

| 字段                         | 类型   | 描述                                                 |
| ---------------------------- | ------ | ---------------------------------------------------- |
| status                       | string | 整体健康状态：healthy（健康）, unhealthy（不健康）   |
| environment                  | string | 运行环境：development（开发）, production（生产）    |
| dependencies                 | object | 依赖服务状态对象                                     |
| dependencies.redis           | object | Redis 服务状态                                       |
| dependencies.redis.status    | string | Redis 连接状态：healthy（健康）, unhealthy（不健康） |
| dependencies.database        | object | 数据库服务状态                                       |
| dependencies.database.status | string | 数据库连接状态：healthy（健康）, unhealthy（不健康） |

当依赖服务异常时：

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Health check completed",
  "data": {
    "status": "degraded",
    "environment": "production",
    "dependencies": {
      "redis": {
        "status": "unhealthy",
        "error": "Connection timeout"
      },
      "database": {
        "status": "healthy"
      }
    }
  }
}
```

### 1. 用户管理 API

#### 1.1 获取当前用户信息

```http
GET /api/v1/users/me
```

**需要认证**: 是

获取当前登录用户的详细信息，包括余额、个人资料、当前订阅计划等。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "User information retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firebase_uid": "firebase_uid_123",
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "avatar_url": "https://s3.amazonaws.com/vola/avatars/user123.jpg",
    "role": "USER",
    "is_active": true,
    "is_verified": true,
    "subscription_balance": 100.0,
    "one_time_balance": 50.0,
    "bio": "Software developer passionate about APIs",
    "company": "Tech Corp",
    "website": "https://johndoe.com",
    "location": "San Francisco, CA",
    "plan": "pro",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z"
  }
}
```

**响应字段说明**

| 字段                 | 类型    | 描述                                                                           |
| -------------------- | ------- | ------------------------------------------------------------------------------ |
| id                   | string  | 用户唯一标识符（UUID）                                                         |
| firebase_uid         | string  | Firebase 用户 ID                                                               |
| email                | string  | 用户邮箱地址                                                                   |
| username             | string  | 用户名，全局唯一                                                               |
| full_name            | string  | 用户全名                                                                       |
| avatar_url           | string  | 用户头像 URL                                                                   |
| role                 | string  | 用户角色：USER（普通用户）, PROVIDER（API提供商）, ADMIN（管理员）             |
| is_active            | boolean | 账户是否激活                                                                   |
| is_verified          | boolean | 邮箱是否已验证                                                                 |
| subscription_balance | number  | 订阅余额（美元）                                                               |
| one_time_balance     | number  | 一次性充值余额（美元）                                                         |
| bio                  | string  | 用户个人简介                                                                   |
| company              | string  | 所在公司                                                                       |
| website              | string  | 个人网站 URL                                                                   |
| location             | string  | 所在位置                                                                       |
| plan                 | string  | 用户当前的订阅计划：basic, pro, enterprise，如果用户没有订阅会自动创建基础计划 |
| created_at           | string  | 账户创建时间（ISO 8601格式）                                                   |
| updated_at           | string  | 最后更新时间（ISO 8601格式）                                                   |

#### 1.2 获取当前用户详细信息

```http
GET /api/v1/users/me/detailed
```

**需要认证**: 是

获取当前用户的详细信息，包括支付数据和订阅信息。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "User detailed information retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firebase_uid": "firebase_uid_123",
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "avatar_url": "https://s3.amazonaws.com/vola/avatars/user123.jpg",
    "role": "USER",
    "is_active": true,
    "is_verified": true,
    "subscription_balance": 100.0,
    "one_time_balance": 50.0,
    "bio": "Software developer passionate about APIs",
    "company": "Tech Corp",
    "website": "https://johndoe.com",
    "location": "San Francisco, CA",
    "payment_info": {
      "subscription_balance": 100.0,
      "one_time_balance": 50.0,
      "total_balance": 150.0,
      "subscription": {
        "plan": "pro",
        "status": "ACTIVE",
        "current_period_end": "2024-02-01T00:00:00Z",
        "monthly_price": 29.99
      }
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z"
  }
}
```

**响应字段说明**

| 字段                                         | 类型    | 描述                                                               |
| -------------------------------------------- | ------- | ------------------------------------------------------------------ |
| id                                           | string  | 用户唯一标识符（UUID）                                             |
| firebase_uid                                 | string  | Firebase 用户 ID                                                   |
| email                                        | string  | 用户邮箱地址                                                       |
| username                                     | string  | 用户名，全局唯一                                                   |
| full_name                                    | string  | 用户全名                                                           |
| avatar_url                                   | string  | 用户头像 URL                                                       |
| role                                         | string  | 用户角色：USER（普通用户）, PROVIDER（API提供商）, ADMIN（管理员） |
| is_active                                    | boolean | 账户是否激活                                                       |
| is_verified                                  | boolean | 邮箱是否已验证                                                     |
| subscription_balance                         | number  | 订阅余额（美元）                                                   |
| one_time_balance                             | number  | 一次性充值余额（美元）                                             |
| bio                                          | string  | 用户个人简介                                                       |
| company                                      | string  | 所在公司                                                           |
| website                                      | string  | 个人网站 URL                                                       |
| location                                     | string  | 所在位置                                                           |
| payment_info                                 | object  | 支付信息对象                                                       |
| payment_info.subscription_balance            | number  | 订阅余额（美元）                                                   |
| payment_info.one_time_balance                | number  | 一次性余额（美元）                                                 |
| payment_info.total_balance                   | number  | 总余额（美元）                                                     |
| payment_info.subscription                    | object  | 订阅信息对象                                                       |
| payment_info.subscription.plan               | string  | 订阅计划类型：basic, pro, enterprise                               |
| payment_info.subscription.status             | string  | 订阅状态：ACTIVE, INACTIVE, CANCELLED                              |
| payment_info.subscription.current_period_end | string  | 当前订阅周期结束时间（ISO 8601格式）                               |
| payment_info.subscription.monthly_price      | number  | 月费价格（美元）                                                   |
| created_at                                   | string  | 账户创建时间（ISO 8601格式）                                       |
| updated_at                                   | string  | 最后更新时间（ISO 8601格式）                                       |

#### 1.3 更新当前用户资料

```http
PUT /api/v1/users/me
```

**需要认证**: 是

更新当前用户的个人资料信息。

**请求体**

```json
{
  "full_name": "John Doe Updated",
  "bio": "Updated bio description",
  "company": "New Tech Corp",
  "website": "https://newjohndoe.com",
  "location": "New York, NY",
  "avatar_url": "https://s3.amazonaws.com/vola/avatars/new_avatar.jpg"
}
```

**请求参数说明**

| 参数       | 类型   | 必填 | 描述                                       |
| ---------- | ------ | ---- | ------------------------------------------ |
| full_name  | string | 否   | 用户全名，最大 100 字符                    |
| bio        | string | 否   | 用户简介，最大 500 字符                    |
| company    | string | 否   | 所在公司名称，最大 100 字符                |
| website    | string | 否   | 个人网站 URL，必须是有效的 HTTP/HTTPS 链接 |
| location   | string | 否   | 所在位置，最大 100 字符                    |
| avatar_url | string | 否   | 头像 URL，必须是有效的 HTTP/HTTPS 链接     |

**响应示例**

```json
{
  "success": true,
  "code": "UPDATED",
  "message": "User profile updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firebase_uid": "firebase_uid_123",
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe Updated",
    "avatar_url": "https://s3.amazonaws.com/vola/avatars/new_avatar.jpg",
    "role": "USER",
    "is_active": true,
    "is_verified": true,
    "subscription_balance": 100.0,
    "one_time_balance": 50.0,
    "bio": "Updated bio description",
    "company": "New Tech Corp",
    "website": "https://newjohndoe.com",
    "location": "New York, NY",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**响应字段说明**

| 字段                 | 类型    | 描述                                                               |
| -------------------- | ------- | ------------------------------------------------------------------ |
| id                   | string  | 用户唯一标识符（UUID）                                             |
| firebase_uid         | string  | Firebase 用户 ID                                                   |
| email                | string  | 用户邮箱地址                                                       |
| username             | string  | 用户名，全局唯一                                                   |
| full_name            | string  | 用户全名                                                           |
| avatar_url           | string  | 用户头像 URL                                                       |
| role                 | string  | 用户角色：USER（普通用户）, PROVIDER（API提供商）, ADMIN（管理员） |
| is_active            | boolean | 账户是否激活                                                       |
| is_verified          | boolean | 邮箱是否已验证                                                     |
| subscription_balance | number  | 订阅余额（美元）                                                   |
| one_time_balance     | number  | 一次性充值余额（美元）                                             |
| bio                  | string  | 用户个人简介                                                       |
| company              | string  | 所在公司                                                           |
| website              | string  | 个人网站 URL                                                       |
| location             | string  | 所在位置                                                           |
| created_at           | string  | 账户创建时间（ISO 8601格式）                                       |
| updated_at           | string  | 最后更新时间（ISO 8601格式）                                       |

#### 1.4 获取当前用户统计信息

```http
GET /api/v1/users/me/stats
```

**需要认证**: 是

获取当前用户的统计数据，包括 API 数量、节点数量、收藏数量、收入等。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "User statistics retrieved successfully",
  "data": {
    "total_apis": 5,
    "total_nodes": 3,
    "total_favorites": 8,
    "total_api_calls": 10000,
    "total_revenue": 150.5,
    "member_since_days": 120
  }
}
```

**响应字段说明**

| 字段              | 类型    | 描述                         |
| ----------------- | ------- | ---------------------------- |
| total_apis        | integer | 用户创建的 API 总数          |
| total_nodes       | integer | 用户创建的节点总数           |
| total_favorites   | integer | 用户收藏的总数（API + 节点） |
| total_api_calls   | integer | 用户 API 总调用次数          |
| total_revenue     | number  | 用户总收入（美元）           |
| member_since_days | integer | 用户注册天数                 |

#### 1.5 删除当前用户账户

```http
DELETE /api/v1/users/me
```

**需要认证**: 是

软删除当前用户账户（停用账户而非物理删除）。

**响应示例**

```json
{
  "success": true,
  "code": "ACCOUNT_DEACTIVATED",
  "message": "Account deactivated successfully",
  "data": null
}
```

#### 1.6 获取用户公开信息

```http
GET /api/v1/users/{user_id}
```

根据用户 ID 获取用户的公开个人资料信息。

**路径参数**

- `user_id`: 用户的 UUID

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "User information retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "johndoe",
    "full_name": "John Doe",
    "avatar_url": "https://s3.amazonaws.com/vola/avatars/user123.jpg",
    "bio": "Software developer passionate about APIs",
    "company": "Tech Corp",
    "website": "https://johndoe.com",
    "location": "San Francisco, CA",
    "is_verified": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**响应字段说明**

| 字段        | 类型    | 描述                         |
| ----------- | ------- | ---------------------------- |
| id          | string  | 用户唯一标识符（UUID）       |
| username    | string  | 用户名，全局唯一             |
| full_name   | string  | 用户全名                     |
| avatar_url  | string  | 用户头像 URL                 |
| bio         | string  | 用户个人简介                 |
| company     | string  | 所在公司                     |
| website     | string  | 个人网站 URL                 |
| location    | string  | 所在位置                     |
| is_verified | boolean | 邮箱是否已验证               |
| created_at  | string  | 账户创建时间（ISO 8601格式） |

#### 1.7 获取用户列表

```http
GET /api/v1/users
```

获取用户列表，支持分页和过滤。

**查询参数**
| 参数 | 类型 | 必填 | 描述 |
|-----|------|-----|------|
| page | integer | 否 | 页码，默认 1 |
| page_size | integer | 否 | 每页数量，默认 20，最大 100 |
| role | string | 否 | 用户角色过滤：USER, ADMIN |
| is_verified | boolean | 否 | 是否已验证 |
| search | string | 否 | 搜索关键词（用户名、全名、邮箱） |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "User list retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "johndoe",
      "full_name": "John Doe",
      "avatar_url": "https://s3.amazonaws.com/vola/avatars/user123.jpg",
      "bio": "Software developer",
      "company": "Tech Corp",
      "website": "https://johndoe.com",
      "location": "San Francisco, CA",
      "is_verified": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 100,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

**响应字段说明**

| 字段        | 类型    | 描述                         |
| ----------- | ------- | ---------------------------- |
| id          | string  | 用户唯一标识符（UUID）       |
| username    | string  | 用户名，全局唯一             |
| full_name   | string  | 用户全名                     |
| avatar_url  | string  | 用户头像 URL                 |
| bio         | string  | 用户个人简介                 |
| company     | string  | 所在公司                     |
| website     | string  | 个人网站 URL                 |
| location    | string  | 所在位置                     |
| is_verified | boolean | 邮箱是否已验证               |
| created_at  | string  | 账户创建时间（ISO 8601格式） |

#### 1.8 管理员用户管理

##### 1.8.1 获取用户详细信息（管理员）

```http
GET /api/v1/users/admin/{user_id}
```

**需要认证**: 是（管理员权限）

管理员获取任意用户的详细信息，包括敏感数据和当前订阅计划。

**路径参数**

- `user_id`: 用户的 UUID

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "User information retrieved successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firebase_uid": "firebase_uid_123",
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "avatar_url": "https://s3.amazonaws.com/vola/avatars/user123.jpg",
    "plan": "pro",
    "role": "USER",
    "is_active": true,
    "is_verified": true,
    "subscription_balance": 100.0,
    "one_time_balance": 50.0,
    "bio": "Software developer passionate about APIs",
    "company": "Tech Corp",
    "website": "https://johndoe.com",
    "location": "San Francisco, CA",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z"
  }
}
```

**响应字段说明**

| 字段                 | 类型    | 描述                                                               |
| -------------------- | ------- | ------------------------------------------------------------------ |
| id                   | string  | 用户唯一标识符（UUID）                                             |
| firebase_uid         | string  | Firebase 用户 ID                                                   |
| email                | string  | 用户邮箱地址（敏感信息，仅管理员可见）                             |
| username             | string  | 用户名，全局唯一                                                   |
| full_name            | string  | 用户全名                                                           |
| avatar_url           | string  | 用户头像 URL                                                       |
| plan                 | string  | 用户当前订阅计划：basic, pro, enterprise                           |
| role                 | string  | 用户角色：USER（普通用户）, PROVIDER（API提供商）, ADMIN（管理员） |
| is_active            | boolean | 账户是否激活                                                       |
| is_verified          | boolean | 邮箱是否已验证                                                     |
| subscription_balance | number  | 订阅余额（美元，敏感信息）                                         |
| one_time_balance     | number  | 一次性充值余额（美元，敏感信息）                                   |
| bio                  | string  | 用户个人简介                                                       |
| company              | string  | 所在公司                                                           |
| website              | string  | 个人网站 URL                                                       |
| location             | string  | 所在位置                                                           |
| created_at           | string  | 账户创建时间（ISO 8601格式）                                       |
| updated_at           | string  | 最后更新时间（ISO 8601格式）                                       |

##### 1.8.2 更新用户信息（管理员）

```http
PUT /api/v1/users/admin/{user_id}
```

**需要认证**: 是（管理员权限）

管理员更新任意用户的信息，包括角色、状态、余额等。

**路径参数**

- `user_id`: 用户的 UUID

**请求体**

```json
{
  "full_name": "Updated Name",
  "role": "ADMIN",
  "is_active": true,
  "is_verified": true,
  "subscription_balance": 200.0,
  "one_time_balance": 100.0,
  "bio": "Updated bio",
  "company": "Updated Company"
}
```

**请求参数说明**

| 参数                 | 类型    | 必填 | 描述                                                               |
| -------------------- | ------- | ---- | ------------------------------------------------------------------ |
| full_name            | string  | 否   | 用户全名，最大 100 字符                                            |
| role                 | string  | 否   | 用户角色：USER（普通用户）, PROVIDER（API提供商）, ADMIN（管理员） |
| is_active            | boolean | 否   | 是否激活账户                                                       |
| is_verified          | boolean | 否   | 是否验证邮箱                                                       |
| subscription_balance | number  | 否   | 订阅余额（美元），管理员可直接修改                                 |
| one_time_balance     | number  | 否   | 一次性余额（美元），管理员可直接修改                               |
| bio                  | string  | 否   | 用户个人简介，最大 500 字符                                        |
| company              | string  | 否   | 所在公司名称，最大 100 字符                                        |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "用户信息更新成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firebase_uid": "firebase_uid_123",
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "Updated Name",
    "avatar_url": "https://s3.amazonaws.com/vola/avatars/user123.jpg",
    "role": "ADMIN",
    "is_active": true,
    "is_verified": true,
    "subscription_balance": 200.0,
    "one_time_balance": 100.0,
    "bio": "Updated bio",
    "company": "Updated Company",
    "website": "https://johndoe.com",
    "location": "San Francisco, CA",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**响应字段说明**

| 字段                 | 类型    | 描述                                                               |
| -------------------- | ------- | ------------------------------------------------------------------ |
| id                   | string  | 用户唯一标识符（UUID）                                             |
| firebase_uid         | string  | Firebase 用户 ID                                                   |
| email                | string  | 用户邮箱地址                                                       |
| username             | string  | 用户名，全局唯一                                                   |
| full_name            | string  | 用户全名                                                           |
| avatar_url           | string  | 用户头像 URL                                                       |
| role                 | string  | 用户角色：USER（普通用户）, PROVIDER（API提供商）, ADMIN（管理员） |
| is_active            | boolean | 账户是否激活                                                       |
| is_verified          | boolean | 邮箱是否已验证                                                     |
| subscription_balance | number  | 订阅余额（美元）                                                   |
| one_time_balance     | number  | 一次性充值余额（美元）                                             |
| bio                  | string  | 用户个人简介                                                       |
| company              | string  | 所在公司                                                           |
| website              | string  | 个人网站 URL                                                       |
| location             | string  | 所在位置                                                           |
| created_at           | string  | 账户创建时间（ISO 8601格式）                                       |
| updated_at           | string  | 最后更新时间（ISO 8601格式）                                       |

##### 1.8.3 验证用户账户（管理员）

```http
POST /api/v1/users/admin/{user_id}/verify
```

**需要认证**: 是（管理员权限）

管理员手动验证用户账户。

**响应示例**

```json
{
  "success": true,
  "code": "USER_VERIFIED",
  "message": "User verified successfully",
  "data": null
}
```

##### 1.8.4 暂停用户账户（管理员）

```http
POST /api/v1/users/admin/{user_id}/suspend
```

**需要认证**: 是（管理员权限）

管理员暂停用户账户。

**响应示例**

```json
{
  "success": true,
  "code": "USER_SUSPENDED",
  "message": "User suspended successfully",
  "data": null
}
```

##### 1.8.5 激活用户账户（管理员）

```http
POST /api/v1/users/admin/{user_id}/activate
```

**需要认证**: 是（管理员权限）

管理员激活已暂停的用户账户。

**响应示例**

```json
{
  "success": true,
  "code": "USER_ACTIVATED",
  "message": "User activated successfully",
  "data": null
}
```

### 2. 认证 API

#### 2.1 登录

```http
POST /api/v1/auth/login
```

使用 Firebase ID Token 登录并获取 JWT tokens。

**请求头**

```
Authorization: Bearer <firebase-id-token>
```

**请求体**
无需请求体，Firebase ID Token 通过 Authorization 头传递。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
    "token_type": "bearer"
  }
}
```

**响应字段说明**

| 字段          | 类型   | 描述                               |
| ------------- | ------ | ---------------------------------- |
| access_token  | string | JWT 访问令牌，用于 API 认证        |
| refresh_token | string | JWT 刷新令牌，用于获取新的访问令牌 |
| token_type    | string | 令牌类型，固定为 "bearer"          |

#### 2.2 刷新令牌

```http
POST /api/v1/auth/refresh
```

使用 refresh token 获取新的 access token。

**请求体**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
}
```

**请求参数说明**

| 参数          | 类型   | 必填 | 描述                           |
| ------------- | ------ | ---- | ------------------------------ |
| refresh_token | string | 是   | 刷新令牌，用于获取新的访问令牌 |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Token refresh successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
    "token_type": "bearer"
  }
}
```

**响应字段说明**

| 字段          | 类型   | 描述                             |
| ------------- | ------ | -------------------------------- |
| access_token  | string | 新的 JWT 访问令牌，用于 API 认证 |
| refresh_token | string | 新的 JWT 刷新令牌，用于下次刷新  |
| token_type    | string | 令牌类型，固定为 "bearer"        |

#### 2.3 登出

```http
POST /api/v1/auth/logout
```

**需要认证**: 是

**响应示例**

```json
{
  "success": true,
  "code": "LOGOUT_SUCCESS",
  "message": "Logout successful",
  "data": null
}
```

### 3. API 市场管理

#### 3.1 获取 API 列表

```http
GET /api/v1/apis/
```

获取公开的 API 列表，支持分页和过滤。

**查询参数说明**
| 参数 | 类型 | 必填 | 描述 |
|-----|------|-----|------|
| page | integer | 否 | 页码，默认 1 |
| page_size | integer | 否 | 每页数量，默认 20，最大 100 |
| category | string | 否 | API 类别过滤 |
| status | string | 否 | 状态过滤：draft, published, deprecated, suspended |
| is_public | boolean | 否 | 是否公开 |
| search | string | 否 | 搜索关键词 |
| owner_id | uuid | 否 | 按所有者 ID 过滤 |
| tags | array[string] | 否 | 按标签过滤，可传递多个标签 |
| sort_by | string | 否 | 排序字段：total_calls, rating, created_at |
| sort_order | string | 否 | 排序顺序：asc 或 desc，默认 desc |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取 API 列表成功",
  "data": [
    {
      "id": "api-uuid-1",
      "name": "Weather API",
      "slug": "weather-api",
      "short_description": "获取全球天气信息",
      "category": "data",
      "avatar_url": "https://...",
      "base_url": "https://api.weather.com",
      "health_check_url": null,
      "status": "published",
      "is_public": true,
      "website_url": null,
      "documentation_url": null,
      "terms_url": null,
      "documentation_markdown": null,
      "total_calls": 10000,
      "total_revenue": 10.0,
      "rating": 4.8,
      "owner_id": "user-uuid",
      "owner": {
        "username": "john_weather",
        "full_name": "John Weather",
        "avatar_url": "https://s3.amazonaws.com/vola/avatars/john_weather.jpg"
      },
      "estimated_response_time": 100,
      "is_favorited": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 100,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

**响应字段说明**

| 字段                    | 类型    | 描述                                                                                         |
| ----------------------- | ------- | -------------------------------------------------------------------------------------------- |
| id                      | string  | API 唯一标识符（UUID）                                                                       |
| name                    | string  | API 名称                                                                                     |
| slug                    | string  | API 唯一标识符，用于 URL 路径                                                                |
| short_description       | string  | API 简短描述                                                                                 |
| category                | string  | API 类别：data, ai_ml, finance, social, tools, communication, entertainment, business, other |
| avatar_url              | string  | API 头像/图标 URL                                                                            |
| base_url                | string  | API 基础 URL                                                                                 |
| health_check_url        | string  | API 健康检查 URL                                                                             |
| status                  | string  | API 状态：draft（草稿）, published（已发布）, deprecated（已弃用）, suspended（已暂停）      |
| is_public               | boolean | 是否公开显示                                                                                 |
| website_url             | string  | API 官方网站 URL                                                                             |
| documentation_url       | string  | API 外部文档 URL                                                                             |
| terms_url               | string  | 服务条款 URL                                                                                 |
| documentation_markdown  | string  | Markdown 格式的 API 内部文档                                                                 |
| total_calls             | integer | API 总调用次数                                                                               |
| total_revenue           | number  | API 总收入（美元）                                                                           |
| rating                  | number  | API 平均评分（1-5分，null 表示暂无评分）                                                     |
| owner_id                | string  | API 所有者用户 ID                                                                            |
| owner                   | object  | API 所有者信息，包含 username、full_name、avatar_url                                         |
| estimated_response_time | number  | 预估响应时间（毫秒），用于性能预期                                                           |
| is_favorited            | boolean | 是否已被当前用户收藏（仅已认证用户有此字段）                                                 |
| created_at              | string  | 创建时间（ISO 8601格式）                                                                     |

#### 3.2 创建 API

```http
POST /api/v1/apis/
```

**需要认证**: 是

**请求体**

```json
{
  "name": "Weather API",
  "slug": "weather-api",
  "short_description": "提供全球天气信息查询服务",
  "long_description": "这是一个综合性的天气API，提供实时天气数据、天气预报、历史天气信息等服务。支持全球主要城市和地区的天气查询。",
  "category": "data",
  "tags": ["weather", "data", "forecast"],
  "base_url": "https://api.myweather.com",
  "health_check_url": "https://api.myweather.com/health",
  "gateway_key": "secret_key_for_gateway_authentication",
  "is_public": true,
  "estimated_response_time": 100,
  "website_url": "https://myweather.com",
  "documentation_url": "https://docs.myweather.com",
  "terms_url": "https://myweather.com/terms",
  "documentation_markdown": "# Weather API\n\n## 使用说明\n\n这个API提供全球天气信息查询服务。"
}
```

#### 请求字段说明

| 字段                    | 类型          | 必填                               | 描述                                                                                         |
| ----------------------- | ------------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| name                    | string        | 是                                 | API 名称，最大 255 字符                                                                      |
| slug                    | string        | 是                                 | API 唯一标识符，只允许小写字母、数字和连字符                                                 |
| short_description       | string        | 是                                 | 简短描述，最大 100 字符                                                                      |
| long_description        | string        | 否                                 | 详细描述                                                                                     |
| category                | string        | 是                                 | API 类别：data, ai_ml, finance, social, tools, communication, entertainment, business, other |
| tags                    | array[string] | 否                                 | 标签列表，用于分类和搜索，最多 3 个标签，每个标签最多 10 字符                                |
| base_url                | string        | 是                                 | API 基础 URL                                                                                 |
| health_check_url        | string        | 否                                 | 健康检查 URL                                                                                 |
| gateway_key             | string        | 否                                 | 网关认证密钥，用于自动填充请求中的 x-vola-gateway 头                                         |
| is_public               | boolean       | 否                                 | 是否公开，默认 false                                                                         |
| estimated_response_time | number        | 预估响应时间（毫秒），用于性能预期 |
| website_url             | string        | 否                                 | API 官方网站 URL                                                                             |
| documentation_url       | string        | 否                                 | API 文档 URL                                                                                 |
| terms_url               | string        | 否                                 | 服务条款 URL                                                                                 |
| documentation_markdown  | string        | 否                                 | Markdown 格式的 API 文档                                                                     |

**响应示例**

```json
{
  "success": true,
  "code": "CREATED",
  "message": "API created successfully",
  "data": {
    "id": "api-uuid",
    "name": "Weather API",
    "slug": "weather-api",
    "short_description": "提供全球天气信息查询服务",
    "long_description": "这是一个综合性的天气API，提供实时天气数据、天气预报、历史天气信息等服务。支持全球主要城市和地区的天气查询。",
    "avatar_url": null,
    "category": "data",
    "tags": ["weather", "data", "forecast"],
    "base_url": "https://api.myweather.com",
    "health_check_url": "https://api.myweather.com/health",
    "gateway_key": "secret_key_for_gateway_authentication",
    "status": "draft",
    "is_public": true,
    "estimated_response_time": 100,
    "website_url": "https://myweather.com",
    "documentation_url": "https://docs.myweather.com",
    "terms_url": "https://myweather.com/terms",
    "documentation_markdown": "# Weather API\n\n## 使用说明\n\n这个API提供全球天气信息查询服务。",
    "total_calls": 0,
    "total_revenue": 0.0,
    "rating": null,
    "owner_id": "user-uuid",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

**响应字段说明**

| 字段                    | 类型          | 描述                                 |
| ----------------------- | ------------- | ------------------------------------ |
| id                      | string        | API 唯一标识符（UUID）               |
| name                    | string        | API 名称                             |
| slug                    | string        | API 唯一标识符，用于 URL 路径        |
| short_description       | string        | API 简短描述                         |
| long_description        | string        | API 详细描述                         |
| avatar_url              | string        | API 头像/图标 URL，初始为 null       |
| category                | string        | API 类别                             |
| tags                    | array[string] | API 标签列表                         |
| base_url                | string        | API 基础 URL                         |
| health_check_url        | string        | API 健康检查 URL                     |
| gateway_key             | string        | 网关认证密钥                         |
| status                  | string        | API 状态，新创建默认为 draft（草稿） |
| is_public               | boolean       | 是否公开显示                         |
| estimated_response_time | number        | 预估响应时间（毫秒），用于性能预期   |
| website_url             | string        | API 官方网站 URL                     |
| documentation_url       | string        | API 外部文档 URL                     |
| terms_url               | string        | 服务条款 URL                         |
| documentation_markdown  | string        | Markdown 格式的 API 内部文档         |
| total_calls             | integer       | API 总调用次数，初始为 0             |
| total_revenue           | number        | API 总收入（美元），初始为 0.0       |
| rating                  | number        | API 平均评分，初始为 null            |
| owner_id                | string        | API 所有者用户 ID                    |
| created_at              | string        | 创建时间（ISO 8601格式）             |
| updated_at              | string        | 最后更新时间（ISO 8601格式）         |

#### 3.3 获取 API 详情

```http
GET /api/v1/apis/{api_id}
```

**路径参数**

- `api_id`: API 的 UUID

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "API details retrieved successfully",
  "data": {
    "id": "api-uuid",
    "name": "Weather API",
    "slug": "weather-api",
    "short_description": "提供全球天气信息查询服务",
    "long_description": "这是一个综合性的天气API，提供实时天气数据、天气预报、历史天气信息等服务。支持全球主要城市和地区的天气查询。",
    "avatar_url": "https://s3.amazonaws.com/vola/apis/weather-api.jpg",
    "category": "data",
    "tags": ["weather", "data", "forecast"],
    "base_url": "https://api.myweather.com",
    "health_check_url": "https://api.myweather.com/health",
    "status": "published",
    "is_public": true,
    "website_url": "https://myweather.com",
    "documentation_url": "https://docs.myweather.com",
    "terms_url": "https://myweather.com/terms",
    "documentation_markdown": "# Weather API\n\n## 使用说明...",
    "total_calls": 150000,
    "total_revenue": 1250.5,
    "rating": 4.8,
    "estimated_response_time": 100,
    "owner_id": "user-uuid",
    "owner": {
      "username": "john_weather",
      "full_name": "John Weather",
      "avatar_url": "https://s3.amazonaws.com/vola/avatars/john_weather.jpg"
    },
    "is_favorited": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z"
  }
}
```

**响应字段说明**

| 字段                    | 类型          | 描述                                                                                         |
| ----------------------- | ------------- | -------------------------------------------------------------------------------------------- |
| id                      | string        | API 唯一标识符（UUID）                                                                       |
| name                    | string        | API 名称                                                                                     |
| slug                    | string        | API 唯一标识符，用于 URL 路径                                                                |
| short_description       | string        | API 简短描述                                                                                 |
| long_description        | string        | API 详细描述                                                                                 |
| avatar_url              | string        | API 头像/图标 URL                                                                            |
| category                | string        | API 类别：data, ai_ml, finance, social, tools, communication, entertainment, business, other |
| tags                    | array[string] | API 标签列表                                                                                 |
| base_url                | string        | API 基础 URL                                                                                 |
| health_check_url        | string        | API 健康检查 URL                                                                             |
| status                  | string        | API 状态：draft（草稿）, published（已发布）, deprecated（已弃用）                           |
| is_public               | boolean       | 是否公开显示                                                                                 |
| website_url             | string        | API 官方网站 URL                                                                             |
| documentation_url       | string        | API 外部文档 URL                                                                             |
| terms_url               | string        | 服务条款 URL                                                                                 |
| documentation_markdown  | string        | Markdown 格式的 API 内部文档                                                                 |
| total_calls             | integer       | API 总调用次数                                                                               |
| total_revenue           | number        | API 总收入（美元）                                                                           |
| rating                  | number        | API 平均评分（1-5分，null 表示暂无评分）                                                     |
| estimated_response_time | number        | 预估响应时间（毫秒），用于性能预期                                                           |
| owner_id                | string        | API 所有者用户 ID                                                                            |
| owner                   | object        | API 所有者信息，包含 username、full_name、avatar_url                                         |
| is_favorited            | boolean       | 是否已被当前用户收藏（仅已认证用户有此字段）                                                 |
| created_at              | string        | 创建时间（ISO 8601格式）                                                                     |
| updated_at              | string        | 最后更新时间（ISO 8601格式）                                                                 |

#### 3.4 更新 API

```http
PATCH /api/v1/apis/{api_id}
```

**需要认证**: 是（必须是 API 所有者）

**路径参数**

- `api_id`: API 的 UUID

**请求体**（只需包含要更新的字段）

```json
{
  "short_description": "更新的API简介",
  "long_description": "这是一个综合性的天气API，提供实时天气数据、天气预报、历史天气信息等服务。经过更新优化，支持更多城市和更准确的预测。",
  "category": "data",
  "tags": ["weather", "data", "forecast", "updated"],
  "is_public": false,
  "estimated_response_time": 100,
  "status": "published"
}
```

**请求参数说明**

| 参数                    | 类型          | 必填                               | 描述                                                                                         |
| ----------------------- | ------------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| short_description       | string        | 否                                 | API 简短描述，最大 100 字符                                                                  |
| long_description        | string        | 否                                 | API 详细描述，支持 Markdown 格式                                                             |
| category                | string        | 否                                 | API 类别：data, ai_ml, finance, social, tools, communication, entertainment, business, other |
| tags                    | array[string] | 否                                 | 标签列表，最多 3 个标签，每个标签最多 10 字符                                                |
| is_public               | boolean       | 否                                 | 是否公开显示，true 表示公开，false 表示私有                                                  |
| estimated_response_time | number        | 预估响应时间（毫秒），用于性能预期 |
| status                  | string        | 否                                 | API 状态：draft（草稿）, published（已发布）, deprecated（已弃用）                           |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "API 更新成功",
  "data": {
    "id": "api-uuid",
    "name": "Weather API",
    "slug": "weather-api",
    "short_description": "更新的API简介",
    "long_description": "这是一个综合性的天气API，提供实时天气数据、天气预报、历史天气信息等服务。经过更新优化，支持更多城市和更准确的预测。",
    "avatar_url": "https://s3.amazonaws.com/vola/apis/api123.jpg",
    "category": "data",
    "tags": ["weather", "data", "forecast", "updated"],
    "base_url": "https://api.weather.com",
    "health_check_url": null,
    "status": "published",
    "is_public": false,
    "website_url": null,
    "documentation_url": null,
    "terms_url": null,
    "documentation_markdown": null,
    "total_calls": 10000,
    "total_revenue": 20.0,
    "rating": null,
    "estimated_response_time": 100,
    "owner_id": "user-uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

**响应字段说明**

| 字段                    | 类型          | 描述                                                                                         |
| ----------------------- | ------------- | -------------------------------------------------------------------------------------------- |
| id                      | string        | API 唯一标识符（UUID）                                                                       |
| name                    | string        | API 名称                                                                                     |
| slug                    | string        | API 唯一标识符，用于 URL 路径                                                                |
| short_description       | string        | API 简短描述                                                                                 |
| long_description        | string        | API 详细描述                                                                                 |
| avatar_url              | string        | API 头像/图标 URL                                                                            |
| category                | string        | API 类别：data, ai_ml, finance, social, tools, communication, entertainment, business, other |
| tags                    | array[string] | API 标签列表                                                                                 |
| base_url                | string        | API 基础 URL                                                                                 |
| health_check_url        | string        | API 健康检查 URL                                                                             |
| status                  | string        | API 状态：draft（草稿）, published（已发布）, deprecated（已弃用）                           |
| is_public               | boolean       | 是否公开显示                                                                                 |
| website_url             | string        | API 官方网站 URL                                                                             |
| documentation_url       | string        | API 外部文档 URL                                                                             |
| terms_url               | string        | 服务条款 URL                                                                                 |
| documentation_markdown  | string        | Markdown 格式的 API 内部文档                                                                 |
| total_calls             | integer       | API 总调用次数                                                                               |
| total_revenue           | number        | API 总收入（美元）                                                                           |
| rating                  | number        | API 平均评分（1-5分，null 表示暂无评分）                                                     |
| estimated_response_time | number        | 预估响应时间（毫秒），用于性能预期                                                           |
| owner_id                | string        | API 所有者用户 ID                                                                            |
| created_at              | string        | 创建时间（ISO 8601格式）                                                                     |
| updated_at              | string        | 最后更新时间（ISO 8601格式）                                                                 |

#### 3.5 删除 API

```http
DELETE /api/v1/apis/{api_id}
```

**需要认证**: 是（必须是 API 所有者）

软删除 API，不会真正从数据库中删除。

**路径参数**

- `api_id`: API 的 UUID

**响应示例**

```json
{
  "success": true,
  "code": "API_DELETED",
  "message": "API deleted successfully",
  "data": null
}
```

#### 3.6 上传 API 头像

```http
POST /api/v1/apis/{api_id}/avatar
```

**需要认证**: 是（必须是 API 所有者）

**路径参数**

- `api_id`: API 的 UUID

**请求格式**: multipart/form-data

**请求体**

- `file`: 图片文件（支持 jpg, png, gif，最大 5MB）

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "头像上传成功",
  "data": {
    "id": "api-uuid",
    "name": "Weather API",
    "slug": "weather-api",
    "avatar_url": "https://s3.amazonaws.com/vola/apis/api123_new.jpg",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**响应字段说明**

| 字段       | 类型   | 描述                     |
| ---------- | ------ | ------------------------ |
| id         | string | API 唯一标识符（UUID）   |
| name       | string | API 名称                 |
| slug       | string | API 唯一标识符           |
| avatar_url | string | 新上传的头像 URL         |
| updated_at | string | 更新时间（ISO 8601格式） |

#### 3.7 管理 API 端点

##### 3.7.1 获取 API 端点列表

```http
GET /api/v1/apis/{api_id}/endpoints
```

**查询参数**

- `page`: 页码
- `page_size`: 每页数量
- `is_active`: 是否激活

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取端点列表成功",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "api_id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "获取当前天气",
      "description": "根据城市获取当前天气信息",
      "path": "/weather/current",
      "method": "GET",
      "endpoint_type": "rest",
      "headers": {
        "Authorization": {
          "name": "Authorization",
          "type": "string",
          "description": "API认证令牌",
          "required": true
        }
      },
      "query_params": {
        "city": {
          "name": "city",
          "type": "string",
          "description": "城市名称",
          "example": "Beijing",
          "required": true
        }
      },
      "body_params": {},
      "response_params": {
        "temperature": {
          "type": "number",
          "description": "当前温度（摄氏度）"
        },
        "weather": {
          "type": "string",
          "description": "天气状况"
        }
      },
      "graphql_query": null,
      "graphql_variables": {},
      "graphql_operation_name": null,
      "graphql_schema": null,
      "price_per_call": 0.01,
      "total_calls": 150,
      "avg_response_time": 245,
      "success_rate": 98.5,
      "is_active": true,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "api_id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "用户查询接口",
      "description": "GraphQL用户数据查询",
      "path": "/graphql",
      "method": "POST",
      "endpoint_type": "graphql",
      "headers": {
        "Content-Type": {
          "name": "Content-Type",
          "type": "string",
          "description": "内容类型",
          "example": "application/json",
          "required": true
        }
      },
      "query_params": {},
      "body_params": {
        "application/json": {
          "media_type": "application/json",
          "schema_definition": {
            "type": "object",
            "properties": {
              "query": { "type": "string" },
              "variables": { "type": "object" },
              "operationName": { "type": "string" }
            }
          }
        }
      },
      "graphql_query": "query GetUser($userId: ID!) { user(id: $userId) { id name email } }",
      "graphql_variables": { "userId": "123" },
      "graphql_operation_name": "GetUser",
      "graphql_schema": "type User { id: ID! name: String! email: String! }",
      "price_per_call": 0.02,
      "total_calls": 89,
      "avg_response_time": 312,
      "success_rate": 96.2,
      "is_active": true,
      "created_at": "2024-01-15T11:00:00Z",
      "updated_at": "2024-01-15T11:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 10,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

**响应字段说明**

**端点对象字段：**
| 字段 | 类型 | 描述 |
|------|------|------|
| id | string | 端点唯一标识符（UUID） |
| api_id | string | 所属 API 的 UUID |
| name | string | 端点名称 |
| description | string | 端点描述 |
| path | string | 端点路径 |
| method | string | HTTP 方法：GET, POST, PUT, DELETE, PATCH |
| endpoint_type | string | 端点类型：rest 或 graphql |
| headers | object | 请求头参数配置 |
| query_params | object | 查询参数配置 |
| body_params | object | 请求体参数配置 |
| response_params | object | 响应参数类型定义 |
| graphql_query | string | GraphQL 查询语句（仅 GraphQL 端点） |
| graphql_variables | object | GraphQL 变量（仅 GraphQL 端点） |
| graphql_operation_name | string | GraphQL 操作名称（仅 GraphQL 端点） |
| graphql_schema | string | GraphQL 模式定义（仅 GraphQL 端点） |
| price_per_call | number | 每次调用价格（美元） |
| total_calls | integer | 总调用次数 |
| avg_response_time | number | 平均响应时间（毫秒） |
| success_rate | number | 成功率（百分比） |
| is_active | boolean | 是否激活 |
| created_at | string | 创建时间（ISO 8601格式） |
| updated_at | string | 更新时间（ISO 8601格式） |

**参数配置对象结构：**
| 字段 | 类型 | 描述 |
|------|------|------|
| name | string | 参数名称 |
| type | string | 参数类型：string, number, boolean, object, array |
| description | string | 参数描述 |
| example | any | 参数示例值 |
| required | boolean | 是否必填 |

##### 3.7.2 创建 API 端点

```http
POST /api/v1/apis/{api_id}/endpoints
```

**需要认证**: 是（必须是 API 所有者）

**路径参数**

- `api_id`: API 的 UUID

**REST端点请求体示例**

```json
{
  "name": "获取当前天气",
  "description": "根据城市获取当前天气信息",
  "path": "/weather/current",
  "method": "GET",
  "endpoint_type": "rest",
  "headers": {
    "Authorization": {
      "name": "Authorization",
      "type": "string",
      "description": "API认证令牌",
      "required": true
    }
  },
  "query_params": {
    "city": {
      "name": "city",
      "type": "string",
      "description": "城市名称",
      "example": "Beijing",
      "required": true
    }
  },
  "body_params": {},
  "response_params": {
    "temperature": {
      "type": "number",
      "description": "当前温度（摄氏度）"
    },
    "humidity": {
      "type": "number",
      "description": "湿度百分比"
    },
    "weather": {
      "type": "string",
      "description": "天气状况描述"
    },
    "wind_speed": {
      "type": "number",
      "description": "风速（米/秒）"
    }
  },
  "price_per_call": 0.01,
  "estimated_response_time": 500,
  "is_active": true
}
```

**GraphQL端点请求体示例**

```json
{
  "name": "用户查询接口",
  "description": "GraphQL用户数据查询",
  "path": "/graphql",
  "method": "POST",
  "endpoint_type": "graphql",
  "headers": {
    "Content-Type": {
      "name": "Content-Type",
      "type": "string",
      "description": "内容类型",
      "example": "application/json",
      "required": true
    }
  },
  "query_params": {},
  "body_params": {
    "application/json": {
      "media_type": "application/json",
      "schema_definition": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "variables": { "type": "object" },
          "operationName": { "type": "string" }
        }
      }
    }
  },
  "graphql_query": "query GetUser($userId: ID!) { user(id: $userId) { id name email } }",
  "graphql_variables": { "userId": "123" },
  "graphql_operation_name": "GetUser",
  "graphql_schema": "type User { id: ID! name: String! email: String! }",
  "price_per_call": 0.02,
  "estimated_response_time": 1200,
  "is_active": true
}
```

#### 请求字段说明

| 字段                    | 类型    | 必填 | 描述                                                    |
| ----------------------- | ------- | ---- | ------------------------------------------------------- |
| name                    | string  | 是   | 端点名称                                                |
| description             | string  | 否   | 端点描述                                                |
| path                    | string  | 是   | 端点路径                                                |
| method                  | string  | 是   | HTTP方法 (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS) |
| endpoint_type           | string  | 否   | 端点类型：`rest` 或 `graphql`，默认为 `rest`            |
| headers                 | object  | 否   | 请求头参数定义                                          |
| query_params            | object  | 否   | 查询参数定义                                            |
| body_params             | object  | 否   | 请求体参数定义                                          |
| response_params         | object  | 否   | 响应参数类型定义                                        |
| graphql_query           | string  | 否   | GraphQL查询模板（仅GraphQL端点）                        |
| graphql_variables       | object  | 否   | GraphQL默认变量（仅GraphQL端点）                        |
| graphql_operation_name  | string  | 否   | GraphQL操作名（仅GraphQL端点）                          |
| graphql_schema          | string  | 否   | GraphQL模式定义（仅GraphQL端点）                        |
| price_per_call          | number  | 否   | 每次调用价格，默认为0                                   |
| estimated_response_time | number  | 否   | 预估响应时间（毫秒），用于性能预期                      |
| is_active               | boolean | 否   | 是否启用，默认为true                                    |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "端点创建成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "api_id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "获取当前天气",
    "description": "根据城市获取当前天气信息",
    "path": "/weather/current",
    "method": "GET",
    "endpoint_type": "rest",
    "headers": {
      "Authorization": {
        "name": "Authorization",
        "type": "string",
        "description": "API认证令牌",
        "required": true
      }
    },
    "query_params": {
      "city": {
        "name": "city",
        "type": "string",
        "description": "城市名称",
        "example": "Beijing",
        "required": true
      }
    },
    "body_params": {},
    "response_params": {
      "temperature": {
        "type": "number",
        "description": "当前温度（摄氏度）"
      },
      "humidity": {
        "type": "number",
        "description": "湿度百分比"
      },
      "weather": {
        "type": "string",
        "description": "天气状况描述"
      }
    },
    "graphql_query": null,
    "graphql_variables": {},
    "graphql_operation_name": null,
    "graphql_schema": null,
    "price_per_call": 0.01,
    "total_calls": 0,
    "avg_response_time": null,
    "success_rate": null,
    "is_active": true,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

**响应字段说明**

| 字段                   | 类型    | 描述                                                    |
| ---------------------- | ------- | ------------------------------------------------------- |
| id                     | string  | 端点唯一标识符（UUID）                                  |
| api_id                 | string  | 所属 API 的 UUID                                        |
| name                   | string  | 端点名称                                                |
| description            | string  | 端点描述                                                |
| path                   | string  | 端点路径                                                |
| method                 | string  | HTTP 方法：GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS |
| endpoint_type          | string  | 端点类型：rest 或 graphql                               |
| headers                | object  | 请求头参数配置对象                                      |
| query_params           | object  | 查询参数配置对象                                        |
| body_params            | object  | 请求体参数配置对象                                      |
| response_params        | object  | 响应参数类型定义对象                                    |
| graphql_query          | string  | GraphQL 查询语句（仅 GraphQL 端点）                     |
| graphql_variables      | object  | GraphQL 变量（仅 GraphQL 端点）                         |
| graphql_operation_name | string  | GraphQL 操作名称（仅 GraphQL 端点）                     |
| graphql_schema         | string  | GraphQL 模式定义（仅 GraphQL 端点）                     |
| price_per_call         | number  | 每次调用价格（美元）                                    |
| total_calls            | integer | 总调用次数，新创建端点为 0                              |
| avg_response_time      | number  | 平均响应时间（毫秒），初始为 null                       |
| success_rate           | number  | 成功率（百分比），初始为 null                           |
| is_active              | boolean | 是否激活                                                |
| created_at             | string  | 创建时间（ISO 8601格式）                                |
| updated_at             | string  | 最后更新时间（ISO 8601格式）                            |

##### 3.7.3 更新端点

```http
PATCH /api/v1/apis/{api_id}/endpoints/{endpoint_id}
```

**需要认证**: 是（必须是 API 所有者）

**路径参数**

- `api_id`: API 的 UUID
- `endpoint_id`: 端点的 UUID

**请求体**（只需包含要更新的字段）

```json
{
  "name": "获取详细天气信息",
  "description": "根据城市获取详细的天气信息，包括温度、湿度、风速等",
  "is_active": true,
  "price_per_call": 0.01,
  "headers": {
    "Authorization": {
      "name": "Authorization",
      "type": "string",
      "description": "API认证令牌",
      "required": true
    }
  },
  "query_params": {
    "city": {
      "name": "city",
      "type": "string",
      "description": "城市名称",
      "example": "Beijing",
      "required": true
    },
    "unit": {
      "name": "unit",
      "type": "string",
      "description": "温度单位",
      "example": "celsius",
      "required": false
    }
  },
  "body_params": {},
  "response_params": {}
}
```

**请求参数说明**

| 参数                    | 类型    | 必填 | 描述                                |
| ----------------------- | ------- | ---- | ----------------------------------- |
| name                    | string  | 否   | 端点名称，最大 255 字符             |
| description             | string  | 否   | 端点描述                            |
| headers                 | object  | 否   | 请求头参数定义对象                  |
| query_params            | object  | 否   | 查询参数定义对象                    |
| body_params             | object  | 否   | 请求体参数定义对象                  |
| response_params         | object  | 否   | 响应参数类型定义对象                |
| graphql_query           | string  | 否   | GraphQL 查询语句（仅 GraphQL 端点） |
| graphql_variables       | object  | 否   | GraphQL 变量（仅 GraphQL 端点）     |
| graphql_operation_name  | string  | 否   | GraphQL 操作名称（仅 GraphQL 端点） |
| graphql_schema          | string  | 否   | GraphQL 模式定义（仅 GraphQL 端点） |
| price_per_call          | number  | 否   | 每次调用价格（美元），最小值 0      |
| estimated_response_time | number  | 否   | 预估响应时间（毫秒）                |
| is_active               | boolean | 否   | 是否激活端点                        |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "端点更新成功",
  "data": {
    "id": "endpoint-uuid",
    "api_id": "api-uuid",
    "path": "/weather/current",
    "method": "GET",
    "endpoint_type": "rest",
    "name": "获取详细天气信息",
    "description": "根据城市获取详细的天气信息，包括温度、湿度、风速等",
    "is_active": true,
    "price_per_call": 0.01,
    "total_calls": 1250,
    "avg_response_time": 0.245,
    "success_rate": 99.8,
    "headers": {
      "Authorization": {
        "name": "Authorization",
        "type": "string",
        "description": "API认证令牌",
        "required": true
      }
    },
    "query_params": {
      "city": {
        "name": "city",
        "type": "string",
        "description": "城市名称",
        "example": "Beijing",
        "required": true
      },
      "unit": {
        "name": "unit",
        "type": "string",
        "description": "温度单位",
        "example": "celsius",
        "required": false
      }
    },
    "body_params": {},
    "response_params": {
      "temperature": {
        "type": "number",
        "description": "当前温度"
      },
      "humidity": {
        "type": "number",
        "description": "湿度百分比"
      },
      "weather": {
        "type": "string",
        "description": "天气状况描述"
      },
      "wind_speed": {
        "type": "number",
        "description": "风速（米/秒）"
      }
    },
    "graphql_query": null,
    "graphql_variables": {},
    "graphql_operation_name": null,
    "graphql_schema": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

**响应字段说明**

| 字段                   | 类型    | 描述                                |
| ---------------------- | ------- | ----------------------------------- |
| id                     | string  | 端点唯一标识符（UUID）              |
| api_id                 | string  | 所属 API 的 UUID                    |
| path                   | string  | 端点路径                            |
| method                 | string  | HTTP 方法                           |
| endpoint_type          | string  | 端点类型：rest 或 graphql           |
| name                   | string  | 端点名称                            |
| description            | string  | 端点描述                            |
| is_active              | boolean | 是否激活                            |
| price_per_call         | number  | 每次调用价格（美元）                |
| total_calls            | integer | 总调用次数                          |
| avg_response_time      | number  | 平均响应时间（毫秒）                |
| success_rate           | number  | 成功率（百分比）                    |
| headers                | object  | 请求头参数配置                      |
| query_params           | object  | 查询参数配置                        |
| body_params            | object  | 请求体参数配置                      |
| response_params        | object  | 响应参数类型定义                    |
| graphql_query          | string  | GraphQL 查询语句（仅 GraphQL 端点） |
| graphql_variables      | object  | GraphQL 变量（仅 GraphQL 端点）     |
| graphql_operation_name | string  | GraphQL 操作名称（仅 GraphQL 端点） |
| graphql_schema         | string  | GraphQL 模式定义（仅 GraphQL 端点） |
| created_at             | string  | 创建时间（ISO 8601格式）            |
| updated_at             | string  | 最后更新时间（ISO 8601格式）        |

##### 3.7.4 删除端点

```http
DELETE /api/v1/apis/{api_id}/endpoints/{endpoint_id}
```

**需要认证**: 是（必须是 API 所有者）

**路径参数**

- `api_id`: API 的 UUID
- `endpoint_id`: 端点的 UUID

**响应示例**

```json
{
  "success": true,
  "code": "ENDPOINT_DELETED",
  "message": "端点删除成功",
  "data": null
}
```

#### 3.8 管理 API 版本

##### 3.8.1 获取 API 版本历史

```http
GET /api/v1/apis/{api_id}/versions
```

获取 API 的版本历史记录。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取版本历史成功",
  "data": [
    {
      "id": "version-uuid",
      "api_id": "api-uuid",
      "version": "1.2.0",
      "changelog": "Added new endpoints for user management",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**响应字段说明**

| 字段       | 类型    | 描述                     |
| ---------- | ------- | ------------------------ |
| id         | string  | 版本唯一标识符（UUID）   |
| api_id     | string  | 所属 API 的 UUID         |
| version    | string  | 版本号                   |
| changelog  | string  | 版本更新日志             |
| is_active  | boolean | 是否为活跃版本           |
| created_at | string  | 创建时间（ISO 8601格式） |

##### 3.8.2 创建 API 版本

```http
POST /api/v1/apis/{api_id}/versions
```

**需要认证**: 是（必须是 API 所有者）

创建新的 API 版本。

**路径参数**

- `api_id`: API 的 UUID

**请求体**

```json
{
  "version": "1.2.0",
  "changelog": "Added new endpoints for user management"
}
```

**请求参数说明**

| 参数      | 类型   | 必填 | 描述                                                 |
| --------- | ------ | ---- | ---------------------------------------------------- |
| version   | string | 是   | 版本号，最大 20 字符，建议使用语义化版本（如 1.2.0） |
| changelog | string | 否   | 版本更新日志，描述此版本的变更内容                   |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "API 版本创建成功",
  "data": {
    "id": "version-uuid",
    "api_id": "api-uuid",
    "version": "1.2.0",
    "changelog": "Added new endpoints for user management",
    "is_current": true,
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

**响应字段说明**

| 字段       | 类型    | 描述                               |
| ---------- | ------- | ---------------------------------- |
| id         | string  | 版本唯一标识符（UUID）             |
| api_id     | string  | 所属 API 的 UUID                   |
| version    | string  | 版本号                             |
| changelog  | string  | 版本更新日志，描述此版本的变更内容 |
| is_current | boolean | 是否为当前活跃版本                 |
| created_at | string  | 版本创建时间（ISO 8601格式）       |

#### 3.9 管理 API 文档

##### 3.9.1 更新 API 文档

```http
PUT /api/v1/apis/{api_id}/documentation
```

**需要认证**: 是（必须是 API 所有者）

更新 API 的文档内容。

**路径参数**

- `api_id`: API 的 UUID

**请求体**

````json
{
  "documentation": "# Weather API Documentation\n\n## Overview\n\nThis API provides comprehensive weather information for cities worldwide.\n\n## Getting Started\n\n1. Get your API key\n2. Make your first request\n3. Handle responses\n\n## Endpoints\n\n### GET /weather/current\n\nReturns current weather conditions for a specified city.\n\n**Parameters:**\n- `city` (string, required): The name of the city\n- `unit` (string, optional): Temperature unit (celsius/fahrenheit)\n\n**Example Request:**\n```\nGET /weather/current?city=Beijing&unit=celsius\n```\n\n**Example Response:**\n```json\n{\n  \"temperature\": 25,\n  \"humidity\": 60,\n  \"description\": \"Partly cloudy\"\n}\n```"
}
````

**请求参数说明**

| 参数          | 类型   | 必填 | 描述                                                                        |
| ------------- | ------ | ---- | --------------------------------------------------------------------------- |
| documentation | string | 是   | API 文档内容，支持 Markdown 格式，用于描述 API 的使用方法、参数说明、示例等 |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "API 文档更新成功",
  "data": {
    "id": "api-uuid",
    "name": "Weather API",
    "slug": "weather-api",
    "documentation": "# Weather API Documentation\n\n## Overview\n\nThis API provides comprehensive weather information for cities worldwide...",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**响应字段说明**

| 字段          | 类型   | 描述                                   |
| ------------- | ------ | -------------------------------------- |
| id            | string | API 唯一标识符（UUID）                 |
| name          | string | API 名称                               |
| slug          | string | API 唯一标识符                         |
| documentation | string | 更新后的 API 文档内容（Markdown 格式） |
| updated_at    | string | 最后更新时间（ISO 8601格式）           |

##### 3.9.2 获取 API 文档

```http
GET /api/v1/apis/{api_id}/documentation
```

获取 API 的文档内容，返回 Markdown 格式文本。

**路径参数**

- `api_id`: API 的 UUID

**响应示例**

````json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取 API 文档成功",
  "data": {
    "api_id": "api-uuid",
    "documentation": "# Weather API Documentation\n\n## Overview\n\nThis API provides comprehensive weather information for cities worldwide.\n\n## Getting Started\n\n1. Get your API key\n2. Make your first request\n3. Handle responses\n\n## Endpoints\n\n### GET /weather/current\n\nReturns current weather conditions for a specified city.\n\n**Parameters:**\n- `city` (string, required): The name of the city\n- `unit` (string, optional): Temperature unit (celsius/fahrenheit)\n\n**Example Request:**\n```\nGET /weather/current?city=Beijing&unit=celsius\n```\n\n**Example Response:**\n```json\n{\n  \"temperature\": 25,\n  \"humidity\": 60,\n  \"description\": \"Partly cloudy\"\n}\n```",
    "last_updated": "2024-01-15T10:30:00Z"
  }
}
````

**响应字段说明**

| 字段          | 类型   | 描述                             |
| ------------- | ------ | -------------------------------- |
| api_id        | string | API 唯一标识符（UUID）           |
| documentation | string | API 文档内容（Markdown 格式）    |
| last_updated  | string | 文档最后更新时间（ISO 8601格式） |

### 4. API 密钥管理

#### 4.1 获取密钥列表

```http
GET /api/v1/keys/
```

**需要认证**: 是

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取密钥列表成功",
  "data": [
    {
      "id": "key-uuid",
      "key": "vola_live_abc***xyz",
      "name": "生产环境密钥",
      "description": "用于生产环境的API密钥",
      "is_active": true,
      "allowed_origins": "https://myapp.com",
      "allowed_ips": "192.168.1.1",
      "rate_limit_per_minute": 1000,
      "monthly_quota": 100000,
      "total_requests": 1250,
      "last_used_at": "2024-01-15T10:00:00Z",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 3,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

**响应字段说明**

| 字段                  | 类型    | 描述                             |
| --------------------- | ------- | -------------------------------- |
| id                    | string  | 密钥唯一标识符（UUID）           |
| key                   | string  | API 密钥（部分字符用\*\*\*隐藏） |
| name                  | string  | 密钥名称                         |
| description           | string  | 密钥描述信息                     |
| is_active             | boolean | 是否激活状态                     |
| allowed_origins       | string  | 允许的来源域名列表（逗号分隔）   |
| allowed_ips           | string  | 允许的IP地址列表（逗号分隔）     |
| rate_limit_per_minute | integer | 每分钟请求限制数量               |
| monthly_quota         | integer | 每月请求配额限制                 |
| total_requests        | integer | 累计请求次数                     |
| last_used_at          | string  | 最后使用时间（ISO 8601格式）     |
| created_at            | string  | 创建时间（ISO 8601格式）         |
| updated_at            | string  | 最后更新时间（ISO 8601格式）     |

#### 4.2 创建 API 密钥

```http
POST /api/v1/keys/
```

**需要认证**: 是

**限制**: 每个用户最多创建 10 个活跃密钥

**请求体**

```json
{
  "name": "生产环境密钥",
  "description": "用于生产环境的API密钥",
  "allowed_origins": "https://myapp.com,https://app.myapp.com",
  "allowed_ips": "192.168.1.1,192.168.1.2,10.0.0.0/24",
  "rate_limit_per_minute": 1000,
  "monthly_quota": 100000
}
```

**请求参数说明**

| 参数                  | 类型    | 必填 | 描述                                                             |
| --------------------- | ------- | ---- | ---------------------------------------------------------------- |
| name                  | string  | 是   | API密钥名称                                                      |
| description           | string  | 否   | 密钥描述信息                                                     |
| allowed_origins       | string  | 否   | 允许的来源域名，逗号分隔，支持通配符（如 `*.example.com`）       |
| allowed_ips           | string  | 否   | 允许的IP地址或CIDR范围，逗号分隔（如 `192.168.1.1,10.0.0.0/24`） |
| rate_limit_per_minute | integer | 否   | 每分钟请求限制，默认60                                           |
| monthly_quota         | integer | 否   | 每月请求配额限制，不设置则无限制                                 |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "密钥创建成功",
  "data": {
    "id": "key-uuid",
    "key": "vola_live_abcdefghijklmnopqrstuvwxyz123456",
    "name": "生产环境密钥",
    "description": "用于生产环境的API密钥",
    "is_active": true,
    "allowed_origins": "https://myapp.com,https://app.myapp.com",
    "allowed_ips": "192.168.1.1,192.168.1.2,10.0.0.0/24",
    "rate_limit_per_minute": 1000,
    "monthly_quota": 100000,
    "total_requests": 0,
    "last_used_at": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**响应字段说明**

| 字段                  | 类型    | 描述                                      |
| --------------------- | ------- | ----------------------------------------- |
| id                    | string  | 密钥唯一标识符（UUID）                    |
| key                   | string  | 完整的 API 密钥（仅在创建时显示完整密钥） |
| name                  | string  | 密钥名称                                  |
| description           | string  | 密钥描述信息                              |
| is_active             | boolean | 是否激活状态                              |
| allowed_origins       | string  | 允许的来源域名列表（逗号分隔）            |
| allowed_ips           | string  | 允许的IP地址列表（逗号分隔）              |
| rate_limit_per_minute | integer | 每分钟请求限制数量                        |
| monthly_quota         | integer | 每月请求配额限制                          |
| total_requests        | integer | 累计请求次数（新建时为 0）                |
| last_used_at          | string  | 最后使用时间（新建时为 null）             |
| created_at            | string  | 创建时间（ISO 8601格式）                  |
| updated_at            | string  | 最后更新时间（ISO 8601格式）              |

**注意**: 完整的密钥只在创建时返回一次，请妥善保存。

#### 4.3 获取密钥详情

```http
GET /api/v1/keys/{key_id}
```

**需要认证**: 是

获取指定密钥的详细信息。

**路径参数**

- `key_id`: 密钥的 UUID

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取密钥详情成功",
  "data": {
    "id": "key-uuid",
    "name": "生产环境密钥",
    "key_preview": "vola_live_abc***456",
    "is_active": true,
    "allowed_origins": "https://myapp.com,https://app.myapp.com",
    "allowed_ips": "192.168.1.1",
    "rate_limit_per_minute": 1000,
    "monthly_quota": 100000,
    "total_requests": 1250,
    "last_used_at": "2024-01-15T09:30:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-10T00:00:00Z"
  }
}
```

**响应字段说明**

| 字段                  | 类型    | 描述                             |
| --------------------- | ------- | -------------------------------- |
| id                    | string  | 密钥唯一标识符（UUID）           |
| name                  | string  | 密钥名称                         |
| key_preview           | string  | 密钥预览（部分字符用\*\*\*隐藏） |
| is_active             | boolean | 是否激活状态                     |
| allowed_origins       | string  | 允许的来源域名列表（逗号分隔）   |
| allowed_ips           | string  | 允许的IP地址列表（逗号分隔）     |
| rate_limit_per_minute | integer | 每分钟请求限制数量               |
| monthly_quota         | integer | 每月请求配额限制                 |
| total_requests        | integer | 累计请求次数                     |
| last_used_at          | string  | 最后使用时间（ISO 8601格式）     |
| created_at            | string  | 创建时间（ISO 8601格式）         |
| updated_at            | string  | 最后更新时间（ISO 8601格式）     |

#### 4.4 更新密钥配置

```http
PATCH /api/v1/keys/{key_id}
```

**需要认证**: 是

更新密钥的配置，如允许的域名、IP 地址等。

**路径参数**

- `key_id`: 密钥的 UUID

**请求体**（只需包含要更新的字段）

```json
{
  "name": "更新的密钥名称",
  "description": "更新的密钥描述",
  "allowed_origins": "https://newdomain.com,https://api.newdomain.com",
  "allowed_ips": "10.0.0.1,10.0.0.0/24",
  "rate_limit_per_minute": 500,
  "monthly_quota": 50000,
  "is_active": false
}
```

**请求参数说明**

| 参数                  | 类型    | 必填 | 描述                                                             |
| --------------------- | ------- | ---- | ---------------------------------------------------------------- |
| name                  | string  | 否   | 密钥名称，最大 255 字符                                          |
| description           | string  | 否   | 密钥描述信息，最大 500 字符                                      |
| allowed_origins       | string  | 否   | 允许的来源域名，逗号分隔，支持通配符（如 `*.example.com`）       |
| allowed_ips           | string  | 否   | 允许的IP地址或CIDR范围，逗号分隔（如 `192.168.1.1,10.0.0.0/24`） |
| rate_limit_per_minute | integer | 否   | 每分钟请求限制，最小值 1                                         |
| monthly_quota         | integer | 否   | 每月请求配额限制，不设置则无限制                                 |
| is_active             | boolean | 否   | 是否激活密钥                                                     |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "密钥配置更新成功",
  "data": {
    "id": "key-uuid",
    "name": "更新的密钥名称",
    "key_preview": "vola_live_abc***456",
    "is_active": false,
    "allowed_origins": "https://newdomain.com,https://api.newdomain.com",
    "allowed_ips": "10.0.0.1,10.0.0.0/24",
    "rate_limit_per_minute": 500,
    "monthly_quota": 50000,
    "total_requests": 1250,
    "last_used_at": "2024-01-15T09:30:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:45:00Z"
  }
}
```

**响应字段说明**

| 字段                  | 类型    | 描述                                 |
| --------------------- | ------- | ------------------------------------ |
| id                    | string  | 密钥唯一标识符（UUID）               |
| name                  | string  | 更新后的密钥名称                     |
| key_preview           | string  | 密钥预览（部分字符用\*\*\*隐藏）     |
| is_active             | boolean | 更新后的激活状态                     |
| allowed_origins       | string  | 更新后的允许来源域名列表（逗号分隔） |
| allowed_ips           | string  | 更新后的允许IP地址列表（逗号分隔）   |
| rate_limit_per_minute | integer | 更新后的每分钟请求限制数量           |
| monthly_quota         | integer | 更新后的每月请求配额限制             |
| total_requests        | integer | 累计请求次数（不变）                 |
| last_used_at          | string  | 最后使用时间（ISO 8601格式）         |
| created_at            | string  | 创建时间（ISO 8601格式）             |
| updated_at            | string  | 最后更新时间（ISO 8601格式）         |

#### 4.5 删除密钥

```http
DELETE /api/v1/keys/{key_id}
```

**需要认证**: 是

删除指定的 API 密钥。

**路径参数**

- `key_id`: 密钥的 UUID

**响应示例**

```json
{
  "success": true,
  "code": "DELETED",
  "message": "API key deleted successfully",
  "data": null
}
```

#### 4.6 重新生成密钥

```http
POST /api/v1/keys/{key_id}/regenerate
```

**需要认证**: 是

生成新的密钥值，旧密钥立即失效。

**路径参数**

- `key_id`: 密钥的 UUID

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "密钥重新生成成功",
  "data": {
    "id": "key-uuid",
    "name": "生产环境密钥",
    "key": "vola_live_newabcdefghijklmnopqrstuvwxyz654321",
    "key_preview": "vola_live_new***321",
    "is_active": true,
    "allowed_origins": ["https://myapp.com"],
    "allowed_ips": ["192.168.1.1"],
    "rate_limit_per_minute": 1000,
    "monthly_quota": 100000,
    "total_requests": 0,
    "last_used_at": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

**注意**: 重新生成后，完整的新密钥只会返回一次，请妥善保存。旧密钥会立即失效。

**响应字段说明**

| 字段                  | 类型          | 描述                                        |
| --------------------- | ------------- | ------------------------------------------- |
| id                    | string        | 密钥唯一标识符（UUID）                      |
| name                  | string        | 密钥名称                                    |
| key                   | string        | 新生成的完整 API 密钥（仅此次返回完整密钥） |
| key_preview           | string        | 新密钥预览（部分字符用\*\*\*隐藏）          |
| is_active             | boolean       | 密钥激活状态                                |
| allowed_origins       | array[string] | 允许的来源域名列表                          |
| allowed_ips           | array[string] | 允许的IP地址列表                            |
| rate_limit_per_minute | integer       | 每分钟请求限制数量                          |
| monthly_quota         | integer       | 每月请求配额限制                            |
| total_requests        | integer       | 累计请求次数（重置为 0）                    |
| last_used_at          | string        | 最后使用时间（重置为 null）                 |
| created_at            | string        | 创建时间（ISO 8601格式）                    |
| updated_at            | string        | 最后更新时间（ISO 8601格式）                |

### 5. 计费与使用统计

#### 5.1 获取账户余额

```http
GET /api/v1/billing/balance
```

**需要认证**: 是

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Account balance retrieved successfully",
  "data": {
    "subscription_balance": 100.0,
    "one_time_balance": 50.0,
    "total_balance": 150.0
  }
}
```

**响应字段说明**

| 字段                 | 类型   | 描述                                                    |
| -------------------- | ------ | ------------------------------------------------------- |
| subscription_balance | number | 订阅余额（美元），来自订阅计划                          |
| one_time_balance     | number | 一次性充值余额（美元），来自直接充值                    |
| total_balance        | number | 总余额（美元），subscription_balance + one_time_balance |

#### 5.2 获取交易记录

```http
GET /api/v1/billing/transactions
```

**需要认证**: 是

**查询参数**
| 参数 | 类型 | 描述 |
|-----|------|------|
| page | integer | 页码 |
| page_size | integer | 每页数量 |
| transaction_type | string | 类型：deposit, api_usage, node_purchase, subscription, refund, adjustment, revenue |
| start_date | datetime | 开始日期 |
| end_date | datetime | 结束日期 |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取交易记录成功",
  "data": [
    {
      "id": "trans-uuid",
      "user_id": "user-uuid",
      "type": "api_usage",
      "status": "completed",
      "amount": -0.01,
      "currency": "USD",
      "description": "API 调用: Weather API",
      "metadata": {
        "api_id": "api-uuid",
        "api_name": "Weather API",
        "endpoint": "/weather/current"
      },
      "balance_after": 149.99,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 100,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

**响应字段说明**

| 字段          | 类型   | 描述                                                                                                                                                  |
| ------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| id            | string | 交易唯一标识符（UUID）                                                                                                                                |
| user_id       | string | 用户 ID                                                                                                                                               |
| type          | string | 交易类型：deposit（充值）, api_usage（API使用）, node_purchase（节点购买）, subscription（订阅）, refund（退款）, adjustment（调整）, revenue（收入） |
| status        | string | 交易状态：pending（待处理）, completed（已完成）, failed（失败）, cancelled（已取消）                                                                 |
| amount        | number | 交易金额（美元），正数表示收入，负数表示支出                                                                                                          |
| currency      | string | 货币类型，固定为 "USD"                                                                                                                                |
| description   | string | 交易描述                                                                                                                                              |
| metadata      | object | 交易相关的元数据信息                                                                                                                                  |
| balance_after | number | 交易后的账户余额（美元）                                                                                                                              |
| created_at    | string | 交易创建时间（ISO 8601格式）                                                                                                                          |
| updated_at    | string | 交易更新时间（ISO 8601格式）                                                                                                                          |

#### 5.3 获取使用记录

```http
GET /api/v1/billing/usage
```

**需要认证**: 是

**查询参数**
| 参数 | 类型 | 描述 |
|-----|------|------|
| page | integer | 页码 |
| page_size | integer | 每页数量 |
| start_date | datetime | 开始日期 |
| end_date | datetime | 结束日期 |
| api_id | uuid | 按 API ID 过滤 |

获取详细的 API 使用记录。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取使用记录成功",
  "data": [
    {
      "id": "usage-uuid",
      "request_id": "req-12345",
      "api_name": "Weather API",
      "endpoint_name": "获取当前天气",
      "method": "GET",
      "path": "/weather/current",
      "status_code": 200,
      "response_time": 0.123,
      "cost": 0.01,
      "ip_address": "192.168.1.100",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 1000,
    "total_pages": 50,
    "has_next": true,
    "has_prev": false
  }
}
```

**响应字段说明**

| 字段          | 类型    | 描述                                   |
| ------------- | ------- | -------------------------------------- |
| id            | string  | 使用记录唯一标识符（UUID）             |
| request_id    | string  | 请求唯一标识符                         |
| api_name      | string  | API 名称                               |
| endpoint_name | string  | 端点名称                               |
| method        | string  | HTTP 方法（GET, POST, PUT, DELETE 等） |
| path          | string  | 请求路径                               |
| status_code   | integer | HTTP 状态码                            |
| response_time | number  | 响应时间（秒）                         |
| cost          | number  | 本次调用费用（美元）                   |
| ip_address    | string  | 请求来源 IP 地址                       |
| created_at    | string  | 调用时间（ISO 8601格式）               |

#### 5.4 获取使用统计

```http
GET /api/v1/billing/stats
```

**需要认证**: 是

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取统计数据成功",
  "data": {
    "total_requests": 10000,
    "total_cost": 10.0,
    "requests_this_month": 5000,
    "cost_this_month": 5.0,
    "top_apis": [
      {
        "name": "Weather API",
        "requests": 3000,
        "cost": 3.0
      }
    ],
    "daily_usage": [
      {
        "date": "2024-01-15",
        "requests": 100,
        "cost": 0.1
      }
    ]
  }
}
```

**响应字段说明**

| 字段                   | 类型          | 描述                   |
| ---------------------- | ------------- | ---------------------- |
| total_requests         | integer       | 总请求数量             |
| total_cost             | number        | 总费用（美元）         |
| requests_this_month    | integer       | 本月请求数量           |
| cost_this_month        | number        | 本月费用（美元）       |
| top_apis               | array[object] | 最常用的 API 列表      |
| top_apis[].name        | string        | API 名称               |
| top_apis[].requests    | integer       | 该 API 的请求数量      |
| top_apis[].cost        | number        | 该 API 的费用（美元）  |
| daily_usage            | array[object] | 每日使用统计列表       |
| daily_usage[].date     | string        | 日期（YYYY-MM-DD格式） |
| daily_usage[].requests | integer       | 该日的请求数量         |
| daily_usage[].cost     | number        | 该日的费用（美元）     |

#### 5.5 获取订阅信息

```http
GET /api/v1/billing/subscriptions
```

**需要认证**: 是

获取用户的订阅信息列表。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取订阅信息成功",
  "data": [
    {
      "id": "sub-uuid",
      "plan": "pro",
      "status": "active",
      "monthly_price": 29.99,
      "monthly_credits": 1000.0,
      "current_period_start": "2024-01-01T00:00:00Z",
      "current_period_end": "2024-02-01T00:00:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**响应字段说明**

| 字段                 | 类型   | 描述                                                                               |
| -------------------- | ------ | ---------------------------------------------------------------------------------- |
| id                   | string | 订阅唯一标识符（UUID）                                                             |
| plan                 | string | 订阅计划类型：basic（基础版）, pro（专业版）, enterprise（企业版）                 |
| status               | string | 订阅状态：active（活跃）, cancelled（已取消）, expired（已过期）, past_due（逾期） |
| monthly_price        | number | 月费价格（美元）                                                                   |
| monthly_credits      | number | 每月信用额度（美元）                                                               |
| current_period_start | string | 当前计费周期开始时间（ISO 8601格式）                                               |
| current_period_end   | string | 当前计费周期结束时间（ISO 8601格式）                                               |
| created_at           | string | 订阅创建时间（ISO 8601格式）                                                       |

#### 5.6 获取发票列表

```http
GET /api/v1/billing/invoices
```

**需要认证**: 是

获取用户的发票列表。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Invoice list retrieved successfully",
  "data": [
    {
      "id": "invoice-uuid",
      "invoice_number": "INV-2024-001",
      "amount": 29.99,
      "currency": "USD",
      "is_paid": true,
      "paid_at": "2024-01-01T10:30:00Z",
      "invoice_pdf_url": "https://api.vola.fun/invoices/invoice-uuid.pdf",
      "period_start": "2024-01-01T00:00:00Z",
      "period_end": "2024-02-01T00:00:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 50,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

**响应字段说明**

| 字段            | 类型    | 描述                             |
| --------------- | ------- | -------------------------------- |
| id              | string  | 发票唯一标识符（UUID）           |
| invoice_number  | string  | 发票编号                         |
| amount          | number  | 发票金额（美元）                 |
| currency        | string  | 货币类型，固定为 "USD"           |
| is_paid         | boolean | 是否已支付                       |
| paid_at         | string  | 支付时间（ISO 8601格式）         |
| invoice_pdf_url | string  | 发票 PDF 下载链接                |
| period_start    | string  | 计费周期开始时间（ISO 8601格式） |
| period_end      | string  | 计费周期结束时间（ISO 8601格式） |
| created_at      | string  | 发票创建时间（ISO 8601格式）     |

#### 5.7 导出使用数据

```http
GET /api/v1/billing/export
```

**需要认证**: 是

导出用户的使用数据，支持多种格式。

**查询参数**
| 参数 | 类型 | 必填 | 描述 |
|-----|------|-----|------|
| format | string | 否 | 导出格式：csv 或 json，默认 csv |
| start_date | datetime | 否 | 开始日期，ISO 8601 格式 |
| end_date | datetime | 否 | 结束日期，ISO 8601 格式 |
| api_id | uuid | 否 | 按 API ID 过滤 |

**响应示例**

当 `format=json` 时：

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "数据导出成功",
  "data": {
    "export_format": "json",
    "date_range": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-31T23:59:59Z"
    },
    "total_records": 1500,
    "usage_data": [
      {
        "date": "2024-01-01T10:30:00Z",
        "api_id": "api-uuid",
        "api_name": "Weather API",
        "endpoint": "/weather/current",
        "method": "GET",
        "response_time": 123,
        "status_code": 200,
        "cost": 0.01,
        "user_agent": "MyApp/1.0",
        "ip_address": "192.168.1.1"
      }
    ]
  }
}
```

**JSON 格式响应字段说明**

| 字段                       | 类型          | 描述                     |
| -------------------------- | ------------- | ------------------------ |
| export_format              | string        | 导出格式（json）         |
| date_range                 | object        | 导出的日期范围           |
| date_range.start           | string        | 开始时间（ISO 8601格式） |
| date_range.end             | string        | 结束时间（ISO 8601格式） |
| total_records              | integer       | 总记录数                 |
| usage_data                 | array[object] | 使用数据列表             |
| usage_data[].date          | string        | 使用时间（ISO 8601格式） |
| usage_data[].api_id        | string        | API 唯一标识符（UUID）   |
| usage_data[].api_name      | string        | API 名称                 |
| usage_data[].endpoint      | string        | 端点路径                 |
| usage_data[].method        | string        | HTTP 方法                |
| usage_data[].response_time | integer       | 响应时间（毫秒）         |
| usage_data[].status_code   | integer       | HTTP 状态码              |
| usage_data[].cost          | number        | 费用（美元）             |
| usage_data[].user_agent    | string        | 用户代理字符串           |
| usage_data[].ip_address    | string        | 客户端 IP 地址           |

当 `format=csv` 时，返回 CSV 文件下载：

```
Content-Type: text/csv
Content-Disposition: attachment; filename="usage-export-2024-01-01-to-2024-01-31.csv"

date,api_id,api_name,endpoint,method,response_time,status_code,cost,user_agent,ip_address
2024-01-01T10:30:00Z,api-uuid,Weather API,/weather/current,GET,123,200,0.01,MyApp/1.0,192.168.1.1
2024-01-01T10:35:00Z,api-uuid,Weather API,/weather/forecast,GET,156,200,0.02,MyApp/1.0,192.168.1.1
...
```

### 6. API 网关

#### 6.1 代理 API 调用

```http
{METHOD} /api/v1/gateway/{api_slug}/{endpoint_path}
```

**认证**: 使用 x-vola-key 头

**请求头**
| 头名称 | 必填 | 描述 |
|--------|------|------|
| x-vola-key | 是 | API 密钥，用于认证和计费 |
| x-vola-host | 否 | 指定目标主机，用于多环境路由（需要在 allowed_origins 中配置）。某些API配置可能要求此头 |
| x-vola-gateway | 否 | 网关认证密钥，如果API配置了gateway_key，网关会自动填充此值 |

**示例**

```bash
curl -X GET \
  https://api.vola.fun/api/v1/gateway/weather-api/weather/current?city=Beijing \
  -H "x-vola-key: vola_live_abcdef123456"
```

**说明**

- 支持所有 HTTP 方法（GET, POST, PUT, DELETE 等）
- 自动处理请求转发、响应返回
- 自动记录使用量并计费，包括请求参数、响应数据和成功/失败状态
- 支持速率限制和月度配额控制
- 支持 IP/来源域名白名单验证
- GraphQL 请求支持复杂度检查和请求大小限制
- 失败请求自动退款：当 API 调用失败（HTTP 状态码 >= 400）时，系统会自动为用户退款

#### 6.2 检查 API 健康状态

```http
GET /api/v1/gateway/health/{api_slug}
```

**响应示例**

当API配置了健康检查URL且检查成功时：

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "API 健康检查成功",
  "data": {
    "api_slug": "weather-api",
    "status": "healthy",
    "health_check_status": 200,
    "response_time": 0.123
  }
}
```

当API配置了健康检查URL但检查失败时：

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "API 健康检查成功",
  "data": {
    "api_slug": "weather-api",
    "status": "unhealthy",
    "error": "Connection timeout"
  }
}
```

当API未配置健康检查URL时：

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "API 健康检查成功",
  "data": {
    "api_slug": "weather-api",
    "status": "unknown",
    "message": "No health check URL configured"
  }
}
```

**响应字段说明**

| 字段                | 类型    | 描述                                                                            |
| ------------------- | ------- | ------------------------------------------------------------------------------- |
| api_slug            | string  | API 唯一标识符                                                                  |
| status              | string  | 健康状态：healthy（健康）, unhealthy（不健康）, unknown（未知，未配置健康检查） |
| health_check_status | integer | 健康检查的 HTTP 状态码（仅当配置了健康检查且检查成功时）                        |
| response_time       | number  | 健康检查响应时间（秒，仅当配置了健康检查且检查成功时）                          |
| error               | string  | 错误信息（仅当配置了健康检查但检查失败时）                                      |
| message             | string  | 状态消息（仅当未配置健康检查时）                                                |

### 7. 收藏管理

#### 7.1 添加收藏

```http
POST /api/v1/favorites
```

**需要认证**: 是

将 API 或节点添加到用户收藏列表。

**请求体**

```json
{
  "favorite_type": "api",
  "favorite_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**请求字段说明**

| 字段          | 类型   | 必填 | 描述                                    |
| ------------- | ------ | ---- | --------------------------------------- |
| favorite_type | string | 是   | 收藏类型：`api`（API）或 `node`（节点） |
| favorite_id   | string | 是   | 要收藏的 API 或节点 ID                  |

**响应示例**

```json
{
  "success": true,
  "code": "CREATED",
  "message": "API added to favorites successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "favorite_type": "api",
    "favorite_id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-01T10:00:00Z"
  }
}
```

**响应字段说明**

| 字段          | 类型   | 描述                         |
| ------------- | ------ | ---------------------------- |
| id            | string | 收藏记录唯一标识符           |
| user_id       | string | 用户 ID                      |
| favorite_type | string | 收藏类型                     |
| favorite_id   | string | 收藏的 API 或节点 ID         |
| created_at    | string | 创建时间（ISO 8601格式）     |
| updated_at    | string | 最后更新时间（ISO 8601格式） |

#### 7.2 获取收藏列表

```http
GET /api/v1/favorites
```

**需要认证**: 是

获取当前用户的收藏列表，支持分页和类型筛选。

**查询参数**

| 参数          | 类型    | 必填 | 默认值 | 描述                      |
| ------------- | ------- | ---- | ------ | ------------------------- |
| page          | integer | 否   | 1      | 页码                      |
| page_size     | integer | 否   | 20     | 每页数量（1-100）         |
| favorite_type | string  | 否   | -      | 筛选类型：`api` 或 `node` |

**响应示例**

```json
{
  "success": true,
  "code": "PAGINATED",
  "message": "User favorites retrieved successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "favorite_type": "api",
      "favorite_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2023-12-01T10:00:00Z",
      "updated_at": "2023-12-01T10:00:00Z",
      "favorite_name": "天气预报 API",
      "favorite_slug": "weather-forecast-api",
      "favorite_description": "提供全球天气预报数据",
      "favorite_avatar_url": "https://api.example.com/avatars/weather.png",
      "favorite_category": "data"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 15,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

**响应字段说明**

| 字段                 | 类型   | 描述                         |
| -------------------- | ------ | ---------------------------- |
| id                   | string | 收藏记录唯一标识符           |
| user_id              | string | 用户 ID                      |
| favorite_type        | string | 收藏类型                     |
| favorite_id          | string | 收藏的 API 或节点 ID         |
| created_at           | string | 创建时间（ISO 8601格式）     |
| updated_at           | string | 最后更新时间（ISO 8601格式） |
| favorite_name        | string | 收藏项目名称                 |
| favorite_slug        | string | 收藏项目标识符               |
| favorite_description | string | 收藏项目描述                 |
| favorite_avatar_url  | string | 收藏项目头像 URL             |
| favorite_category    | string | 收藏项目类别                 |

#### 7.3 获取 API 收藏

```http
GET /api/v1/favorites/apis
```

**需要认证**: 是

获取当前用户收藏的 API 列表，支持分页。

**查询参数**

| 参数      | 类型    | 必填 | 默认值 | 描述              |
| --------- | ------- | ---- | ------ | ----------------- |
| page      | integer | 否   | 1      | 页码              |
| page_size | integer | 否   | 20     | 每页数量（1-100） |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "API favorites retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "favorite_type": "api",
      "favorite_id": "api-550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2023-12-01T10:00:00Z",
      "updated_at": "2023-12-01T10:00:00Z",
      "favorite_name": "天气预报 API",
      "favorite_slug": "weather-forecast-api",
      "favorite_description": "提供全球天气预报数据",
      "favorite_avatar_url": "https://api.example.com/avatars/weather.png",
      "favorite_category": "data"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 8,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

**响应字段说明**

| 字段                 | 类型   | 描述                         |
| -------------------- | ------ | ---------------------------- |
| id                   | string | 收藏记录唯一标识符           |
| user_id              | string | 用户 ID                      |
| favorite_type        | string | 收藏类型，固定为 "api"       |
| favorite_id          | string | 收藏的 API ID                |
| created_at           | string | 创建时间（ISO 8601格式）     |
| updated_at           | string | 最后更新时间（ISO 8601格式） |
| favorite_name        | string | 收藏的 API 名称              |
| favorite_slug        | string | 收藏的 API 标识符            |
| favorite_description | string | 收藏的 API 描述              |
| favorite_avatar_url  | string | 收藏的 API 头像 URL          |
| favorite_category    | string | 收藏的 API 类别              |

#### 7.4 获取节点收藏

```http
GET /api/v1/favorites/nodes
```

**需要认证**: 是

获取当前用户收藏的节点列表，支持分页。

**查询参数**

| 参数      | 类型    | 必填 | 默认值 | 描述              |
| --------- | ------- | ---- | ------ | ----------------- |
| page      | integer | 否   | 1      | 页码              |
| page_size | integer | 否   | 20     | 每页数量（1-100） |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Node favorites retrieved successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "favorite_type": "node",
      "favorite_id": "node-550e8400-e29b-41d4-a716-446655440001",
      "created_at": "2023-12-01T11:00:00Z",
      "updated_at": "2023-12-01T11:00:00Z",
      "favorite_name": "数据处理节点",
      "favorite_slug": "data-processing-node",
      "favorite_description": "用于数据清洗和转换的自动化节点",
      "favorite_avatar_url": "https://nodes.example.com/avatars/data-node.png",
      "favorite_category": "data"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 5,
    "total_pages": 1,
    "has_next": false,
    "has_prev": false
  }
}
```

**响应字段说明**

| 字段                 | 类型   | 描述                         |
| -------------------- | ------ | ---------------------------- |
| id                   | string | 收藏记录唯一标识符           |
| user_id              | string | 用户 ID                      |
| favorite_type        | string | 收藏类型，固定为 "node"      |
| favorite_id          | string | 收藏的节点 ID                |
| created_at           | string | 创建时间（ISO 8601格式）     |
| updated_at           | string | 最后更新时间（ISO 8601格式） |
| favorite_name        | string | 收藏的节点名称               |
| favorite_slug        | string | 收藏的节点标识符             |
| favorite_description | string | 收藏的节点描述               |
| favorite_avatar_url  | string | 收藏的节点头像 URL           |
| favorite_category    | string | 收藏的节点类别               |

#### 7.5 取消收藏（通过收藏 ID）

```http
DELETE /api/v1/favorites/{favorite_id}
```

**需要认证**: 是

通过收藏记录 ID 取消收藏。

**路径参数**

| 参数        | 类型   | 必填 | 描述        |
| ----------- | ------ | ---- | ----------- |
| favorite_id | string | 是   | 收藏记录 ID |

**响应示例**

```json
{
  "success": true,
  "code": "DELETED",
  "message": "Favorite removed successfully"
}
```

#### 7.6 获取收藏统计

```http
GET /api/v1/favorites/stats
```

**需要认证**: 是

获取当前用户的收藏统计信息。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Favorite statistics retrieved successfully",
  "data": {
    "total_favorites": 25,
    "api_favorites": 15,
    "node_favorites": 10
  }
}
```

**响应字段说明**

| 字段            | 类型    | 描述            |
| --------------- | ------- | --------------- |
| total_favorites | integer | 总收藏数        |
| api_favorites   | integer | 收藏的 API 数量 |
| node_favorites  | integer | 收藏的节点数量  |

#### 7.7 批量检查收藏状态

```http
GET /api/v1/favorites/check
```

**需要认证**: 是

批量检查指定 API 或节点是否已被当前用户收藏。

**查询参数**

| 参数     | 类型   | 必填 | 描述                   |
| -------- | ------ | ---- | ---------------------- |
| api_ids  | string | 否   | 逗号分隔的 API ID 列表 |
| node_ids | string | 否   | 逗号分隔的节点 ID 列表 |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Favorite status checked successfully",
  "data": {
    "api_550e8400-e29b-41d4-a716-446655440000": true,
    "api_550e8400-e29b-41d4-a716-446655440001": false,
    "node_123e4567-e89b-12d3-a456-426614174000": true
  }
}
```

**响应字段说明**

响应数据是一个对象，键名格式为 `{type}_{id}`，值为布尔值表示是否已收藏。

### 8. 节点市场

#### 8.1 获取我的节点购买记录

```http
GET /api/v1/nodes/my-purchases
```

**需要认证**: 是

获取当前用户已购买的节点列表。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取购买记录成功",
  "data": [
    {
      "id": "purchase-uuid",
      "node_id": "node-uuid",
      "user_id": "user-uuid",
      "transaction_id": "trans-uuid",
      "purchase_price": 9.99,
      "node_version": "1.0.0",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**响应字段说明**

| 字段           | 类型   | 描述                       |
| -------------- | ------ | -------------------------- |
| id             | string | 购买记录唯一标识符（UUID） |
| node_id        | string | 节点唯一标识符（UUID）     |
| user_id        | string | 用户唯一标识符（UUID）     |
| transaction_id | string | 关联的交易记录 ID          |
| purchase_price | number | 购买时的价格（美元）       |
| node_version   | string | 购买时的节点版本号         |
| created_at     | string | 购买时间（ISO 8601格式）   |

#### 8.2 获取节点列表

```http
GET /api/v1/nodes/
```

获取公开的节点列表，支持分页和过滤。

**查询参数**
| 参数 | 类型 | 描述 |
|-----|------|------|
| page | integer | 页码 |
| page_size | integer | 每页数量 |
| category | string | 节点类别 |
| node_type | string | 节点类型：n8n, coze |
| status | string | 状态：active, inactive |
| is_public | boolean | 是否公开 |
| search | string | 搜索关键词 |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取节点列表成功",
  "data": [
    {
      "id": "node-uuid",
      "name": "天气通知自动化",
      "slug": "weather-notification",
      "node_type": "n8n",
      "short_description": "每天早上自动发送天气通知",
      "long_description": "这是一个自动化节点，可以在每天早上8点定时获取天气信息并发送通知到指定的渠道。支持多种通知方式，包括邮件、短信等。",
      "avatar_url": "https://s3.amazonaws.com/vola/nodes/node123.jpg",
      "category": "tools",
      "tags": ["automation", "weather", "notification"],
      "node_json": { "version": "1.0", "nodes": [] },
      "documentation": "# 使用说明\n配置天气API密钥和通知渠道即可使用。",
      "status": "published",
      "is_public": true,
      "website_url": null,
      "price": 9.99,
      "total_sales": 150,
      "total_revenue": 1498.5,
      "rating": 4.8,
      "owner_id": "user-uuid",
      "owner": {
        "username": "automation_master",
        "full_name": "Automation Master",
        "avatar_url": "https://s3.amazonaws.com/vola/avatars/automation_master.jpg"
      },
      "is_favorited": false,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 50,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

**响应字段说明**

| 字段              | 类型          | 描述                                                                                         |
| ----------------- | ------------- | -------------------------------------------------------------------------------------------- |
| id                | string        | 节点唯一标识符（UUID）                                                                       |
| name              | string        | 节点名称                                                                                     |
| slug              | string        | 节点唯一标识符                                                                               |
| node_type         | string        | 节点类型：n8n, coze, other                                                                   |
| short_description | string        | 节点简短描述                                                                                 |
| long_description  | string        | 节点详细描述                                                                                 |
| avatar_url        | string        | 节点头像/图标 URL                                                                            |
| category          | string        | 节点类别：data, ai_ml, finance, social, tools, communication, entertainment, business, other |
| tags              | array[string] | 节点标签列表                                                                                 |
| node_json         | object        | 节点配置数据，包含工作流定义                                                                 |
| documentation     | string        | 节点文档，Markdown 格式                                                                      |
| status            | string        | 节点状态：draft（草稿）, published（已发布）, deprecated（已弃用）, suspended（已暂停）      |
| is_public         | boolean       | 是否公开显示                                                                                 |
| website_url       | string        | 节点相关网站 URL                                                                             |
| price             | number        | 节点价格（美元）                                                                             |
| total_sales       | integer       | 总销售数量                                                                                   |
| total_revenue     | number        | 总收入（美元）                                                                               |
| rating            | number        | 平均评分（1-5分）                                                                            |
| owner_id          | string        | 节点所有者用户 ID                                                                            |
| owner             | object        | 节点所有者信息，包含 username、full_name、avatar_url                                         |
| is_favorited      | boolean       | 是否已被当前用户收藏（仅已认证用户有此字段）                                                 |
| created_at        | string        | 创建时间（ISO 8601格式）                                                                     |
| updated_at        | string        | 最后更新时间（ISO 8601格式）                                                                 |

#### 8.3 创建节点

```http
POST /api/v1/nodes/
```

**需要认证**: 是

**请求体**

```json
{
  "name": "天气通知自动化",
  "slug": "weather-notification",
  "description": "每天早上自动发送天气通知",
  "category": "communication",
  "node_type": "n8n",
  "node_data": {
    "workflows": [
      {
        "name": "Weather Notification",
        "nodes": [
          {
            "id": "weather-api",
            "type": "http-request",
            "parameters": {
              "url": "https://api.weather.com/v1/current",
              "method": "GET"
            }
          }
        ]
      }
    ]
  },
  "documentation": "# 天气通知自动化\n\n这个节点可以自动获取天气信息并发送通知。\n\n## 使用方法\n1. 配置API密钥\n2. 设置通知时间\n3. 启动工作流",
  "price": 9.99,
  "is_public": true
}
```

**请求参数说明**

| 参数          | 类型    | 必填 | 描述                                                                                         |
| ------------- | ------- | ---- | -------------------------------------------------------------------------------------------- |
| name          | string  | 是   | 节点名称，最大 255 字符                                                                      |
| slug          | string  | 是   | 节点唯一标识符，只允许小写字母、数字和连字符                                                 |
| description   | string  | 是   | 节点描述，最大 500 字符                                                                      |
| category      | string  | 是   | 节点类别：data, ai_ml, finance, social, tools, communication, entertainment, business, other |
| node_type     | string  | 是   | 节点类型：n8n, zapier, other                                                                 |
| node_data     | object  | 是   | 节点数据，包含工作流配置信息的 JSON 对象                                                     |
| documentation | string  | 否   | 节点文档，支持 Markdown 格式                                                                 |
| price         | number  | 是   | 节点价格，最小值 0.01                                                                        |
| is_public     | boolean | 否   | 是否公开，默认 false                                                                         |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "节点创建成功",
  "data": {
    "id": "node-uuid",
    "name": "天气通知自动化",
    "slug": "weather-notification",
    "description": "每天早上自动发送天气通知",
    "category": "communication",
    "node_type": "n8n",
    "price": 9.99,
    "status": "active",
    "is_public": true,
    "owner_id": "user-uuid",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

**响应字段说明**

| 字段        | 类型    | 描述                                                                                         |
| ----------- | ------- | -------------------------------------------------------------------------------------------- |
| id          | string  | 节点唯一标识符（UUID）                                                                       |
| name        | string  | 节点名称                                                                                     |
| slug        | string  | 节点唯一标识符                                                                               |
| description | string  | 节点描述                                                                                     |
| category    | string  | 节点类别：data, ai_ml, finance, social, tools, communication, entertainment, business, other |
| node_type   | string  | 节点类型：n8n, coze, other                                                                   |
| price       | number  | 节点价格（美元）                                                                             |
| status      | string  | 节点状态：draft（草稿）, published（已发布）, deprecated（已弃用）, suspended（已暂停）      |
| is_public   | boolean | 是否公开显示                                                                                 |
| owner_id    | string  | 节点所有者用户 ID                                                                            |
| created_at  | string  | 创建时间（ISO 8601格式）                                                                     |
| updated_at  | string  | 最后更新时间（ISO 8601格式）                                                                 |

#### 8.4 获取节点详情

```http
GET /api/v1/nodes/{node_id}
```

获取指定节点的详细信息。

**路径参数**

- `node_id`: 节点的 UUID

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取节点详情成功",
  "data": {
    "id": "node-uuid",
    "name": "天气通知自动化",
    "slug": "weather-notification",
    "description": "每天早上自动发送天气通知",
    "category": "notification",
    "node_type": "n8n",
    "node_data": {
      "workflows": [
        {
          "name": "Weather Notification",
          "nodes": [
            {
              "id": "weather-api",
              "type": "http-request",
              "parameters": {
                "url": "https://api.weather.com/v1/current",
                "method": "GET"
              }
            }
          ]
        }
      ]
    },
    "documentation": "# 天气通知自动化\n\n这个节点可以自动获取天气信息并发送通知。",
    "price": 9.99,
    "avatar_url": "https://s3.amazonaws.com/vola/nodes/node123.jpg",
    "status": "published",
    "is_public": true,
    "total_sales": 150,
    "total_revenue": 1498.5,
    "rating": 4.8,
    "owner_id": "user-uuid",
    "owner": {
      "username": "automation_master",
      "full_name": "Automation Master",
      "avatar_url": "https://s3.amazonaws.com/vola/avatars/automation_master.jpg"
    },
    "is_favorited": false,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

**响应字段说明**

| 字段          | 类型    | 描述                                                                                         |
| ------------- | ------- | -------------------------------------------------------------------------------------------- |
| id            | string  | 节点唯一标识符（UUID）                                                                       |
| name          | string  | 节点名称                                                                                     |
| slug          | string  | 节点唯一标识符                                                                               |
| description   | string  | 节点描述                                                                                     |
| category      | string  | 节点类别：data, ai_ml, finance, social, tools, communication, entertainment, business, other |
| node_type     | string  | 节点类型：n8n, coze, other                                                                   |
| node_data     | object  | 节点完整配置数据，包含工作流定义                                                             |
| documentation | string  | 节点文档，Markdown 格式                                                                      |
| price         | number  | 节点价格（美元）                                                                             |
| avatar_url    | string  | 节点头像/图标 URL                                                                            |
| status        | string  | 节点状态：draft（草稿）, published（已发布）, deprecated（已弃用）, suspended（已暂停）      |
| is_public     | boolean | 是否公开显示                                                                                 |
| total_sales   | integer | 总销售数量                                                                                   |
| total_revenue | number  | 总收入（美元）                                                                               |
| rating        | number  | 平均评分（1-5分，null 表示暂无评分）                                                         |
| owner_id      | string  | 节点所有者用户 ID                                                                            |
| owner         | object  | 节点所有者信息，包含 username、full_name、avatar_url                                         |
| created_at    | string  | 创建时间（ISO 8601格式）                                                                     |
| updated_at    | string  | 最后更新时间（ISO 8601格式）                                                                 |

#### 8.5 更新节点

```http
PATCH /api/v1/nodes/{node_id}
```

**需要认证**: 是（必须是节点所有者）

更新节点信息。

**路径参数**

- `node_id`: 节点的 UUID

**请求体**（只需包含要更新的字段）

```json
{
  "name": "更新的天气通知自动化",
  "description": "每天早上和晚上自动发送天气通知",
  "price": 12.99,
  "documentation": "# 更新的天气通知自动化\n\n支持多时段通知",
  "is_public": false
}
```

**请求参数说明**

| 参数          | 类型    | 必填 | 描述                         |
| ------------- | ------- | ---- | ---------------------------- |
| name          | string  | 否   | 节点名称，最大 255 字符      |
| description   | string  | 否   | 节点描述，最大 500 字符      |
| price         | number  | 否   | 节点价格，最小值 0.01        |
| documentation | string  | 否   | 节点文档，支持 Markdown 格式 |
| is_public     | boolean | 否   | 是否公开显示                 |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "节点更新成功",
  "data": {
    "id": "node-uuid",
    "name": "更新的天气通知自动化",
    "slug": "weather-notification",
    "description": "每天早上和晚上自动发送天气通知",
    "category": "notification",
    "node_type": "n8n",
    "price": 12.99,
    "avatar_url": "https://s3.amazonaws.com/vola/nodes/node123.jpg",
    "status": "published",
    "is_public": false,
    "total_sales": 150,
    "total_revenue": 1498.5,
    "rating": 4.8,
    "owner_id": "user-uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

**响应字段说明**

| 字段          | 类型    | 描述                                                                                         |
| ------------- | ------- | -------------------------------------------------------------------------------------------- |
| id            | string  | 节点唯一标识符（UUID）                                                                       |
| name          | string  | 节点名称                                                                                     |
| slug          | string  | 节点唯一标识符                                                                               |
| description   | string  | 节点描述                                                                                     |
| category      | string  | 节点类别：data, ai_ml, finance, social, tools, communication, entertainment, business, other |
| node_type     | string  | 节点类型：n8n, zapier, other                                                                 |
| price         | number  | 节点价格（美元）                                                                             |
| avatar_url    | string  | 节点头像/图标 URL                                                                            |
| status        | string  | 节点状态：draft（草稿）, published（已发布）, deprecated（已弃用）                           |
| is_public     | boolean | 是否公开显示                                                                                 |
| total_sales   | integer | 总销售数量                                                                                   |
| total_revenue | number  | 总收入（美元）                                                                               |
| rating        | number  | 平均评分（1-5分，null 表示暂无评分）                                                         |
| owner_id      | string  | 节点所有者用户 ID                                                                            |
| owner         | object  | 节点所有者信息，包含 username、full_name、avatar_url                                         |
| created_at    | string  | 创建时间（ISO 8601格式）                                                                     |
| updated_at    | string  | 最后更新时间（ISO 8601格式）                                                                 |

#### 8.6 上传节点头像

```http
POST /api/v1/nodes/{node_id}/avatar
```

**需要认证**: 是（必须是节点所有者）

**路径参数**

- `node_id`: 节点的 UUID

**请求格式**: multipart/form-data

**请求体**

- `file`: 图片文件（支持 jpg, png, gif，最大 5MB）

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "节点头像上传成功",
  "data": {
    "id": "node-uuid",
    "name": "天气通知自动化",
    "slug": "weather-notification",
    "avatar_url": "https://s3.amazonaws.com/vola/nodes/node123_new.jpg",
    "updated_at": "2024-01-15T11:15:00Z"
  }
}
```

**响应字段说明**

| 字段       | 类型   | 描述                         |
| ---------- | ------ | ---------------------------- |
| id         | string | 节点唯一标识符（UUID）       |
| name       | string | 节点名称                     |
| slug       | string | 节点唯一标识符               |
| avatar_url | string | 更新后的节点头像 URL         |
| updated_at | string | 最后更新时间（ISO 8601格式） |

#### 8.7 删除节点

```http
DELETE /api/v1/nodes/{node_id}
```

**需要认证**: 是（必须是节点所有者）

软删除节点。

**路径参数**

- `node_id`: 节点的 UUID

**响应示例**

```json
{
  "success": true,
  "code": "NODE_DELETED",
  "message": "节点删除成功",
  "data": null
}
```

#### 8.8 购买节点

```http
POST /api/v1/nodes/{node_id}/purchase
```

**需要认证**: 是

购买指定的节点。

**路径参数**

- `node_id`: 节点的 UUID

**说明**:

- 自动检查用户余额
- 扣除相应费用
- 记录购买记录

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "节点购买成功",
  "data": {
    "purchase_id": "purchase-uuid",
    "node_id": "node-uuid",
    "node_name": "天气通知自动化",
    "price": 9.99,
    "remaining_balance": 40.01,
    "purchased_at": "2024-01-15T10:00:00Z"
  }
}
```

**响应字段说明**

| 字段              | 类型   | 描述                       |
| ----------------- | ------ | -------------------------- |
| purchase_id       | string | 购买记录唯一标识符（UUID） |
| node_id           | string | 节点唯一标识符（UUID）     |
| node_name         | string | 节点名称                   |
| price             | number | 购买价格（美元）           |
| remaining_balance | number | 购买后剩余余额（美元）     |
| purchased_at      | string | 购买时间（ISO 8601格式）   |

#### 8.9 下载已购买的节点

```http
GET /api/v1/nodes/{node_id}/download
```

**需要认证**: 是（必须已购买）

下载已购买节点的完整配置和文档。

**路径参数**

- `node_id`: 节点的 UUID

**响应**: JSON 文件下载

**响应头示例**

```
Content-Type: application/json
Content-Disposition: attachment; filename="weather-notification-node.json"
```

**响应内容示例**

```json
{
  "node_json": {
    "workflows": [
      {
        "name": "Weather Notification",
        "nodes": [
          {
            "id": "weather-api",
            "type": "http-request",
            "parameters": {
              "url": "https://api.weather.com/v1/current",
              "method": "GET",
              "headers": {
                "Authorization": "Bearer {{$secrets.weather_api_key}}"
              }
            },
            "position": [250, 300]
          },
          {
            "id": "notification",
            "type": "slack",
            "parameters": {
              "webhook_url": "{{$secrets.slack_webhook}}",
              "message": "今日天气：{{$json.weather.description}}，温度：{{$json.weather.temperature}}°C"
            },
            "position": [450, 300]
          }
        ],
        "connections": {
          "weather-api": {
            "main": [
              [
                {
                  "node": "notification",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          }
        }
      }
    ]
  },
  "documentation": "# 天气通知自动化\n\n## 概述\n\n这个节点可以自动获取天气信息并发送到 Slack 频道。\n\n## 安装步骤\n\n1. 导入节点配置到 n8n\n2. 配置天气 API 密钥\n3. 设置 Slack Webhook URL\n4. 启动工作流\n\n## 配置说明\n\n### 必需的密钥\n- `weather_api_key`: 天气服务的 API 密钥\n- `slack_webhook`: Slack 频道的 Webhook URL\n\n### 可选配置\n- 通知频率：默认每天早上 8:00\n- 城市设置：默认为北京\n\n## 故障排除\n\n如果遇到问题，请检查：\n1. API 密钥是否有效\n2. Slack Webhook 是否正确\n3. 网络连接是否正常",
  "purchased_at": "2024-01-15T10:00:00Z"
}
```

**响应字段说明**

| 字段                              | 类型          | 描述                             |
| --------------------------------- | ------------- | -------------------------------- |
| node_json                         | object        | 节点完整配置信息，包含工作流定义 |
| node_json.workflows               | array[object] | 工作流数组                       |
| node_json.workflows[].name        | string        | 工作流名称                       |
| node_json.workflows[].nodes       | array[object] | 节点数组，包含工作流中的所有节点 |
| node_json.workflows[].connections | object        | 节点间连接关系定义               |
| documentation                     | string        | 节点完整文档，包含安装和使用说明 |
| purchased_at                      | string        | 购买时间（ISO 8601格式）         |

#### 8.10 管理节点版本

##### 8.10.1 获取节点版本历史

```http
GET /api/v1/nodes/{node_id}/versions
```

获取节点的版本历史记录。

**路径参数**

- `node_id`: 节点的 UUID

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取版本历史成功",
  "data": [
    {
      "id": "version-uuid",
      "node_id": "node-uuid",
      "version": "1.2.0",
      "changelog": "添加了多时段通知功能",
      "node_data": {
        "workflows": [
          {
            "name": "Weather Notification v1.2",
            "nodes": []
          }
        ]
      },
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**响应字段说明**

| 字段       | 类型   | 描述                         |
| ---------- | ------ | ---------------------------- |
| id         | string | 版本唯一标识符（UUID）       |
| node_id    | string | 节点唯一标识符（UUID）       |
| version    | string | 版本号（如 1.2.0）           |
| changelog  | string | 版本更新说明                 |
| node_data  | object | 节点配置数据，包含工作流定义 |
| created_at | string | 版本创建时间（ISO 8601格式） |

##### 8.10.2 创建节点版本

```http
POST /api/v1/nodes/{node_id}/versions
```

**需要认证**: 是（必须是节点所有者）

创建新的节点版本。

**路径参数**

- `node_id`: 节点的 UUID

**请求体**

```json
{
  "version": "1.2.0",
  "changelog": "添加了多时段通知功能",
  "node_data": {
    "workflows": [
      {
        "name": "Weather Notification v1.2",
        "nodes": [
          {
            "id": "weather-api",
            "type": "http-request",
            "parameters": {
              "url": "https://api.weather.com/v1/current",
              "method": "GET"
            }
          }
        ]
      }
    ]
  }
}
```

**请求参数说明**

| 参数      | 类型   | 必填 | 描述                                   |
| --------- | ------ | ---- | -------------------------------------- |
| version   | string | 是   | 版本号，遵循语义化版本规范（如 1.2.0） |
| changelog | string | 是   | 版本更新说明，描述此版本的改动内容     |
| node_data | object | 是   | 节点数据，包含完整的工作流配置信息     |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "节点版本创建成功",
  "data": {
    "id": "version-uuid",
    "node_id": "node-uuid",
    "version": "1.2.0",
    "changelog": "添加了多时段通知功能",
    "node_data": {
      "workflows": [
        {
          "name": "Weather Notification v1.2",
          "nodes": [
            {
              "id": "weather-api",
              "type": "http-request",
              "parameters": {
                "url": "https://api.weather.com/v1/current",
                "method": "GET"
              }
            }
          ]
        }
      ]
    },
    "is_current": true,
    "created_at": "2024-01-15T11:30:00Z"
  }
}
```

**响应字段说明**

| 字段       | 类型    | 描述                               |
| ---------- | ------- | ---------------------------------- |
| id         | string  | 版本唯一标识符（UUID）             |
| node_id    | string  | 节点唯一标识符（UUID）             |
| version    | string  | 版本号（如 1.2.0）                 |
| changelog  | string  | 版本更新说明                       |
| node_data  | object  | 节点配置数据，包含完整的工作流定义 |
| is_current | boolean | 是否为当前活跃版本                 |
| created_at | string  | 版本创建时间（ISO 8601格式）       |

### 9. 支付

#### 9.1 创建 Stripe 支付意向

```http
POST /api/v1/payments/stripe/create-intent
```

**需要认证**: 是

创建 Stripe 支付意向用于直接付款。

**请求体**

```json
{
  "amount": 100.0,
  "provider": "stripe",
  "description": "账户充值"
}
```

**请求参数说明**

| 参数        | 类型   | 必填 | 描述                              |
| ----------- | ------ | ---- | --------------------------------- |
| amount      | number | 是   | 支付金额，单位为美元，最小值 0.50 |
| provider    | string | 是   | 支付提供商，目前支持 "stripe"     |
| description | string | 否   | 支付描述信息，最大 255 字符       |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "支付意向创建成功",
  "data": {
    "payment_id": "payment-uuid",
    "client_secret": "pi_1234567890_secret_abcdef",
    "amount": 199.0,
    "currency": "USD",
    "provider": "stripe"
  }
}
```

**响应字段说明**

| 字段          | 类型   | 描述                                    |
| ------------- | ------ | --------------------------------------- |
| payment_id    | string | 支付唯一标识符（UUID）                  |
| client_secret | string | Stripe 客户端密钥，用于前端完成支付流程 |
| amount        | number | 支付金额（美元）                        |
| currency      | string | 货币代码，通常为 USD                    |
| provider      | string | 支付提供商标识（stripe）                |

#### 9.2 创建 Stripe Checkout 会话

```http
POST /api/v1/payments/stripe/create-checkout
```

**需要认证**: 是

创建 Stripe Checkout 会话用于托管支付页面。

**请求体**

```json
{
  "plan_type": "pro",
  "months": 1,
  "success_url": "https://myapp.com/success",
  "cancel_url": "https://myapp.com/cancel"
}
```

**请求参数说明**

| 参数        | 类型    | 必填 | 描述                                 |
| ----------- | ------- | ---- | ------------------------------------ |
| plan_type   | string  | 是   | 订阅计划类型：basic, pro, enterprise |
| months      | integer | 是   | 订阅月数，1-12 之间                  |
| success_url | string  | 是   | 支付成功后的回调 URL                 |
| cancel_url  | string  | 是   | 支付取消后的回调 URL                 |

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Checkout会话创建成功",
  "data": {
    "checkout_url": "https://checkout.stripe.com/...",
    "session_id": "cs_test_..."
  }
}
```

**响应字段说明**

| 字段         | 类型   | 描述                                                      |
| ------------ | ------ | --------------------------------------------------------- |
| checkout_url | string | Stripe Checkout 会话 URL，用户需要重定向到此 URL 完成支付 |
| session_id   | string | Stripe Checkout 会话唯一标识符                            |

#### 9.3 获取支付计划

```http
GET /api/v1/payments/plans
```

获取所有可用的支付计划。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取支付计划成功",
  "data": {
    "plans": [
      {
        "type": "basic",
        "name": "Basic",
        "monthly_price": 0.0,
        "monthly_credits": 0.0,
        "has_stripe_price_id": false,
        "supports_subscription": false
      },
      {
        "type": "pro",
        "name": "Pro",
        "monthly_price": 9.9,
        "monthly_credits": 9.9,
        "has_stripe_price_id": true,
        "supports_subscription": true
      },
      {
        "type": "enterprise",
        "name": "Enterprise",
        "monthly_price": 199.9,
        "monthly_credits": 199.9,
        "has_stripe_price_id": true,
        "supports_subscription": true
      }
    ]
  }
}
```

**响应字段说明**

| 字段                  | 类型    | 描述                                                               |
| --------------------- | ------- | ------------------------------------------------------------------ |
| type                  | string  | 计划类型标识：basic（基础版）, pro（专业版）, enterprise（企业版） |
| name                  | string  | 计划显示名称                                                       |
| monthly_price         | number  | 月费价格（美元）                                                   |
| monthly_credits       | number  | 每月信用额度（美元）                                               |
| has_stripe_price_id   | boolean | 是否有 Stripe 价格 ID 配置                                         |
| supports_subscription | boolean | 是否支持订阅模式                                                   |

#### 9.4 获取支付信息

```http
GET /api/v1/payments/info
```

**需要认证**: 是

获取用户的支付信息和支付方法。

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取支付信息成功",
  "data": {
    "subscription_balance": 250.0,
    "one_time_balance": 100.5,
    "total_balance": 350.5,
    "active_subscription": {
      "id": "sub-uuid",
      "plan": "pro",
      "status": "active",
      "current_period_end": "2024-02-15T00:00:00Z"
    },
    "recent_transactions": [
      {
        "id": "txn-uuid",
        "type": "deposit",
        "amount": 100.0,
        "created_at": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

**响应字段说明**

| 字段                                   | 类型          | 描述                                                           |
| -------------------------------------- | ------------- | -------------------------------------------------------------- |
| subscription_balance                   | number        | 订阅余额（美元），来自订阅计划的余额                           |
| one_time_balance                       | number        | 一次性充值余额（美元），来自直接充值                           |
| total_balance                          | number        | 总可用余额（美元），订阅余额 + 一次性余额                      |
| active_subscription                    | object        | 当前活跃订阅信息对象                                           |
| active_subscription.id                 | string        | 订阅唯一标识符（UUID）                                         |
| active_subscription.plan               | string        | 订阅计划类型：basic, pro, enterprise                           |
| active_subscription.status             | string        | 订阅状态：active, inactive, cancelled                          |
| active_subscription.current_period_end | string        | 当前订阅周期结束时间（ISO 8601格式）                           |
| recent_transactions                    | array[object] | 最近的交易记录列表                                             |
| recent_transactions[].id               | string        | 交易唯一标识符（UUID）                                         |
| recent_transactions[].type             | string        | 交易类型：deposit（充值）, withdraw（提现）, usage（使用扣费） |
| recent_transactions[].amount           | number        | 交易金额（美元）                                               |
| recent_transactions[].created_at       | string        | 交易创建时间（ISO 8601格式）                                   |

#### 9.5 获取支付详情

```http
GET /api/v1/payments/{payment_id}
```

**需要认证**: 是

获取指定支付的详细信息。

**路径参数**

- `payment_id`: 支付的 UUID

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取支付详情成功",
  "data": {
    "id": "payment-uuid",
    "provider": "stripe",
    "status": "completed",
    "amount": 29.99,
    "currency": "USD",
    "description": "Professional Plan - Monthly Subscription",
    "provider_payment_id": "pi_1234567890",
    "metadata": {
      "plan": "professional",
      "billing_cycle": "monthly",
      "user_id": "user-uuid"
    },
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

**响应字段说明**

| 字段                | 类型   | 描述                                                                                  |
| ------------------- | ------ | ------------------------------------------------------------------------------------- |
| id                  | string | 支付唯一标识符（UUID）                                                                |
| provider            | string | 支付提供商：stripe（Stripe）, hel（Hel）, admin（管理员）                             |
| status              | string | 支付状态：pending（待处理）, completed（已完成）, failed（失败）, cancelled（已取消） |
| amount              | number | 支付金额（美元）                                                                      |
| currency            | string | 货币代码，通常为 USD                                                                  |
| description         | string | 支付描述信息                                                                          |
| provider_payment_id | string | 支付提供商的支付 ID（如 Stripe 的 PaymentIntent ID）                                  |
| metadata            | object | 支付元数据，包含额外的支付相关信息                                                    |
| created_at          | string | 支付创建时间（ISO 8601格式）                                                          |

#### 9.6 Hel 支付交易查询

```http
GET /api/v1/payments/hel/transaction/{signature}
```

查询 Hel 支付交易状态。

**路径参数**

- `signature`: Hel 交易签名

**响应示例**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "获取交易状态成功",
  "data": {
    "id": "hel-transaction-id",
    "paylink_id": "paylink-uuid",
    "quantity": 1,
    "created_at": "2024-01-15T10:00:00.000Z",
    "payment_type": "PAYLINK",
    "meta": {
      "id": "hel-meta-id",
      "amount": "50000000000",
      "sender_pk": "HelUser123456789abcdef",
      "recipient_pk": "VolaWallet987654321fedcba",
      "transaction_signature": "5j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9",
      "transaction_status": "SUCCESS",
      "total_amount": "50000000000"
    }
  }
}
```

**响应字段说明**

| 字段                       | 类型    | 描述                              |
| -------------------------- | ------- | --------------------------------- |
| id                         | string  | Hel 交易唯一标识符                |
| paylink_id                 | string  | Hel Paylink ID                    |
| quantity                   | integer | 交易数量                          |
| created_at                 | string  | 交易创建时间（ISO 8601格式）      |
| payment_type               | string  | 支付类型：PAYLINK 或 PAYSTREAM    |
| meta                       | object  | 交易元数据对象                    |
| meta.id                    | string  | 元数据唯一标识符                  |
| meta.amount                | string  | 交易金额（最小单位，如 lamports） |
| meta.sender_pk             | string  | 发送方钱包公钥                    |
| meta.recipient_pk          | string  | 接收方钱包公钥                    |
| meta.transaction_signature | string  | 区块链交易签名                    |
| meta.transaction_status    | string  | 交易状态，通常为 SUCCESS          |
| meta.total_amount          | string  | 总交易金额（最小单位）            |

#### 9.7 Webhook 处理

##### Stripe Webhook

```http
POST /api/v1/payments/stripe/webhook
```

**认证**: Stripe 签名验证

##### Hel Webhook

```http
POST /api/v1/payments/hel/webhook
```

## 速率限制

API 实施了速率限制以确保服务稳定性：

- **认证用户**: 每分钟 60 次请求（默认）
- **API 网关调用**: 根据每个 API 的配置
- **未认证用户**: 每分钟 10 次请求

超过限制时返回 429 状态码和重试时间：

```json
{
  "success": false,
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "超过速率限制，请稍后重试",
  "data": {
    "retry_after": 30
  }
}
```

## 分页

支持分页的接口都使用统一的分页参数和响应格式：

**请求参数**

- `page`: 页码，从 1 开始
- `page_size`: 每页数量，默认 20，最大 100

**响应格式**

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Query successful",
  "data": [...],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 1000,
    "total_pages": 50,
    "has_next": true,
    "has_prev": false
  }
}
```

## Webhook 集成

### 配置 Webhook

在创建或更新 API/节点时，可以配置 webhook URL：

```json
{
  "webhook_url": "https://myapp.com/webhooks/vola",
  "webhook_events": ["api.call", "payment.completed"]
}
```

### Webhook 事件

| 事件类型          | 描述         | 负载示例                                         |
| ----------------- | ------------ | ------------------------------------------------ |
| api.call          | API 被调用时 | `{api_id, endpoint, method, user_id, timestamp}` |
| payment.completed | 支付完成     | `{payment_id, amount, user_id, timestamp}`       |
| balance.low       | 余额不足     | `{user_id, balance, threshold, timestamp}`       |

### 验证 Webhook

所有 webhook 请求都包含签名头用于验证：

```
X-Vola-Signature: sha256=abcdef123456...
```

验证方法：

```python
import hmac
import hashlib

def verify_webhook(payload, signature, secret):
    expected = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)
```

## SDK 和代码示例

### Python 示例

```python
import requests

class VolaClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "https://api.vola.fun/api/v1"

    def call_api(self, api_slug, endpoint, method="GET", data=None):
        url = f"{self.base_url}/gateway/{api_slug}/{endpoint}"
        headers = {"x-vola-key": self.api_key}

        response = requests.request(
            method=method,
            url=url,
            headers=headers,
            json=data
        )

        return response.json()

# 使用示例
client = VolaClient("vola_live_your_api_key")
weather = client.call_api("weather-api", "weather/current", data={"city": "Beijing"})
print(weather)
```

### JavaScript/Node.js 示例

```javascript
class VolaClient {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseUrl = 'https://api.vola.fun/api/v1'
  }

  async callApi(apiSlug, endpoint, options = {}) {
    const url = `${this.baseUrl}/gateway/${apiSlug}/${endpoint}`
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'x-vola-key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.data ? JSON.stringify(options.data) : undefined,
    })

    return response.json()
  }
}

// 使用示例
const client = new VolaClient('vola_live_your_api_key')
const weather = await client.callApi('weather-api', 'weather/current', {
  method: 'POST',
  data: { city: 'Beijing' },
})
```

## 最佳实践

1. **API 密钥安全**
   - 不要在客户端代码中硬编码 API 密钥
   - 使用环境变量存储密钥
   - 定期轮换密钥
   - 设置 IP 白名单和来源限制

2. **错误处理**
   - 始终检查响应的 `success` 字段
   - 实现重试机制处理临时错误
   - 记录错误日志便于调试

3. **性能优化**
   - 使用缓存减少重复请求
   - 批量处理请求when possible
   - 监控 API 使用量避免超限

4. **版本管理**
   - 关注 API 版本更新
   - 使用版本化的端点
   - 订阅更新通知
