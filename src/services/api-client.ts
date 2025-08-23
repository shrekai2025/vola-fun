// API 客户端配置 - 带有认证拦截器

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, TokenData, RefreshTokenResponse } from '@/types/auth'
import { TokenManager } from '@/lib/cookie'
// import Toast from '@/components/ui/toast'  // 不再使用Toast类，改为组件层面处理

// API 基础配置
// 🔧 调试开关：设置为true直接请求后端，false使用代理
const USE_DIRECT_API = false // 开发环境调试开关

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? (USE_DIRECT_API ? 'https://api.vola.fun' : '/api/proxy') // 开发环境：直接访问或使用代理
  : '/api/proxy' // 🔧 生产环境使用代理避免CORS问题
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
    console.error('API请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    // 只在严重错误时打印必要信息
    if (error.response?.status && error.response.status >= 500) {
      console.error('服务器错误:', error.response.status, error.config?.url)
    }
    
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
      // 关键检查：确保方法没有丢失
      if (!originalRequest?.method) {
        console.error('严重错误：请求method丢失，无法重试')
        return Promise.reject(new Error('HTTP method lost during token refresh'))
      }
      
      if (isRefreshing) {
        // 如果正在刷新，将请求加入队列
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (!originalRequest?.method) {
                reject(new Error('HTTP method lost during token refresh'))
                return
              }
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
        
        // 再次检查method
        if (!originalRequest?.method) {
          throw new Error('HTTP method lost during token refresh')
        }
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        processQueue(null, newAccessToken)
        return apiClient(originalRequest)
      } catch (refreshError) {
        console.error('令牌刷新失败:', refreshError)
        processQueue(refreshError, null)
        TokenManager.clearTokens()
        // 重定向到登录页面或显示登录弹窗
        // Session expired错误需要特殊处理，但也移除toast，让认证系统处理
        // Toast.error('Session expired, please log in again')
        // TODO: 触发登录弹窗
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 不自动显示toast，让组件自己处理
    // handleApiError(error)  // 移除自动toast显示
    return Promise.reject(error)
  }
)

// 统一错误处理函数（已停用 - 让组件自己处理错误显示以支持多语言）
// const handleApiError = (error: AxiosError) => {
//   // 这个函数已经不再使用，所有错误处理都由组件层面处理
//   // 以确保支持多语言和避免重复toast
// }

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
