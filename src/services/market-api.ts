import apiClient from './api-client'

// 市场API数据类型
export interface MarketAPI {
  id: string
  name: string
  slug: string
  short_description: string
  category: string
  avatar_url?: string
  base_url: string
  health_check_url?: string
  status: string
  is_public: boolean
  website_url?: string
  documentation_url?: string
  terms_url?: string
  documentation_markdown?: string
  total_calls: number
  total_revenue: number
  rating?: number
  owner_id: string
  created_at: string
  updated_at: string
  tags?: string[]
}

// 分页信息
export interface Pagination {
  page: number
  page_size: number
  total: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

// API列表响应
export interface MarketAPIListResponse {
  success: boolean
  code: string
  message: string
  data: MarketAPI[]
  pagination: Pagination
}

// 获取API列表的参数
export interface GetMarketAPIsParams {
  page?: number
  page_size?: number
  category?: string
  status?: string
  is_public?: boolean
  search?: string
  owner_id?: string
  tags?: string[]
  sort_by?: 'total_calls' | 'rating' | 'created_at'
  sort_order?: 'asc' | 'desc'
  signal?: AbortSignal
}

/**
 * 获取市场API列表
 */
export const getMarketAPIs = async (params?: GetMarketAPIsParams): Promise<MarketAPIListResponse> => {
  try {
    // 提取 signal 和其他参数
    const { signal, ...requestParams } = params || {}
    
    // 设置默认参数
    const finalParams = {
      page: 1,
      page_size: 50,
      status: 'published', // 只显示已发布的API
      is_public: true, // 只显示公开的API
      sort_by: 'total_calls',
      sort_order: 'desc',
      ...requestParams,
    }

    const response = await apiClient.get<MarketAPIListResponse>('/api/v1/apis', { 
      params: finalParams,
      signal
    })
    
    return response.data
  } catch (error: any) {
    console.error('获取市场API列表失败:', error)
    throw new Error(error.response?.data?.message || '获取API列表失败，请稍后重试')
  }
}

/**
 * 搜索API
 */
export const searchMarketAPIs = async (
  searchTerm: string, 
  params?: Omit<GetMarketAPIsParams, 'search'>
): Promise<MarketAPIListResponse> => {
  return getMarketAPIs({
    ...params,
    search: searchTerm,
  })
}

/**
 * 按分类获取API
 */
export const getMarketAPIsByCategory = async (
  category: string,
  params?: Omit<GetMarketAPIsParams, 'category'>
): Promise<MarketAPIListResponse> => {
  return getMarketAPIs({
    ...params,
    category,
  })
}

/**
 * 按标签获取API
 */
export const getMarketAPIsByTags = async (
  tags: string[],
  params?: Omit<GetMarketAPIsParams, 'tags'>
): Promise<MarketAPIListResponse> => {
  return getMarketAPIs({
    ...params,
    tags,
  })
}

/**
 * 获取热门API (按调用次数排序)
 */
export const getPopularAPIs = async (
  params?: GetMarketAPIsParams
): Promise<MarketAPIListResponse> => {
  return getMarketAPIs({
    ...params,
    sort_by: 'total_calls',
    sort_order: 'desc',
  })
}

/**
 * 获取最新API (按创建时间排序)
 */
export const getLatestAPIs = async (
  params?: GetMarketAPIsParams
): Promise<MarketAPIListResponse> => {
  return getMarketAPIs({
    ...params,
    sort_by: 'created_at',
    sort_order: 'desc',
  })
}

/**
 * 获取评分最高的API
 */
export const getTopRatedAPIs = async (
  params?: GetMarketAPIsParams
): Promise<MarketAPIListResponse> => {
  return getMarketAPIs({
    ...params,
    sort_by: 'rating',
    sort_order: 'desc',
  })
}
