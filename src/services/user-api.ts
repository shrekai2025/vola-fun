// 用户API管理服务
import apiClient from './api-client'
import type { MarketAPI, MarketAPIListResponse } from './market-api'

// 获取用户API列表的参数接口
export interface GetUserAPIsParams {
  page?: number
  page_size?: number
  status?: 'draft' | 'published' | 'deprecated' | 'suspended'
  search?: string
  category?: string
  sort_by?: 'created_at' | 'updated_at' | 'total_calls'
  sort_order?: 'asc' | 'desc'
}

// 用户API详情响应接口
export interface UserAPIDetailResponse {
  success: boolean
  message: string
  data: MarketAPI
}

// 更新用户API的请求参数接口
export interface UpdateUserAPIRequest {
  name?: string
  short_description?: string
  long_description?: string
  category?: string
  base_url?: string
  health_check_url?: string
  is_public?: boolean
  website_url?: string
  documentation_url?: string
  terms_url?: string
  tags?: string[]
  status?: 'draft' | 'published' | 'deprecated'
  documentation_markdown?: string
}

/**
 * 获取当前用户发布的API列表
 */
export const getUserAPIs = async (params?: GetUserAPIsParams): Promise<MarketAPIListResponse> => {
  try {
    console.log('🔄 [user-api] 开始获取用户API列表')
    console.log('📤 [user-api] 请求参数:', JSON.stringify(params, null, 2))
    
    // 先获取当前用户信息以得到user_id
    const userResponse = await apiClient.get('/api/v1/users/me')
    const userId = userResponse.data.data?.id
    
    if (!userId) {
      throw new Error('无法获取用户ID')
    }
    
    console.log('👤 [user-api] 获取到用户ID:', userId)
    
    // 使用owner_id参数获取API列表
    const finalParams = {
      page: 1,
      page_size: 20,
      owner_id: userId, // 使用owner_id参数过滤用户的API
      sort_by: 'created_at',
      sort_order: 'desc',
      ...params,
    }
    
    const startTime = Date.now()
    const response = await apiClient.get<MarketAPIListResponse>('/api/v1/apis/', { 
      params: finalParams
    })
    const endTime = Date.now()
    
    console.log('✅ [user-api] 用户API列表获取成功')
    console.log('📥 [user-api] 响应状态:', response.status)
    console.log('📥 [user-api] API数量:', response.data.data?.length || 0)
    console.log('⏱️ [user-api] API调用耗时:', `${endTime - startTime}ms`)
    
    return response.data
  } catch (error: unknown) {
    console.group('❌ [user-api] 用户API列表获取失败')
    console.error('完整错误对象:', error)
    
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } }
      console.error('📥 [user-api] HTTP响应错误:')
      console.error('  状态码:', axiosError.response?.status)
      console.error('  响应数据:', axiosError.response?.data)
    }
    
    console.groupEnd()
    const errorMessage = error instanceof Error && 'response' in error 
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined
    throw new Error(errorMessage || '获取用户API列表失败，请稍后重试')
  }
}



/**
 * 获取用户API详情
 */
export const getUserAPI = async (apiId: string): Promise<UserAPIDetailResponse> => {
  try {
    console.log('🔍 [user-api] 开始获取用户API详情:', apiId)
    
    const response = await apiClient.get<UserAPIDetailResponse>(`/api/v1/apis/${apiId}`)
    
    console.log('✅ [user-api] 用户API详情获取成功')
    
    return response.data
  } catch (error: unknown) {
    console.error('❌ [user-api] 获取用户API详情失败:', error)
    const errorMessage = error instanceof Error && 'response' in error 
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined
    throw new Error(errorMessage || '获取API详情失败，请稍后重试')
  }
}

/**
 * 更新用户API
 */
export const updateUserAPI = async (apiId: string, data: UpdateUserAPIRequest): Promise<UserAPIDetailResponse> => {
  try {
    console.log('🔧 [user-api] 开始更新用户API:', apiId)
    console.log('📤 [user-api] 更新数据:', JSON.stringify(data, null, 2))
    
    const response = await apiClient.patch<UserAPIDetailResponse>(`/api/v1/apis/${apiId}`, data)
    
    console.log('✅ [user-api] 用户API更新成功')
    
    return response.data
  } catch (error: unknown) {
    console.error('❌ [user-api] 更新用户API失败:', error)
    const errorMessage = error instanceof Error && 'response' in error 
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined
    throw new Error(errorMessage || '更新API失败，请稍后重试')
  }
}

/**
 * 删除用户API (软删除)
 */
export const deleteUserAPI = async (apiId: string): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🗑️ [user-api] 开始删除用户API:', apiId)
    
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/api/v1/apis/${apiId}`)
    
    console.log('✅ [user-api] 用户API删除成功')
    
    return response.data
  } catch (error: unknown) {
    console.error('❌ [user-api] 删除用户API失败:', error)
    const errorMessage = error instanceof Error && 'response' in error 
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined
    throw new Error(errorMessage || '删除API失败，请稍后重试')
  }
}

/**
 * 发布用户API (复用admin的发布逻辑，但状态默认为draft)
 */
export const publishUserAPI = async (data: any): Promise<UserAPIDetailResponse> => {
  try {
    console.log('➕ [user-api] 开始发布用户API')
    console.log('📤 [user-api] 发布数据:', JSON.stringify(data, null, 2))
    
    // 确保用户发布的API默认为草稿状态
    const createData = {
      ...data,
      status: 'draft', // 强制设置为草稿状态
      is_public: false, // 默认不公开
    }
    
    const response = await apiClient.post<UserAPIDetailResponse>('/api/v1/apis/', createData)
    
    console.log('✅ [user-api] 用户API发布成功')
    
    return response.data
  } catch (error: unknown) {
    console.error('❌ [user-api] 发布用户API失败:', error)
    const errorMessage = error instanceof Error && 'response' in error 
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined
          throw new Error(errorMessage || '发布API失败，请稍后重试')
  }
}
