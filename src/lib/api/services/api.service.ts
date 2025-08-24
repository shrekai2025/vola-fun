import type {
  API,
  APICategory,
  APIDocumentation,
  APIListParams,
  ApiResponse,
  APIVersion,
  CreateAPIData,
  CreateAPIVersionData,
  PaginatedResponse,
  UpdateAPIData,
} from '@/types/api'
import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'

// 重新导出类型以保持向后兼容
export type { API, APIListParams, CreateAPIData, UpdateAPIData }

export class APIService {
  /**
   * 获取API列表
   */
  static async list(params?: APIListParams): Promise<PaginatedResponse<API>> {
    // 处理数组参数的序列化
    const processedParams: Record<string, string | number | boolean> = {
      page: 1,
      page_size: 20,
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            // 将数组转换为逗号分隔的字符串
            processedParams[key] = value.join(',')
          } else {
            processedParams[key] = value
          }
        }
      })
    }

    const response = (await apiClient.get<API[]>(API_ENDPOINTS.APIS.LIST, {
      params: processedParams,
    })) as PaginatedResponse<API>

    return response
  }

  /**
   * 获取API详情
   */
  static async get(id: string): Promise<ApiResponse<API>> {
    const response = await apiClient.get<API>(API_ENDPOINTS.APIS.DETAIL(id))
    return response
  }

  /**
   * 创建API
   */
  static async create(data: CreateAPIData): Promise<ApiResponse<API>> {
    const response = await apiClient.post<API>(API_ENDPOINTS.APIS.CREATE, data)
    return response
  }

  /**
   * 更新API
   */
  static async update(id: string, data: UpdateAPIData): Promise<ApiResponse<API>> {
    const response = await apiClient.patch<API>(API_ENDPOINTS.APIS.UPDATE(id), data)
    return response
  }

  /**
   * 删除API
   */
  static async delete(id: string): Promise<ApiResponse<null>> {
    const response = (await apiClient.delete(API_ENDPOINTS.APIS.DELETE(id))) as ApiResponse<null>
    return response
  }

  /**
   * 获取市场API列表（公开且已发布）
   */
  static async getMarketAPIs(params?: APIListParams): Promise<PaginatedResponse<API>> {
    return this.list({
      ...params,
      status: 'published',
      is_public: true,
    })
  }

  /**
   * 获取用户的API列表
   */
  static async getUserAPIs(
    userId?: string,
    params?: APIListParams
  ): Promise<PaginatedResponse<API>> {
    return this.list({
      ...params,
      owner_id: userId,
    })
  }

  /**
   * 搜索API
   */
  static async searchAPIs(
    query: string,
    params?: Omit<APIListParams, 'search'>
  ): Promise<PaginatedResponse<API>> {
    return this.list({
      ...params,
      search: query,
      status: 'published',
      is_public: true,
    })
  }

  /**
   * 根据分类获取API
   */
  static async getAPIsByCategory(
    category: APICategory,
    params?: Omit<APIListParams, 'category'>
  ): Promise<PaginatedResponse<API>> {
    return this.list({
      ...params,
      category,
      status: 'published',
      is_public: true,
    })
  }

  /**
   * 获取热门API
   */
  static async getPopularAPIs(params?: APIListParams): Promise<PaginatedResponse<API>> {
    return this.list({
      ...params,
      sort_by: 'total_calls',
      sort_order: 'desc',
      status: 'published',
      is_public: true,
    })
  }

  /**
   * 获取最新API
   */
  static async getLatestAPIs(params?: APIListParams): Promise<PaginatedResponse<API>> {
    return this.list({
      ...params,
      sort_by: 'created_at',
      sort_order: 'desc',
      status: 'published',
      is_public: true,
    })
  }

  /**
   * 上传API头像
   */
  static async uploadAvatar(
    apiId: string,
    avatar: File
  ): Promise<ApiResponse<{ avatar_url: string }>> {
    const formData = new FormData()
    formData.append('avatar', avatar)

    const response = await apiClient.post<{ avatar_url: string }>(
      API_ENDPOINTS.APIS.UPLOAD_AVATAR(apiId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response
  }

  /**
   * 获取API版本历史
   */
  static async getVersions(apiId: string): Promise<ApiResponse<APIVersion[]>> {
    const response = await apiClient.get<APIVersion[]>(API_ENDPOINTS.APIS.VERSIONS.LIST(apiId))
    return response
  }

  /**
   * 创建API版本
   */
  static async createVersion(
    apiId: string,
    data: CreateAPIVersionData
  ): Promise<ApiResponse<APIVersion>> {
    const response = await apiClient.post<APIVersion>(
      API_ENDPOINTS.APIS.VERSIONS.CREATE(apiId),
      data
    )
    return response
  }

  /**
   * 获取API文档
   */
  static async getDocumentation(apiId: string): Promise<ApiResponse<APIDocumentation>> {
    const response = await apiClient.get<APIDocumentation>(
      API_ENDPOINTS.APIS.DOCUMENTATION.GET(apiId)
    )
    return response
  }

  /**
   * 更新API文档
   */
  static async updateDocumentation(
    apiId: string,
    content: string
  ): Promise<ApiResponse<APIDocumentation>> {
    const response = await apiClient.put<APIDocumentation>(
      API_ENDPOINTS.APIS.DOCUMENTATION.UPDATE(apiId),
      { content }
    )
    return response
  }
}

export default APIService
