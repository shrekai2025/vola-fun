import type { ApiError, ApiResponse, HttpMethod, RequestConfig } from '@/types/api'
import { TokenManager } from '@/utils/cookie'
import { API_CONFIG } from './config'

// 🔧 调试开关：设置为true直接请求后端，false使用代理
const USE_DIRECT_API = false // 开发环境调试开关

class ApiClient {
  private baseURL: string
  private timeout: number
  private isRefreshing = false
  private refreshQueue: Array<{
    resolve: (token: string) => void
    reject: (error: unknown) => void
  }> = []

  constructor() {
    // 支持调试模式的 URL 配置
    this.baseURL =
      process.env.NODE_ENV === 'development'
        ? USE_DIRECT_API
          ? 'https://api.vola.fun'
          : '/api/proxy' // 开发环境：直接访问或使用代理
        : '/api/proxy' // 🔧 生产环境使用代理避免CORS问题
    this.timeout = API_CONFIG.TIMEOUT
  }

  private async refreshToken(): Promise<string> {
    const refreshTokenValue = TokenManager.getRefreshToken()

    if (!refreshTokenValue) {
      throw new Error('没有可用的刷新令牌')
    }

    try {
      const response = await this.request<{
        access_token: string
        refresh_token: string
        token_type: string
      }>(
        'POST',
        '/api/v1/auth/refresh',
        { refresh_token: refreshTokenValue },
        {
          retry: false,
        }
      )

      if (response.success && response.data) {
        TokenManager.setTokens({
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          tokenType: response.data.token_type,
        })
        return response.data.access_token
      }

      throw new Error(response.message || '刷新令牌失败')
    } catch (error) {
      console.error('Token refresh failed:', error)
      TokenManager.clearTokens()
      throw error
    }
  }

  private processRefreshQueue(error: unknown, token: string | null = null) {
    this.refreshQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else if (token) {
        resolve(token)
      }
    })
    this.refreshQueue = []
  }

  private async handleTokenRefresh<T>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.refreshQueue.push({
          resolve: async (token: string) => {
            const newConfig = {
              ...config,
              headers: {
                ...config?.headers,
                Authorization: `Bearer ${token}`,
              },
            }
            try {
              const response = await this.request<T>(method, endpoint, data, newConfig)
              resolve(response)
            } catch (err) {
              reject(err)
            }
          },
          reject,
        })
      })
    }

    this.isRefreshing = true

    try {
      const newToken = await this.refreshToken()
      this.processRefreshQueue(null, newToken)

      const newConfig = {
        ...config,
        headers: {
          ...config?.headers,
          Authorization: `Bearer ${newToken}`,
        },
      }

      return await this.request<T>(method, endpoint, data, newConfig)
    } catch (err) {
      this.processRefreshQueue(err)
      throw err
    } finally {
      this.isRefreshing = false
    }
  }

  async request<T = unknown>(
    method: HttpMethod,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...config?.headers,
    }

    const accessToken = TokenManager.getAccessToken()
    if (accessToken && !headers.Authorization) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    const requestInit: RequestInit = {
      method,
      headers,
      signal: config?.signal,
    }

    if (data && method !== 'GET') {
      requestInit.body = JSON.stringify(data)
    }

    if (config?.params && method === 'GET') {
      const searchParams = new URLSearchParams(config.params as Record<string, string>)
      const separator = url.includes('?') ? '&' : '?'
      endpoint = `${url}${separator}${searchParams.toString()}`
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      if (config?.signal) {
        config.signal.addEventListener('abort', () => controller.abort())
      }

      const response = await fetch(
        method === 'GET' && config?.params
          ? `${url}?${new URLSearchParams(config.params as Record<string, string>).toString()}`
          : url,
        {
          ...requestInit,
          signal: controller.signal,
        }
      )

      clearTimeout(timeoutId)

      // 只在严重错误时打印必要信息
      if (response.status >= 500) {
        console.error('服务器错误:', response.status, endpoint)
      }

      if (response.status === 401 && config?.retry !== false) {
        const isAuthLogin = endpoint.includes('/api/v1/auth/login')
        const isAuthRefresh = endpoint.includes('/api/v1/auth/refresh')
        const isAuthLogout = endpoint.includes('/api/v1/auth/logout')

        // 登录/刷新/登出接口出现 401 时不触发刷新逻辑，直接抛错
        if (isAuthLogin || isAuthRefresh || isAuthLogout) {
          const responseData = await response.json()
          const error: ApiError = {
            code: responseData.code || response.status.toString(),
            message: responseData.message || 'Request failed',
            details: responseData.details,
          }
          throw error
        }

        return this.handleTokenRefresh<T>(method, endpoint, data, config)
      }

      const responseData = await response.json()

      if (!response.ok) {
        const error: ApiError = {
          code: responseData.code || response.status.toString(),
          message: responseData.message || 'Request failed',
          details: responseData.details,
        }
        throw error
      }

      return responseData as ApiResponse<T>
    } catch (error: unknown) {
      const errorName = (error as { name?: string })?.name
      if (errorName === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  async get<T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, config)
  }

  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, config)
  }

  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, config)
  }

  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', endpoint, data, config)
  }

  async delete<T = unknown>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, config)
  }
}

export const apiClient = new ApiClient()
export default apiClient
