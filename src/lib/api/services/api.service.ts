import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { PaginatedResponse, RequestConfig } from '../types'

export interface API {
  id: string
  name: string
  slug: string
  short_description: string
  long_description?: string
  avatar_url?: string
  category: string
  tags: string[]
  base_url: string
  health_check_url?: string
  status: 'draft' | 'published' | 'deprecated' | 'suspended'
  is_public: boolean
  website_url?: string
  documentation_url?: string
  terms_url?: string
  documentation_markdown?: string
  total_calls: number
  total_revenue: number
  rating?: number
  estimated_response_time?: number
  owner_id: string
  owner?: {
    id: string
    username: string
    full_name?: string
    avatar_url?: string
  }
  created_at: string
  updated_at: string
}

export interface APIListParams {
  page?: number
  page_size?: number
  status?: 'draft' | 'published' | 'deprecated' | 'suspended'
  category?: string
  search?: string
  owner_id?: string
  tags?: string[]
  sort_by?: 'total_calls' | 'rating' | 'created_at' | 'updated_at'
  sort_order?: 'asc' | 'desc'
  is_public?: boolean
}

export interface CreateAPIData {
  name: string
  slug: string
  short_description: string
  long_description?: string
  category: string
  tags: string[]
  base_url: string
  health_check_url?: string
  is_public: boolean
  website_url?: string
  documentation_url?: string
  terms_url?: string
  gateway_key?: string
  documentation_markdown?: string
  estimated_response_time?: number
}

export interface UpdateAPIData extends Partial<CreateAPIData> {
  status?: 'draft' | 'published' | 'deprecated' | 'suspended'
}

export class APIService {
  static async list(
    params?: APIListParams,
    config?: RequestConfig
  ): Promise<PaginatedResponse<API>> {
    const response = (await apiClient.get<API[]>(API_ENDPOINTS.APIS.LIST, {
      ...config,
      params: {
        page: 1,
        page_size: 20,
        ...params,
      },
    })) as PaginatedResponse<API>

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch APIs')
    }

    return response
  }

  static async get(id: string, config?: RequestConfig): Promise<API> {
    const response = await apiClient.get<API>(API_ENDPOINTS.APIS.DETAIL(id), config)

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch API details')
    }

    return response.data
  }

  static async create(data: CreateAPIData): Promise<API> {
    const response = await apiClient.post<API>(API_ENDPOINTS.APIS.CREATE, data)

    if (!response.success) {
      throw new Error(response.message || 'Failed to create API')
    }

    return response.data
  }

  static async update(id: string, data: UpdateAPIData): Promise<API> {
    const response = await apiClient.patch<API>(API_ENDPOINTS.APIS.UPDATE(id), data)

    if (!response.success) {
      throw new Error(response.message || 'Failed to update API')
    }

    return response.data
  }

  static async delete(id: string): Promise<void> {
    const response = await apiClient.delete(API_ENDPOINTS.APIS.DELETE(id))

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete API')
    }
  }

  static async getAPIs(params?: APIListParams): Promise<PaginatedResponse<API>> {
    return this.list({
      ...params,
      status: 'published',
      is_public: true,
    })
  }

  static async getMarketAPIs(params?: APIListParams): Promise<PaginatedResponse<API>> {
    return this.list({
      ...params,
      status: 'published',
      is_public: true,
    })
  }

  static async getUserAPIs(
    userId: string,
    params?: APIListParams
  ): Promise<PaginatedResponse<API>> {
    return this.list({
      ...params,
      owner_id: userId,
    })
  }

  static async searchAPIs(
    query: string,
    params?: Omit<APIListParams, 'search'>
  ): Promise<PaginatedResponse<API>> {
    return this.list({
      ...params,
      search: query,
    })
  }

  static async getAPIsByCategory(
    category: string,
    params?: Omit<APIListParams, 'category'>
  ): Promise<PaginatedResponse<API>> {
    return this.list({
      ...params,
      category,
    })
  }

  static async getPopularAPIs(params?: APIListParams): Promise<PaginatedResponse<API>> {
    return this.list({
      ...params,
      sort_by: 'total_calls',
      sort_order: 'desc',
    })
  }

  static async getLatestAPIs(params?: APIListParams): Promise<PaginatedResponse<API>> {
    return this.list({
      ...params,
      sort_by: 'created_at',
      sort_order: 'desc',
    })
  }

  static async getMarketAPIDetailBySlug(
    slug: string
  ): Promise<{ success: boolean; data: API; message?: string }> {
    try {
      // 搜索匹配的 API
      const response = await this.getMarketAPIs({
        search: slug,
        page: 1,
        page_size: 100,
      })

      const targetApi = response.data.find((api) => api.slug === slug)

      if (!targetApi) {
        // 如果搜索没找到，尝试获取更多数据
        let currentPage = 1
        const maxPages = 5

        while (currentPage <= maxPages) {
          const listResponse = await this.getMarketAPIs({
            page: currentPage,
            page_size: 50,
          })

          const foundApi = listResponse.data.find((api) => api.slug === slug)
          if (foundApi) {
            return {
              success: true,
              data: foundApi,
              message: 'API详情获取成功',
            }
          }

          if (!listResponse.pagination.has_next) break
          currentPage++
        }

        throw new Error('未找到对应的API')
      }

      return {
        success: true,
        data: targetApi,
        message: 'API详情获取成功',
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取API详情失败，请稍后重试'
      throw new Error(errorMessage)
    }
  }
}

export default APIService
