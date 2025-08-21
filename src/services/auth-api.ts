// 认证相关 API 服务

import { api } from './api-client'
import type { LoginResponse, RefreshTokenResponse, LogoutResponse, TokenData } from '@/types/auth'

/**
 * 认证 API 服务类
 */
export class AuthAPI {
  /**
   * 使用 Firebase ID Token 登录获取 JWT
   */
  static async loginWithFirebaseToken(firebaseIdToken: string): Promise<TokenData> {
    try {
      // 调试：打印 Firebase ID Token 信息
      console.log('🔐 Firebase ID Token (前100字符):', firebaseIdToken.substring(0, 100) + '...')
      
      // 解析 ID Token payload（用于调试）
      try {
        const [header, payload, signature] = firebaseIdToken.split('.')
        const decodedPayload = JSON.parse(atob(payload))
        console.log('📋 ID Token 信息:', {
          aud: decodedPayload.aud,
          iss: decodedPayload.iss,
          exp: decodedPayload.exp,
          expTime: new Date(decodedPayload.exp * 1000).toLocaleString(),
          currentTime: new Date().toLocaleString(),
          isExpired: decodedPayload.exp * 1000 < Date.now()
        })
      } catch (parseError) {
        console.error('❌ 无法解析 ID Token payload:', parseError)
      }

      console.log('🚀 发送登录请求到:', '/api/v1/auth/login')
      
      const response = await api.post<TokenData>('/api/v1/auth/login', null, {
        headers: {
          'Authorization': `Bearer ${firebaseIdToken}`
        }
      })

      console.log('✅ 后端响应成功:', {
        status: response.status,
        data: response.data
      })

      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.message || '登录失败')
      }
    } catch (error: any) {
      console.error('❌ Login API error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code
      })
      throw error
    }
  }

  /**
   * 刷新访问令牌
   */
  static async refreshAccessToken(refreshToken: string): Promise<TokenData> {
    try {
      const response = await api.post<TokenData>('/api/v1/auth/refresh', {
        refresh_token: refreshToken
      })

      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.message || '刷新令牌失败')
      }
    } catch (error) {
      console.error('Refresh token API error:', error)
      throw error
    }
  }

  /**
   * 登出
   */
  static async logout(): Promise<void> {
    try {
      const response = await api.post<null>('/api/v1/auth/logout')

      if (!response.data.success) {
        throw new Error(response.data.message || '登出失败')
      }
    } catch (error) {
      console.error('Logout API error:', error)
      throw error
    }
  }

  /**
   * 获取当前登录用户信息
   */
  static async getUserInfo(): Promise<any> {
    try {
      console.log('🔍 获取用户信息...')
      const response = await api.get('/api/v1/users/me')
      
      console.log('✅ 用户信息获取成功:', response.data)
      
      if (response.data.success && response.data.data) {
        return response.data.data
      } else {
        throw new Error(response.data.message || '获取用户信息失败')
      }
    } catch (error: any) {
      console.error('❌ Get user info API error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
      throw error
    }
  }
}

export default AuthAPI
