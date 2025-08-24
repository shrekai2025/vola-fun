/**
 * 网关相关类型定义
 */

export interface APIHealthStatus {
  api_slug: string
  status: 'healthy' | 'unhealthy' | 'maintenance'
  response_time: number
  uptime_percentage: number
  last_check: string
  error_message?: string
}

export interface ProxyRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
}

export interface ProxyResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}
