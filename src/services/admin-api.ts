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
    console.log('🔄 [admin-api] 开始调用创建API接口')
    console.log('📤 [admin-api] 请求URL: /api/v1/apis')
    console.log('📤 [admin-api] 请求方法: POST')
    console.log('📤 [admin-api] 请求数据:', JSON.stringify(data, null, 2))
    
    const startTime = Date.now()
    const response = await apiClient.post<CreateAPIResponse>('/api/v1/apis', data)
    const endTime = Date.now()
    
    console.log('✅ [admin-api] API创建请求成功')
    console.log('📥 [admin-api] 响应状态:', response.status)
    console.log('📥 [admin-api] 响应头:', response.headers)
    console.log('📥 [admin-api] 响应数据:', JSON.stringify(response.data, null, 2))
    console.log('⏱️ [admin-api] API调用耗时:', `${endTime - startTime}ms`)
    
    return response.data
  } catch (error: any) {
    console.group('❌ [admin-api] API创建请求失败')
    console.error('完整错误对象:', error)
    console.error('错误类型:', error.constructor.name)
    console.error('错误消息:', error.message)
    
    if (error.response) {
      console.error('📥 [admin-api] HTTP响应错误:')
      console.error('  状态码:', error.response.status)
      console.error('  状态文本:', error.response.statusText)
      console.error('  响应头:', error.response.headers)
      console.error('  响应数据:', error.response.data)
    } else if (error.request) {
      console.error('📤 [admin-api] HTTP请求错误 (无响应):')
      console.error('  请求对象:', error.request)
      console.error('  请求状态:', error.request.readyState)
      console.error('  请求超时:', error.request.timeout)
    } else {
      console.error('⚠️ [admin-api] 请求配置错误:', error.config)
    }
    
    // 记录axios特有的错误信息
    if (error.code) {
      console.error('🔗 [admin-api] 错误代码:', error.code)
    }
    if (error.config) {
      console.error('⚙️ [admin-api] 请求配置:', {
        url: error.config.url,
        method: error.config.method,
        baseURL: error.config.baseURL,
        headers: error.config.headers,
        timeout: error.config.timeout
      })
    }
    
    console.groupEnd()
    
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
