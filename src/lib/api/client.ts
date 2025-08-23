import { API_CONFIG } from './config'
import { ApiResponse, ApiError, RequestConfig, HttpMethod } from './types'
import { TokenManager } from '@/lib/cookie'

class ApiClient {
  private baseURL: string
  private timeout: number
  private isRefreshing = false
  private refreshQueue: Array<{
    resolve: (token: string) => void
    reject: (error: unknown) => void
  }> = []

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = TokenManager.getRefreshToken()

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await this.request<{
        access_token: string
        refresh_token: string
        token_type: string
      }>(
        'POST',
        '/api/v1/auth/refresh',
        { refresh_token: refreshToken },
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

      throw new Error('Failed to refresh token')
    } catch (err) {
      TokenManager.clearTokens()
      throw err
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

      if (response.status === 401 && config?.retry !== false) {
        const isAuthEndpoint =
          endpoint.includes('/auth/login') ||
          endpoint.includes('/auth/refresh') ||
          endpoint.includes('/auth/logout')

        if (!isAuthEndpoint) {
          return this.handleTokenRefresh<T>(method, endpoint, data, config)
        }
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
