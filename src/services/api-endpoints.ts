// API端点管理服务
import apiClient from './api-client'

// 端点对象接口
export interface APIEndpoint {
  id: string
  api_id: string
  name: string
  description: string
  path: string
  method: string
  endpoint_type: 'rest' | 'graphql'
  headers: Record<string, any>
  query_params: Record<string, any>
  body_params: Record<string, any>
  response_body: Record<string, any>
  graphql_query?: string
  graphql_variables?: Record<string, any>
  graphql_operation_name?: string
  graphql_schema?: string
  price_per_call: number
  total_calls: number
  avg_response_time: number
  success_rate: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// 端点列表响应接口
export interface APIEndpointsResponse {
  success: boolean
  code: string
  message: string
  data: APIEndpoint[]
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

// 单个端点响应接口
export interface APIEndpointResponse {
  success: boolean
  code: string
  message: string
  data: APIEndpoint
}

// 获取端点列表参数
export interface GetEndpointsParams {
  page?: number
  page_size?: number
  is_active?: boolean
}

// 发布端点请求参数
export interface PublishEndpointRequest {
  name: string
  description: string
  path: string
  method: string
  endpoint_type: 'rest' | 'graphql'
  headers?: Record<string, any>
  query_params?: Record<string, any>
  body_params?: Record<string, any>
  response_body?: Record<string, any>
  graphql_query?: string
  graphql_variables?: Record<string, any>
  graphql_operation_name?: string
  graphql_schema?: string
  price_per_call?: number
}

// 更新端点请求参数
export interface UpdateEndpointRequest {
  name?: string
  description?: string
  path?: string
  method?: string
  endpoint_type?: 'rest' | 'graphql'
  headers?: Record<string, any>
  query_params?: Record<string, any>
  body_params?: Record<string, any>
  response_body?: Record<string, any>
  graphql_query?: string
  graphql_variables?: Record<string, any>
  graphql_operation_name?: string
  graphql_schema?: string
  price_per_call?: number
  is_active?: boolean
}

/**
 * 获取API端点列表
 */
export const getAPIEndpoints = async (
  apiId: string, 
  params?: GetEndpointsParams
): Promise<APIEndpointsResponse> => {
  try {
    console.log('🔄 [api-endpoints] 开始获取API端点列表:', apiId)
    console.log('📤 [api-endpoints] 请求参数:', JSON.stringify(params, null, 2))
    
    const finalParams = {
      page: 1,
      page_size: 50,
      ...params,
    }
    
    const startTime = Date.now()
    const response = await apiClient.get<APIEndpointsResponse>(`/api/v1/apis/${apiId}/endpoints`, {
      params: finalParams
    })
    const endTime = Date.now()
    
    console.log('✅ [api-endpoints] 端点列表获取成功')
    console.log('📥 [api-endpoints] 响应状态:', response.status)
    console.log('📥 [api-endpoints] 端点数量:', response.data.data?.length || 0)
    console.log('⏱️ [api-endpoints] API调用耗时:', `${endTime - startTime}ms`)
    
    return response.data
  } catch (error: unknown) {
    console.group('❌ [api-endpoints] 获取端点列表失败')
    console.error('完整错误对象:', error)
    
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } }
      console.error('📥 [api-endpoints] HTTP响应错误:')
      console.error('  状态码:', axiosError.response?.status)
      console.error('  响应数据:', axiosError.response?.data)
    }
    
    console.groupEnd()
    const errorMessage = error instanceof Error && 'response' in error 
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined
    throw new Error(errorMessage || '获取端点列表失败，请稍后重试')
  }
}

/**
 * 发布API端点
 */
export const publishAPIEndpoint = async (
  apiId: string, 
  data: PublishEndpointRequest
): Promise<APIEndpointResponse> => {
  try {
    console.log('➕ [api-endpoints] 开始发布API端点:', apiId)
    console.log('📤 [api-endpoints] 发布数据:', JSON.stringify(data, null, 2))
    
    const response = await apiClient.post<APIEndpointResponse>(`/api/v1/apis/${apiId}/endpoints`, data)
    
    console.log('✅ [api-endpoints] 端点发布成功')
    
    return response.data
  } catch (error: unknown) {
    console.error('❌ [api-endpoints] 发布端点失败:', error)
    const errorMessage = error instanceof Error && 'response' in error 
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined
          throw new Error(errorMessage || '发布端点失败，请稍后重试')
  }
}

/**
 * 更新API端点
 */
export const updateAPIEndpoint = async (
  apiId: string, 
  endpointId: string, 
  data: UpdateEndpointRequest
): Promise<APIEndpointResponse> => {
  try {
    console.log('🔧 [api-endpoints] 开始更新API端点:', apiId, endpointId)
    console.log('📤 [api-endpoints] 更新数据:', JSON.stringify(data, null, 2))
    
    const response = await apiClient.patch<APIEndpointResponse>(`/api/v1/apis/${apiId}/endpoints/${endpointId}`, data)
    
    console.log('✅ [api-endpoints] 端点更新成功')
    
    return response.data
  } catch (error: unknown) {
    console.error('❌ [api-endpoints] 更新端点失败:', error)
    const errorMessage = error instanceof Error && 'response' in error 
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined
    throw new Error(errorMessage || '更新端点失败，请稍后重试')
  }
}

/**
 * 删除API端点
 */
export const deleteAPIEndpoint = async (
  apiId: string, 
  endpointId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('🗑️ [api-endpoints] 开始删除API端点:', apiId, endpointId)
    
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/api/v1/apis/${apiId}/endpoints/${endpointId}`)
    
    console.log('✅ [api-endpoints] 端点删除成功')
    
    return response.data
  } catch (error: unknown) {
    console.error('❌ [api-endpoints] 删除端点失败:', error)
    const errorMessage = error instanceof Error && 'response' in error 
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined
    throw new Error(errorMessage || '删除端点失败，请稍后重试')
  }
}
