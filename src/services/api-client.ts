// API 客户端配置 - 带有认证拦截器

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, TokenData, RefreshTokenResponse } from '@/types/auth'
import { TokenManager } from '@/lib/cookie'
import Toast from '@/components/ui/toast'

// API 基础配置
// 🔧 调试开关：设置为true直接请求后端，false使用代理
const USE_DIRECT_API = true // 开发环境调试开关

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
    console.group('📤 [api-client] 请求拦截器')
    console.log('🔗 URL:', config.url)
    console.log('🔧 方法:', config.method?.toUpperCase())
    console.log('🏠 BaseURL:', config.baseURL)
    console.log('⏰ 超时设置:', config.timeout + 'ms')
    
    // 🔧 显示当前配置模式
    const mode = USE_DIRECT_API ? '🎯 直接请求后端 (跳过代理)' : '🌐 通过代理请求'
    console.log(`🚀 请求模式: ${mode}`)
    if (USE_DIRECT_API) {
      console.log('💡 当前正在直接请求后端API以排查代理问题')
    }
    
    // 若调用方已显式设置 Authorization，则不覆盖（例如登录时使用 Firebase ID Token）
    const hasCallerAuthHeader = Boolean(config.headers && (config.headers as any).Authorization)
    console.log('🔐 已有Authorization头:', hasCallerAuthHeader)
    
    if (!hasCallerAuthHeader) {
      const accessToken = TokenManager.getAccessToken()
      console.log('🔑 获取到的访问令牌:', accessToken ? `${accessToken.substring(0, 20)}...` : 'null')
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
        console.log('✅ 已添加Authorization头')
      } else {
        console.log('⚠️ 没有访问令牌，未添加Authorization头')
      }
    }

    // 添加 API Key（如果有的话）
    // TODO: 后续从用户设置中获取 API Key
    // config.headers['x-vola-key'] = userApiKey

    console.log('📋 请求头:', config.headers)
    if (config.data) {
      console.log('📦 请求数据:', typeof config.data === 'string' ? config.data : JSON.stringify(config.data, null, 2))
    }
    console.groupEnd()

    return config
  },
  (error) => {
    console.error('❌ [api-client] 请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.group('📥 [api-client] 响应拦截器 - 成功')
    console.log('🔗 URL:', response.config.url)
    console.log('🔧 方法:', response.config.method?.toUpperCase())
    console.log('📊 状态码:', response.status)
    console.log('📝 状态文本:', response.statusText)
    console.log('📋 响应头:', response.headers)
    console.log('📦 响应数据:', response.data)
    console.groupEnd()
    return response
  },
  async (error: AxiosError) => {
    console.group('❌ [api-client] 响应拦截器 - 错误')
    console.error('完整错误对象:', error)
    console.error('错误消息:', error.message)
    console.error('错误代码:', error.code)
    
    if (error.response) {
      console.error('📥 错误响应:')
      console.error('  状态码:', error.response.status)
      console.error('  状态文本:', error.response.statusText)
      console.error('  响应头:', error.response.headers)
      console.error('  响应数据:', error.response.data)
    } else if (error.request) {
      console.error('📤 请求错误 (无响应):')
      console.error('  请求对象:', error.request)
    }
    
    if (error.config) {
      console.error('⚙️ 请求配置:')
      console.error('  URL:', error.config.url)
      console.error('  方法:', error.config.method)
      console.error('  baseURL:', error.config.baseURL)
    }
    console.groupEnd()
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const requestUrl = (originalRequest && originalRequest.url) || ''

    // 登录/刷新/登出接口出现 401 时不触发刷新逻辑，直接抛错
    const isAuthLogin = requestUrl.includes('/api/v1/auth/login')
    const isAuthRefresh = requestUrl.includes('/api/v1/auth/refresh')
    const isAuthLogout = requestUrl.includes('/api/v1/auth/logout')
    if ((isAuthLogin || isAuthRefresh || isAuthLogout) && error.response?.status === 401) {
      console.log('🔄 [api-client] 认证相关接口401错误，跳过令牌刷新')
      return Promise.reject(error)
    }

    // 处理 401 未授权错误（Token 过期）
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 [api-client] 检测到401错误，准备刷新令牌')
      console.log('🔍 [api-client] 原始请求详情:', {
        url: originalRequest?.url,
        method: originalRequest?.method, // 关键：检查method是否丢失
        hasAuthHeader: !!(originalRequest?.headers?.Authorization),
        _retry: originalRequest?._retry
      })
      
      // 🚨 关键检查：确保方法没有丢失
      if (!originalRequest?.method) {
        console.error('🚨 [api-client] 严重错误：originalRequest.method 丢失!')
        console.error('🚨 [api-client] 这可能导致重试时默认使用GET方法')
        console.error('🚨 [api-client] originalRequest对象:', originalRequest)
      }
      
      if (isRefreshing) {
        console.log('🔄 [api-client] 已在刷新令牌，将请求加入队列')
        // 如果正在刷新，将请求加入队列
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (!originalRequest?.method) {
                console.error('🚨 [api-client] 队列重试时method仍然丢失!')
                reject(new Error('HTTP method lost during token refresh'))
                return
              }
              originalRequest.headers.Authorization = `Bearer ${token}`
              console.log('🔄 [api-client] 队列重试请求:', originalRequest.method, originalRequest.url)
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
        console.log('🔄 [api-client] 开始刷新访问令牌')
        const newAccessToken = await refreshToken()
        console.log('✅ [api-client] 令牌刷新成功，准备重试原始请求')
        
        // 再次检查method
        if (!originalRequest?.method) {
          console.error('🚨 [api-client] 令牌刷新后method仍然丢失!')
          throw new Error('HTTP method lost during token refresh')
        }
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        console.log('🔄 [api-client] 重试请求:', originalRequest.method, originalRequest.url)
        
        processQueue(null, newAccessToken)
        return apiClient(originalRequest)
      } catch (refreshError) {
        console.error('❌ [api-client] 令牌刷新失败:', refreshError)
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
