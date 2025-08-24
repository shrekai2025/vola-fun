/**
 * API市场相关类型定义
 */

import type { BaseQueryParams, ParamConfig } from './common'

// API所有者信息
export interface APIOwner {
  username: string
  full_name: string
  avatar_url: string | null
}

// API状态类型
export type APIStatus = 'draft' | 'published' | 'deprecated' | 'suspended'

// API类别类型
export type APICategory =
  | 'data'
  | 'ai_ml'
  | 'finance'
  | 'social'
  | 'tools'
  | 'communication'
  | 'entertainment'
  | 'business'
  | 'other'

// 端点类型
export type EndpointType = 'rest' | 'graphql'

// HTTP方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// API基础信息
export interface API {
  id: string
  name: string
  slug: string
  short_description: string
  long_description?: string
  category: APICategory
  avatar_url: string | null
  base_url: string
  health_check_url: string | null
  status: APIStatus
  is_public: boolean
  website_url: string | null
  documentation_url: string | null
  terms_url: string | null
  documentation_markdown: string | null
  tags?: string[]
  total_calls: number
  total_revenue: number
  rating: number | null
  owner_id: string
  owner?: APIOwner
  estimated_response_time: number
  is_favorited?: boolean
  created_at: string
  updated_at: string
}

// API创建数据
export interface CreateAPIData {
  name: string
  slug: string
  short_description: string
  long_description?: string
  category: APICategory
  tags?: string[]
  base_url: string
  health_check_url?: string
  gateway_key?: string
  is_public?: boolean
  estimated_response_time?: number
  website_url?: string
  documentation_url?: string
  terms_url?: string
  documentation_markdown?: string
}

// API更新数据
export interface UpdateAPIData extends Partial<CreateAPIData> {
  status?: APIStatus
}

// API列表查询参数
export interface APIListParams extends BaseQueryParams {
  category?: APICategory
  status?: APIStatus
  is_public?: boolean
  owner_id?: string
  tags?: string[]
  sort_by?: 'total_calls' | 'rating' | 'created_at'
  sort_order?: 'asc' | 'desc'
}

// API端点参数配置
export type EndpointParamConfig = ParamConfig

// 媒体类型配置
export interface MediaTypeConfig {
  media_type: string
  schema_definition: Record<string, unknown>
}

// API端点
export interface APIEndpoint {
  id: string
  api_id: string
  name: string
  description: string
  path: string
  method: HttpMethod
  endpoint_type: EndpointType
  headers: Record<string, EndpointParamConfig>
  query_params: Record<string, EndpointParamConfig>
  body_params: Record<string, MediaTypeConfig>
  response_params: Record<string, Omit<EndpointParamConfig, 'name'>>
  graphql_query?: string | null
  graphql_variables?: Record<string, unknown>
  graphql_operation_name?: string | null
  graphql_schema?: string | null
  price_per_call: number
  total_calls: number
  avg_response_time: number
  success_rate: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// 端点创建数据
export interface CreateEndpointData {
  name: string
  description: string
  path: string
  method: HttpMethod
  endpoint_type: EndpointType
  headers?: Record<string, EndpointParamConfig>
  query_params?: Record<string, EndpointParamConfig>
  body_params?: Record<string, MediaTypeConfig>
  response_params?: Record<string, Omit<EndpointParamConfig, 'name'>>
  graphql_query?: string
  graphql_variables?: Record<string, unknown>
  graphql_operation_name?: string
  graphql_schema?: string
  price_per_call: number
  estimated_response_time?: number
  is_active?: boolean
}

// 端点更新数据
export type UpdateEndpointData = Partial<CreateEndpointData>

// 端点列表查询参数
export interface EndpointListParams extends BaseQueryParams {
  is_active?: boolean
}

// API调用请求
export interface APICallRequest {
  apiId: string
  endpointId: string
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  body?: Record<string, unknown> | string
}

// API调用响应
export interface APICallResponse {
  success: boolean
  data?: unknown
  error?: string
  credits_used: number
  response_time: number
}

// API统计信息
export interface APIStatistics {
  total_calls: number
  total_revenue: number
  avg_response_time: number
  success_rate: number
  top_endpoints: {
    endpoint_id: string
    endpoint_name: string
    calls: number
  }[]
}
