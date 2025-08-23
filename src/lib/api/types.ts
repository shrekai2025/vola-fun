export interface ApiResponse<T = unknown> {
  success: boolean
  code: string
  message: string
  data: T
}

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

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, unknown>
  signal?: AbortSignal
  retry?: boolean
  retryCount?: number
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
