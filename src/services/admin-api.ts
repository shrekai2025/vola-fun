import apiClient from './api-client'

// API创建数据类型
export interface CreateAPIRequest {
  name: string
  slug: string
  short_description: string
  long_description?: string
  category: 'data' | 'ai_ml' | 'finance' | 'social' | 'tools' | 'communication' | 'entertainment' | 'business' | 'other'
  tags: string[]
  base_url: string
  health_check_url?: string
  is_public: boolean
  website_url?: string
  documentation_url?: string
  terms_url?: string
  gateway_key?: string
  documentation_markdown?: string
}

export interface CreateAPIResponse {
  success: boolean
  code: string
  message: string
  data: {
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
    status: string
    is_public: boolean
    website_url?: string
    gateway_key?: string
    documentation_url?: string
    terms_url?: string
    documentation_markdown?: string
    total_calls: number
    total_revenue: number
    rating?: number
    owner_id: string
    created_at: string
    updated_at: string
  }
}

/**
 * 创建新的API服务
 */
export const createAPI = async (data: CreateAPIRequest): Promise<CreateAPIResponse> => {
  try {
    const response = await apiClient.post<CreateAPIResponse>('/api/v1/apis', data)
    return response.data
  } catch (error: any) {
    // 处理特定的API错误
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error.response?.status === 409) {
      throw new Error('API标识已存在，请选择其他标识')
    } else if (error.response?.status === 400) {
      throw new Error('请求参数有误，请检查输入内容')
    } else if (error.response?.status === 403) {
      throw new Error('权限不足，无法创建API')
    }
    
    throw new Error('创建API失败，请稍后重试')
  }
}

/**
 * 获取API列表（管理员视图）
 */
export const getAPIs = async (params?: {
  page?: number
  limit?: number
  category?: string
  status?: string
  search?: string
}) => {
  try {
    const response = await apiClient.get('/api/v1/apis', { params })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取API列表失败')
  }
}

/**
 * 获取单个API详情（管理员视图）
 */
export const getAPI = async (id: string) => {
  try {
    const response = await apiClient.get(`/api/v1/apis/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '获取API详情失败')
  }
}

/**
 * 更新API信息
 */
export const updateAPI = async (id: string, data: Partial<CreateAPIRequest>) => {
  try {
    const response = await apiClient.put(`/api/v1/apis/${id}`, data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '更新API失败')
  }
}

/**
 * 删除API
 */
export const deleteAPI = async (id: string) => {
  try {
    const response = await apiClient.delete(`/api/v1/apis/${id}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '删除API失败')
  }
}

/**
 * 更改API状态（启用/禁用）
 */
export const updateAPIStatus = async (id: string, status: 'active' | 'inactive' | 'draft') => {
  try {
    const response = await apiClient.patch(`/api/v1/apis/${id}/status`, { status })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || '更新API状态失败')
  }
}
