// API 客户端配置 - 带有认证拦截器

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, TokenData, RefreshTokenResponse } from '@/types/auth'
import { TokenManager } from '@/lib/cookie'
import Toast from '@/components/ui/toast'

// API 基础配置
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '/api/proxy' // 开发环境使用代理
  : 'https://api.vola.fun' // 生产环境直接访问
const REQUEST_TIMEOUT = 30000 // 30秒超时

// 创建 Axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 刷新 token 的状态管理
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

// 处理队列中的请求
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })
  
  failedQueue = []
}

// 刷新 Token 函数
const refreshToken = async (): Promise<string> => {
  const refreshTokenValue = TokenManager.getRefreshToken()
  
  if (!refreshTokenValue) {
    throw new Error('没有可用的刷新令牌')
  }

  try {
    const response = await axios.post<RefreshTokenResponse>(
      `${API_BASE_URL}/api/v1/auth/refresh`,
      { refresh_token: refreshTokenValue },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: REQUEST_TIMEOUT
      }
    )

    if (response.data.success && response.data.data) {
      const tokens = response.data.data
      TokenManager.setTokens({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenType: tokens.token_type
      })
      return tokens.access_token
    } else {
      throw new Error(response.data.message || '刷新令牌失败')
    }
  } catch (error) {
    console.error('Token refresh failed:', error)
    TokenManager.clearTokens()
    throw error
  }
}

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 若调用方已显式设置 Authorization，则不覆盖（例如登录时使用 Firebase ID Token）
    const hasCallerAuthHeader = Boolean(config.headers && (config.headers as any).Authorization)
    if (!hasCallerAuthHeader) {
      const accessToken = TokenManager.getAccessToken()
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
    }

    // 添加 API Key（如果有的话）
    // TODO: 后续从用户设置中获取 API Key
    // config.headers['x-vola-key'] = userApiKey

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const requestUrl = (originalRequest && originalRequest.url) || ''

    // 登录/刷新/登出接口出现 401 时不触发刷新逻辑，直接抛错
    const isAuthLogin = requestUrl.includes('/api/v1/auth/login')
    const isAuthRefresh = requestUrl.includes('/api/v1/auth/refresh')
    const isAuthLogout = requestUrl.includes('/api/v1/auth/logout')
    if ((isAuthLogin || isAuthRefresh || isAuthLogout) && error.response?.status === 401) {
      return Promise.reject(error)
    }

    // 处理 401 未授权错误（Token 过期）
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 如果正在刷新，将请求加入队列
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(apiClient(originalRequest))
            },
            reject: (err: any) => {
              reject(err)
            }
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newAccessToken = await refreshToken()
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        processQueue(null, newAccessToken)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        TokenManager.clearTokens()
        // 重定向到登录页面或显示登录弹窗
        Toast.error('Session expired, please log in again')
        // TODO: 触发登录弹窗
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 处理其他错误
    handleApiError(error)
    return Promise.reject(error)
  }
)

// 统一错误处理
const handleApiError = (error: AxiosError) => {
  if (error.code === 'ECONNABORTED') {
    Toast.error('Request timeout, please try again later')
  } else if (error.code === 'ERR_NETWORK') {
    Toast.error('Network connection failed, please check network settings')
  } else if (error.code === 'ERR_INSUFFICIENT_RESOURCES') {
    Toast.error('Too many requests, please wait and try again')
  } else if (error.response) {
    const status = error.response.status
    const data = error.response.data as any

    switch (status) {
      case 400:
        Toast.error(data?.message || 'Invalid request parameters')
        break
      case 401:
        Toast.error(data?.message || 'Authentication failed')
        break
      case 403:
        Toast.error(data?.message || 'Access denied')
        break
      case 404:
        Toast.error(data?.message || 'Requested resource not found')
        break
      case 429:
        Toast.error(data?.message || 'Too many requests, please try again later')
        break
      case 500:
        Toast.error(data?.message || 'Internal server error')
        break
      default:
        Toast.error(data?.message || `Request failed (${status})`)
    }
  } else {
    Toast.error('Network error, please try again later')
  }
}

// 导出配置好的 API 客户端
export default apiClient

// 导出便捷的 API 方法
export const api = {
  get: <T = any>(url: string, config?: any) =>
    apiClient.get<ApiResponse<T>>(url, config),
  
  post: <T = any>(url: string, data?: any, config?: any) =>
    apiClient.post<ApiResponse<T>>(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: any) =>
    apiClient.put<ApiResponse<T>>(url, data, config),
  
  delete: <T = any>(url: string, config?: any) =>
    apiClient.delete<ApiResponse<T>>(url, config),
  
  patch: <T = any>(url: string, data?: any, config?: any) =>
    apiClient.patch<ApiResponse<T>>(url, data, config),
}
