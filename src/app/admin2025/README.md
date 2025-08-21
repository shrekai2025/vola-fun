# Admin Panel - 系统管理面板

## 概览

Admin Panel 是一个受保护的管理页面，仅供系统管理员使用。它提供了创建和管理 API 服务的功能。

## 访问权限

- **路由**: `/admin2025`
- **权限要求**: 用户必须登录且 `role` 字段为 `"ADMIN"`（不区分大小写）
- **访问限制**: 非管理员用户访问时会自动重定向到 404 页面

## 功能特性

### 1. API 创建功能

提供完整的 API 创建表单，支持以下字段：

#### 必填字段
- `name`: API 名称（最大 255 字符）
- `slug`: API 唯一标识符（只能包含小写字母、数字和连字符）
- `short_description`: 简短描述（最大 100 字符）
- `category`: API 分类
- `base_url`: API 基础 URL

#### 可选字段
- `long_description`: 详细描述
- `tags`: 标签数组（最多 3 个）
- `health_check_url`: 健康检查 URL
- `website_url`: 官方网站 URL
- `documentation_url`: API 文档 URL
- `terms_url`: 服务条款 URL
- `gateway_key`: 网关认证密钥
- `is_public`: 是否公开（默认 true）
- `documentation_markdown`: Markdown 格式的 API 文档

### 2. 导航栏集成

- 管理员用户登录后，导航栏会自动显示 "Admin" 链接
- 非管理员用户不会看到此链接

## 技术实现

### 权限检查机制

```tsx
useEffect(() => {
  if (!loading) {
    if (!isLoggedIn || !user) {
      router.replace('/404')
      return
    }
    
    const userRole = user.role?.toUpperCase() || ''
    if (userRole !== 'ADMIN') {
      router.replace('/404')
      return
    }
  }
}, [loading, isLoggedIn, user, router])
```

### API 接口

- **创建 API**: `POST /api/v1/apis/`
- **获取 API 列表**: `GET /api/v1/apis/`
- **获取 API 详情**: `GET /api/v1/apis/{id}`
- **更新 API**: `PUT /api/v1/apis/{id}`
- **删除 API**: `DELETE /api/v1/apis/{id}`
- **更新 API 状态**: `PATCH /api/v1/apis/{id}/status`

### 表单验证

使用 Zod 进行客户端表单验证：
- URL 格式验证
- 字符长度限制
- 必填字段检查
- 标识符格式验证（slug）

## 文件结构

```
src/app/admin2025/
├── page.tsx                    # 主页面组件
├── components/
│   └── CreateAPIForm.tsx       # API 创建表单组件
└── README.md                   # 文档说明

src/services/
└── admin-api.ts               # Admin API 服务函数
```

## 使用流程

1. **登录**: 使用管理员账户登录系统
2. **访问**: 点击导航栏的 "Admin" 链接或直接访问 `/admin2025`
3. **创建 API**: 点击 "Create New API" 按钮
4. **填写表单**: 输入所有必要的 API 信息
5. **提交**: 点击 "创建API" 按钮完成创建

## 安全特性

- **客户端权限检查**: 页面加载时验证用户角色
- **服务端权限验证**: API 调用时进行服务端权限验证
- **路由保护**: 非授权用户自动重定向到 404 页面
- **表单验证**: 客户端和服务端双重验证

## 扩展功能

当前版本主要实现了 API 创建功能，未来可扩展：

- 用户管理
- 系统指标监控  
- API 使用统计
- 权限管理
- 系统配置

## 错误处理

- 网络错误自动重试机制
- 详细的错误提示信息
- 表单验证错误高亮显示
- 优雅的加载状态处理
