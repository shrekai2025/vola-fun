import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import type { LoginCredentials, TokenData, User, ApiResponse } from '@/types/api'

// 重新导出类型以保持向后兼容
export type { LoginCredentials, TokenData, User }

export class AuthService {
  /**
   * 登录 - 使用Firebase ID Token
   */
  static async login(credentials: LoginCredentials): Promise<ApiResponse<TokenData>> {
    const response = await apiClient.post<TokenData>(API_ENDPOINTS.AUTH.LOGIN, null, {
      headers: {
        Authorization: `Bearer ${credentials.firebase_id_token}`,
      },
    })

    return response
  }

  /**
   * 刷新Token
   */
  static async refreshToken(refreshToken: string): Promise<ApiResponse<TokenData>> {
    const response = await apiClient.post<TokenData>(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    })

    return response
  }

  /**
   * 登出
   */
  static async logout(): Promise<ApiResponse<null>> {
    const response = await apiClient.post<null>(API_ENDPOINTS.AUTH.LOGOUT)
    return response
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<User>(API_ENDPOINTS.USERS.ME)
    return response
  }

  /**
   * 获取当前用户详细信息
   */
  /**
   * 获取当前用户详细信息
   */
  static async getCurrentUserDetailed(): Promise<ApiResponse<User>> {
    const response = await apiClient.get<User>(API_ENDPOINTS.USERS.ME_DETAILED)
    return response
  }

  /**
   * 获取当前用户统计信息
   */
  static async getCurrentUserStats(): Promise<
    ApiResponse<{
      total_apis: number
      total_nodes: number
      total_favorites: number
      total_api_calls: number
      total_revenue: number
      member_since_days: number
    }>
  > {
    const response = await apiClient.get(API_ENDPOINTS.USERS.ME_STATS)
    return response as ApiResponse<{
      total_apis: number
      total_nodes: number
      total_favorites: number
      total_api_calls: number
      total_revenue: number
      member_since_days: number
    }>
  }
}

export default AuthService
