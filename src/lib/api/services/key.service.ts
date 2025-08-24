import type {
  APIKey,
  ApiResponse,
  CreateKeyData,
  KeyListParams,
  PaginatedResponse,
  RegeneratedKey,
  UpdateKeyData,
} from '@/types/api'
import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'

export type { APIKey, CreateKeyData, KeyListParams, RegeneratedKey, UpdateKeyData }

export class KeyService {
  /**
   * 获取API密钥列表
   */
  static async list(params?: KeyListParams): Promise<PaginatedResponse<APIKey>> {
    const response = (await apiClient.get<APIKey[]>(API_ENDPOINTS.KEYS.LIST, {
      params: {
        page: 1,
        page_size: 20,
        ...params,
      },
    })) as PaginatedResponse<APIKey>

    return response
  }

  /**
   * 获取API密钥详情
   */
  static async get(keyId: string): Promise<ApiResponse<APIKey>> {
    const response = await apiClient.get<APIKey>(API_ENDPOINTS.KEYS.DETAIL(keyId))
    return response
  }

  /**
   * 创建API密钥
   */
  static async create(data: CreateKeyData): Promise<ApiResponse<APIKey & { api_key: string }>> {
    const response = await apiClient.post<APIKey & { api_key: string }>(
      API_ENDPOINTS.KEYS.CREATE,
      data
    )
    return response
  }

  /**
   * 更新API密钥配置
   */
  static async update(keyId: string, data: UpdateKeyData): Promise<ApiResponse<APIKey>> {
    const response = await apiClient.patch<APIKey>(API_ENDPOINTS.KEYS.UPDATE(keyId), data)
    return response
  }

  /**
   * 删除API密钥
   */
  static async delete(keyId: string): Promise<ApiResponse<null>> {
    const response = (await apiClient.delete(API_ENDPOINTS.KEYS.DELETE(keyId))) as ApiResponse<null>
    return response
  }

  /**
   * 重新生成API密钥
   */
  static async regenerate(keyId: string): Promise<ApiResponse<RegeneratedKey>> {
    const response = await apiClient.post<RegeneratedKey>(API_ENDPOINTS.KEYS.REGENERATE(keyId))
    return response
  }

  /**
   * 获取用户活跃的密钥
   */
  static async getActiveKeys(): Promise<PaginatedResponse<APIKey>> {
    return this.list({ is_active: true })
  }

  /**
   * 搜索API密钥
   */
  static async searchKeys(
    query: string,
    params?: Omit<KeyListParams, 'search'>
  ): Promise<PaginatedResponse<APIKey>> {
    return this.list({
      ...params,
      search: query,
    })
  }
}

export default KeyService
