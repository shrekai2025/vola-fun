/**
 * 统一类型定义导出
 * 重新导出所有分类的类型定义
 */

// API相关类型
export * from './api'

// UI组件相关类型
export * from './ui'

// 通用类型 (排除与UI冲突的类型)
export type {
  BaseEntity,
  Optional,
  DeepPartial,
  KeyOf,
  ValueOf,
  NonNullable,
  ArrayElement,
  Parameters,
  ReturnType,
  Awaited,
  Environment,
  AppError,
  ServiceResponse,
  PaginatedData,
  FileInfo,
  Coordinate,
  Dimension,
  Rectangle,
  Color,
  Timestamp,
  UrlString,
  EmailAddress,
  PhoneNumber,
  UUID,
  JsonValue,
  JsonObject,
  JsonArray,
  Config,
  EventHandler,
  Callback,
  CancelFunction,
  CleanupFunction,
} from './common'

// 保留兼容性的旧类型定义（将逐步替换）
export interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed?: string
  isActive: boolean
}

// 旧的API服务接口，保留向后兼容
export interface ApiService {
  id: string
  projectName: string
  projectId: string
  description: string
  estimatedResponseTime: number
  categories: string[]
  providerEndpoint: string
  providerKey: string
  pricePerCall: number
  documentation: ApiDocumentation
  userEndpoint: string
  totalUsageCount: number
  rating: number
  reviews: ApiReview[]
}

export interface ApiDocumentation {
  requestParams: ApiParam[]
  responseParams: ApiParam[]
  statusCodes: StatusCode[]
  examples: {
    request: Record<string, unknown>
    response: Record<string, unknown>
  }
}

export interface ApiParam {
  name: string
  type: string
  required: boolean
  description: string
  example?: unknown
}

export interface StatusCode {
  code: number
  description: string
}

export interface ApiReview {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface ApiUsageLog {
  id: string
  userId: string
  apiServiceId: string
  projectName: string
  timestamp: string
  status: 'success' | 'failed'
  creditsUsed: number
  requestData?: Record<string, unknown>
  responseData?: Record<string, unknown>
}

// 已被新的API类型替代，保留兼容性
export interface ApiCallRequest {
  apiId: string
  params: Record<string, unknown>
}

export interface ApiCallResponse {
  success: boolean
  data?: unknown
  error?: string
  creditsUsed: number
}
