/**
 * API通用类型定义
 */

// 基础API响应结构
export interface ApiResponse<T = unknown> {
  success: boolean
  code: string
  message: string
  data: T
}

// 分页响应结构
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

// API错误结构  
export interface ApiError {
  code: string
  message: string
  details?: Record<string, string | number | boolean>
}

// 请求配置
export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  signal?: AbortSignal
  retry?: boolean
  retryCount?: number
}

// HTTP方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// 参数类型定义
export type ParamType = 'string' | 'number' | 'boolean' | 'object' | 'array'

// 参数配置对象
export interface ParamConfig {
  name: string
  type: ParamType
  description: string
  example?: string | number | boolean | object
  required: boolean
}

// 应用信息
export interface AppInfo {
  name: string
  version: string
  status: 'running' | 'stopped'
}

// 健康检查状态
export type HealthStatus = 'healthy' | 'unhealthy' | 'degraded'

// 依赖服务状态
export interface DependencyStatus {
  status: HealthStatus
  error?: string
}

// 健康检查响应
export interface HealthCheckData {
  status: HealthStatus
  environment: 'development' | 'production'
  dependencies: {
    redis: DependencyStatus
    database: DependencyStatus
  }
}

// 排序配置
export interface SortConfig {
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// 分页配置
export interface PaginationConfig {
  page?: number
  page_size?: number
}

// 基础查询参数
export interface BaseQueryParams extends PaginationConfig, SortConfig {
  search?: string
}

// 通用请求体类型
export type RequestBody = 
  | Record<string, any>
  | FormData
  | string
  | null
  | undefined

// 通用响应数据类型约束
export type ResponseData = 
  | Record<string, any>
  | any[]
  | string
  | number
  | boolean
  | null
