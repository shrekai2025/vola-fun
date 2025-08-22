import apiClient from './api-client'

// 市场API数据类型
export interface MarketAPI {
  id: string
  name: string
  slug: string
  short_description: string
  long_description?: string
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
  estimated_response_time?: number
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

// 单个API详情响应
export interface MarketAPIDetailResponse {
  success: boolean
  code: string
  message: string
  data: MarketAPI
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


    const response = await apiClient.get<MarketAPIListResponse>('/api/v1/apis/', { 
      params: finalParams,
      signal
    })
    
    return response.data
  } catch (error: unknown) {
    // 如果是取消的请求，直接重新抛出原始错误
    const errorObj = error as { name?: string; code?: string; message?: string }
    if (errorObj.name === 'AbortError' || 
        errorObj.name === 'CanceledError' || 
        errorObj.code === 'ECONNABORTED' || 
        errorObj.code === 'ERR_CANCELED' ||
        errorObj.message === 'canceled') {
      throw error
    }
    
    console.error('获取市场API列表失败:', error)
    const errorMessage = error instanceof Error && 'response' in error 
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined
    throw new Error(errorMessage || '获取API列表失败，请稍后重试')
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

/**
 * 获取单个API详情（通过ID）
 */
export const getMarketAPIDetail = async (apiId: string): Promise<MarketAPIDetailResponse> => {
  try {

    const response = await apiClient.get<MarketAPIDetailResponse>(`/api/v1/apis/${apiId}`)
    
    return response.data
  } catch (error: unknown) {
    // 如果是取消的请求，直接重新抛出原始错误
    const errorObj = error as { name?: string; code?: string; message?: string }
    if (errorObj.name === 'AbortError' || 
        errorObj.name === 'CanceledError' || 
        errorObj.code === 'ECONNABORTED' || 
        errorObj.code === 'ERR_CANCELED' ||
        errorObj.message === 'canceled') {
      throw error
    }
    
    console.error('获取API详情失败:', error)
    const errorMessage = error instanceof Error && 'response' in error 
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined
    throw new Error(errorMessage || '获取API详情失败，请稍后重试')
  }
}

/**
 * 通过slug获取API详情
 */
export const getMarketAPIDetailBySlug = async (slug: string): Promise<MarketAPIDetailResponse> => {
  try {

    
    // 尝试通过搜索slug来找到对应的API
    const searchResponse = await getMarketAPIs({
      search: slug,
      page_size: 100, // 增加搜索范围
      page: 1
    })
    
    if (!searchResponse.success) {
      throw new Error('搜索API失败')
    }
    
    // 在搜索结果中找到完全匹配slug的API
    const targetApi = searchResponse.data.find(api => api.slug === slug)
    
    if (!targetApi) {
      // 如果搜索没找到，尝试获取更多数据进行查找

      
      let currentPage = 1
      const maxPages = 5 // 最多搜索5页，避免无限搜索
      
      while (currentPage <= maxPages) {
        const listResponse = await getMarketAPIs({
          page: currentPage,
          page_size: 50
        })
        
        if (!listResponse.success) break
        
        const foundApi = listResponse.data.find(api => api.slug === slug)
        if (foundApi) {
          // 如果找到了，直接返回该API数据（列表接口已经包含了详情数据）
          return {
            success: true,
            code: 'SUCCESS', 
            message: 'API详情获取成功',
            data: foundApi
          }
        }
        
        if (!listResponse.pagination.has_next) break
        currentPage++
      }
      
      throw new Error('未找到对应的API')
    }
    
    // 如果在搜索结果中找到了，直接返回（列表接口已经包含了详情数据）
    return {
      success: true,
      code: 'SUCCESS',
      message: 'API详情获取成功',
      data: targetApi
    }
    
  } catch (error: unknown) {
    // 如果是取消的请求，直接重新抛出原始错误
    const errorObj = error as { name?: string; code?: string; message?: string }
    if (errorObj.name === 'AbortError' || 
        errorObj.name === 'CanceledError' || 
        errorObj.code === 'ECONNABORTED' || 
        errorObj.code === 'ERR_CANCELED' ||
        errorObj.message === 'canceled') {
      throw error
    }
    
    console.error('通过slug获取API详情失败:', error)
    const errorMessage = error instanceof Error ? error.message : '获取API详情失败，请稍后重试'
    throw new Error(errorMessage)
  }
}
