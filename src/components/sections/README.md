# API Market Section - 真实数据集成

## 概览

APIMarketSection 组件是一个完整的API市场展示组件，集成了真实的API数据，支持分页、搜索、筛选等功能。

## 功能特性

### 🔍 **数据加载**

- **真实API数据**: 从 `/api/v1/apis/` 接口获取实际API列表
- **分页支持**: 每页显示50个API项目
- **加载状态**: 优雅的加载动画和错误处理
- **自动重试**: 网络错误时提供重试机制

### 📄 **分页功能**

- **滚动分页**: 点击"加载更多"获取下一页数据
- **智能合并**: 新数据追加到现有列表，无缝体验
- **完成提示**: 全部加载完成时显示统计信息

### 🔎 **搜索功能**

- **实时搜索**: 输入关键词即时筛选API
- **防抖优化**: 避免频繁API调用
- **全文搜索**: 支持API名称和描述搜索

### 🏷️ **分类筛选**

- **分类选择**: 支持按API分类筛选
- **视觉反馈**: 选中状态的视觉区分
- **组合筛选**: 搜索和分类可以同时使用

### 📊 **排序功能**

- **热门度排序**: 按调用次数排序（默认）
- **评分排序**: 按用户评分排序
- **最新排序**: 按创建时间排序
- **灵活切换**: 一键切换不同排序方式

## 技术实现

### 数据服务层

```typescript
// src/services/market-api.ts
- getMarketAPIs(): 获取API列表
- searchMarketAPIs(): 搜索API
- getMarketAPIsByCategory(): 按分类获取
- getPopularAPIs(): 获取热门API
```

### 组件状态管理

```typescript
const [apis, setApis] = useState<MarketAPI[]>([]) // API列表
const [loading, setLoading] = useState(true) // 加载状态
const [loadingMore, setLoadingMore] = useState(false) // 加载更多状态
const [hasMore, setHasMore] = useState(true) // 是否还有更多数据
const [currentPage, setCurrentPage] = useState(1) // 当前页码
const [searchTerm, setSearchTerm] = useState('') // 搜索词
const [selectedCategory, setSelectedCategory] = useState('all') // 选中分类
```

### API参数配置

```typescript
const requestParams: GetMarketAPIsParams = {
  page: 1, // 页码
  page_size: 50, // 每页50个项目
  status: 'published', // 只显示已发布的API
  is_public: true, // 只显示公开的API
  sort_by: 'total_calls', // 排序字段
  sort_order: 'desc', // 降序排列
}
```

## 组件结构

### 布局组件

- **搜索栏**: 实时搜索功能
- **分类标签**: 分类筛选选择器
- **排序按钮**: 排序方式选择器
- **API卡片网格**: 响应式网格布局
- **加载更多按钮**: 分页加载控制

### API卡片设计

- **头像显示**: API服务图标
- **基本信息**: 名称、描述、评分
- **标签系统**: 分类和自定义标签
- **统计信息**: 调用次数、响应时间、价格
- **操作按钮**: 查看详情、文档链接

## 性能优化

### 🚀 **加载优化**

- **分页加载**: 减少首次加载时间
- **防抖搜索**: 避免频繁API请求
- **错误边界**: 优雅处理异常情况
- **状态缓存**: 避免重复请求相同数据

### 🎨 **用户体验**

- **加载动画**: Loader2 旋转动画
- **响应式设计**: 适配不同屏幕尺寸
- **悬停效果**: 卡片悬停阴影效果
- **状态反馈**: 清晰的加载和错误状态

## 使用方式

### 在页面中引入

```typescript
import APIMarketSection from '@/components/sections/APIMarketSection'

export default function HomePage() {
  return <APIMarketSection />
}
```

### 自定义配置

组件内部已配置最佳参数，无需额外配置即可使用。

## API接口

### 获取API列表

```
GET /api/v1/apis/
参数:
- page: 页码 (默认: 1)
- page_size: 每页数量 (设置: 50)
- status: published (只显示已发布)
- is_public: true (只显示公开)
- sort_by: total_calls (按调用次数排序)
- sort_order: desc (降序)
- search: 搜索关键词 (可选)
- category: 分类筛选 (可选)
```

### 响应格式

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "API list retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "page_size": 50,
    "total": 100,
    "total_pages": 2,
    "has_next": true,
    "has_prev": false
  }
}
```

## 错误处理

### 网络错误

- 显示友好的错误提示
- 提供重试按钮
- toast消息通知

### 空状态

- 无数据时显示提示信息
- 搜索无结果的处理
- 加载失败的回退方案

## 未来扩展

- **无限滚动**: 替代点击加载更多
- **高级筛选**: 价格区间、评分筛选
- **收藏功能**: 用户收藏API
- **比较功能**: API服务对比
- **推荐算法**: 个性化推荐

## 测试验证

✅ **功能测试**: 所有基础功能正常工作  
✅ **API集成**: 真实数据加载成功  
✅ **错误处理**: 网络错误优雅处理  
✅ **响应式**: 不同设备适配良好  
✅ **性能优化**: 加载速度和用户体验良好

该组件已经准备就绪，可以在生产环境中使用！🎉
