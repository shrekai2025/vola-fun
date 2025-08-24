import type { ApiResponse, DetailedUser, UpdateUserData, User, UserStats } from '@/types/api'
import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'

export type { DetailedUser, UpdateUserData, User, UserStats }

export class UserService {
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
  static async getCurrentUserDetailed(): Promise<ApiResponse<DetailedUser>> {
    const response = await apiClient.get<DetailedUser>(API_ENDPOINTS.USERS.ME_DETAILED)
    return response
  }

  /**
   * 获取当前用户统计信息
   */
  static async getCurrentUserStats(): Promise<ApiResponse<UserStats>> {
    const response = await apiClient.get<UserStats>(API_ENDPOINTS.USERS.ME_STATS)
    return response
  }

  /**
   * 更新当前用户资料
   */
  static async updateProfile(data: UpdateUserData): Promise<ApiResponse<User>> {
    const response = await apiClient.put<User>(API_ENDPOINTS.USERS.ME, data)
    return response
  }

  /**
   * 删除当前用户账户
   */
  static async deleteAccount(): Promise<ApiResponse<null>> {
    const response = (await apiClient.delete(API_ENDPOINTS.USERS.DELETE_ME)) as ApiResponse<null>
    return response
  }

  /**
   * 获取用户公开信息
   */
  static async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get<User>(API_ENDPOINTS.USERS.DETAIL(userId))
    return response
  }
}

export default UserService
