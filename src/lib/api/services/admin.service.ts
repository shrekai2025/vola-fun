import type {
  AdminUserData,
  ApiResponse,
  PaginatedResponse,
  User,
  UserListParams,
} from '@/types/api'
import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'

export type { AdminUserData, UserListParams }

export class AdminService {
  /**
   * 获取用户列表（管理员功能）
   */
  static async getUserList(params?: UserListParams): Promise<PaginatedResponse<User>> {
    const response = (await apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST, {
      params: {
        page: 1,
        page_size: 20,
        ...params,
      },
    })) as PaginatedResponse<User>

    return response
  }

  /**
   * 获取管理员用户详情
   */
  static async getUserDetail(userId: string): Promise<ApiResponse<AdminUserData>> {
    const response = await apiClient.get<AdminUserData>(API_ENDPOINTS.USERS.ADMIN_DETAIL(userId))
    return response
  }

  /**
   * 更新用户信息（管理员功能）
   */
  static async updateUser(
    userId: string,
    data: Partial<AdminUserData>
  ): Promise<ApiResponse<User>> {
    const response = await apiClient.put<User>(API_ENDPOINTS.USERS.ADMIN_UPDATE(userId), data)
    return response
  }

  /**
   * 验证用户邮箱（管理员功能）
   */
  static async verifyUserEmail(userId: string): Promise<ApiResponse<null>> {
    const response = (await apiClient.post(
      API_ENDPOINTS.USERS.ADMIN_VERIFY(userId)
    )) as ApiResponse<null>
    return response
  }

  /**
   * 暂停用户（管理员功能）
   */
  static async suspendUser(userId: string, reason?: string): Promise<ApiResponse<null>> {
    const response = (await apiClient.post(API_ENDPOINTS.USERS.ADMIN_SUSPEND(userId), {
      reason,
    })) as ApiResponse<null>
    return response
  }

  /**
   * 激活用户（管理员功能）
   */
  static async activateUser(userId: string): Promise<ApiResponse<null>> {
    const response = (await apiClient.post(
      API_ENDPOINTS.USERS.ADMIN_ACTIVATE(userId)
    )) as ApiResponse<null>
    return response
  }

  /**
   * 按角色获取用户列表
   */
  static async getUsersByRole(
    role: 'USER' | 'PROVIDER' | 'ADMIN',
    params?: Omit<UserListParams, 'role'>
  ): Promise<PaginatedResponse<User>> {
    return this.getUserList({
      ...params,
      role,
    })
  }

  /**
   * 获取待验证的用户列表
   */
  static async getPendingVerificationUsers(
    params?: Omit<UserListParams, 'is_verified'>
  ): Promise<PaginatedResponse<User>> {
    return this.getUserList({
      ...params,
      is_verified: false,
    })
  }

  /**
   * 获取非活跃用户列表
   */
  static async getInactiveUsers(
    params?: Omit<UserListParams, 'is_active'>
  ): Promise<PaginatedResponse<User>> {
    return this.getUserList({
      ...params,
      is_active: false,
    })
  }

  /**
   * 批量操作用户
   */
  static async batchUpdateUsers(
    userIds: string[],
    data: { is_active?: boolean; role?: 'USER' | 'PROVIDER' | 'ADMIN' }
  ): Promise<ApiResponse<{ updated_count: number }>> {
    const promises = userIds.map((userId) => this.updateUser(userId, data))

    try {
      const results = await Promise.allSettled(promises)
      const successCount = results.filter((result) => result.status === 'fulfilled').length

      return {
        success: true,
        code: 'SUCCESS',
        message: `批量更新完成，成功更新 ${successCount} 个用户`,
        data: { updated_count: successCount },
      }
    } catch (error) {
      throw error
    }
  }
}

export default AdminService
