import apiClient from './api-client'

// API发布数据类型
export interface PublishAPIRequest {
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

export interface PublishAPIResponse {
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

// API列表项数据类型
export interface AdminAPI {
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
  status: 'draft' | 'published' | 'deprecated'
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
  owner?: {
    id: string
    username: string
    email: string
    full_name?: string
    avatar_url?: string
  }
  created_at: string
  updated_at: string
}

// 获取API列表的参数
export interface GetAdminAPIsParams {
  page?: number
  page_size?: number
  status?: 'draft' | 'published' | 'deprecated'
  category?: string
  search?: string
  owner_id?: string
}

// API列表响应类型
export interface AdminAPIListResponse {
  success: boolean
  code: string
  message: string
  data: AdminAPI[]
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

// 更新API数据类型
export interface UpdateAPIRequest {
  short_description?: string
  long_description?: string
  category?: string
  tags?: string[]
  is_public?: boolean
  status?: 'draft' | 'published' | 'deprecated'
}

// 更新API响应类型
export interface UpdateAPIResponse {
  success: boolean
  code: string
  message: string
  data: AdminAPI
}

/**
 * 发布新的API服务
 */
export const publishAPI = async (data: PublishAPIRequest): Promise<PublishAPIResponse> => {
  try {
    console.log('🔄 [admin-api] 开始调用发布API接口')
    console.log('📤 [admin-api] 请求URL: /api/v1/apis/ (添加尾部斜杠避免重定向)')
    console.log('📤 [admin-api] 请求方法: POST')
    console.log('📤 [admin-api] 请求数据:', JSON.stringify(data, null, 2))
    
    const startTime = Date.now()
    const response = await apiClient.post<CreateAPIResponse>('/api/v1/apis/', data)
    const endTime = Date.now()
    
    console.log('✅ [admin-api] API发布请求成功')
    console.log('📥 [admin-api] 响应状态:', response.status)
    console.log('📥 [admin-api] 响应头:', response.headers)
    console.log('📥 [admin-api] 响应数据:', JSON.stringify(response.data, null, 2))
    console.log('⏱️ [admin-api] API调用耗时:', `${endTime - startTime}ms`)
    
    return response.data
  } catch (error: any) {
    console.group('❌ [admin-api] API发布请求失败')
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
      throw new Error('权限不足，无法发布API')
    }
    
          throw new Error('发布API失败，请稍后重试')
  }
}

/**
 * 获取管理员API列表（可筛选状态）
 */
export const getAdminAPIs = async (params?: GetAdminAPIsParams): Promise<AdminAPIListResponse> => {
  try {
    console.log('🔄 [admin-api] 开始获取管理员API列表')
    console.log('📤 [admin-api] 请求参数:', JSON.stringify(params, null, 2))
    
    // 设置默认参数
    const finalParams = {
      page: 1,
      page_size: 20,
      ...params,
    }
    
    const startTime = Date.now()
    const response = await apiClient.get<AdminAPIListResponse>('/api/v1/apis/', { 
      params: finalParams
    })
    const endTime = Date.now()
    
    console.log('✅ [admin-api] API列表获取成功')
    console.log('📥 [admin-api] 响应状态:', response.status)
    console.log('📥 [admin-api] 响应数据:', JSON.stringify(response.data, null, 2))
    console.log('⏱️ [admin-api] API调用耗时:', `${endTime - startTime}ms`)
    
    return response.data
  } catch (error: any) {
    console.group('❌ [admin-api] API列表获取失败')
    console.error('完整错误对象:', error)
    
    if (error.response) {
      console.error('📥 [admin-api] HTTP响应错误:')
      console.error('  状态码:', error.response.status)
      console.error('  响应数据:', error.response.data)
    }
    
    console.groupEnd()
    throw new Error(error.response?.data?.message || '获取API列表失败，请稍后重试')
  }
}

/**
 * 更新API状态和信息
 */
export const updateAPI = async (apiId: string, data: UpdateAPIRequest): Promise<UpdateAPIResponse> => {
  try {
    console.log('🔄 [admin-api] 开始更新API')
    console.log('📤 [admin-api] API ID:', apiId)
    console.log('📤 [admin-api] 更新数据:', JSON.stringify(data, null, 2))
    
    const startTime = Date.now()
    const response = await apiClient.patch<UpdateAPIResponse>(`/api/v1/apis/${apiId}`, data)
    const endTime = Date.now()
    
    console.log('✅ [admin-api] API更新成功')
    console.log('📥 [admin-api] 响应状态:', response.status)
    console.log('📥 [admin-api] 响应数据:', JSON.stringify(response.data, null, 2))
    console.log('⏱️ [admin-api] API调用耗时:', `${endTime - startTime}ms`)
    
    return response.data
  } catch (error: any) {
    console.group('❌ [admin-api] API更新失败')
    console.error('完整错误对象:', error)
    
    if (error.response) {
      console.error('📥 [admin-api] HTTP响应错误:')
      console.error('  状态码:', error.response.status)
      console.error('  响应数据:', error.response.data)
    }
    
    console.groupEnd()
    
    // 处理特定的API错误
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    } else if (error.response?.status === 404) {
      throw new Error('API不存在或已被删除')
    } else if (error.response?.status === 403) {
      throw new Error('权限不足，无法更新此API')
    } else if (error.response?.status === 400) {
      throw new Error('请求参数有误，请检查输入内容')
    }
    
    throw new Error('更新API失败，请稍后重试')
  }
}

/**
 * 审核通过API（将状态从draft改为published）
 */
export const approveAPI = async (apiId: string): Promise<UpdateAPIResponse> => {
  return updateAPI(apiId, { status: 'published' })
}


