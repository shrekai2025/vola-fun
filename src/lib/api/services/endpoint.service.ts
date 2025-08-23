import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import { PaginatedResponse, RequestConfig } from '../types'

export interface APIEndpoint {
  id: string
  api_id: string
  name: string
  description: string
  path: string
  method: string
  endpoint_type: 'rest' | 'graphql'
  headers: Record<string, unknown>
  query_params: Record<string, unknown>
  body_params: Record<string, unknown>
  response_body: Record<string, unknown>
  graphql_query?: string
  graphql_variables?: Record<string, unknown>
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

export interface EndpointListParams {
  page?: number
  page_size?: number
  is_active?: boolean
}

export interface CreateEndpointData {
  name: string
  description: string
  path: string
  method: string
  endpoint_type: 'rest' | 'graphql'
  headers?: Record<string, unknown>
  query_params?: Record<string, unknown>
  body_params?: Record<string, unknown>
  response_body?: Record<string, unknown>
  graphql_query?: string
  graphql_variables?: Record<string, unknown>
  graphql_operation_name?: string
  graphql_schema?: string
  price_per_call?: number
}

export interface UpdateEndpointData extends Partial<CreateEndpointData> {
  is_active?: boolean
}

export class EndpointService {
  static async list(
    apiId: string,
    params?: EndpointListParams,
    config?: RequestConfig
  ): Promise<PaginatedResponse<APIEndpoint>> {
    const response = (await apiClient.get<APIEndpoint[]>(API_ENDPOINTS.APIS.ENDPOINTS.LIST(apiId), {
      ...config,
      params: {
        page: 1,
        page_size: 50,
        ...params,
      },
    })) as PaginatedResponse<APIEndpoint>

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch endpoints')
    }

    return response
  }

  static async get(
    apiId: string,
    endpointId: string,
    config?: RequestConfig
  ): Promise<APIEndpoint> {
    const response = await apiClient.get<APIEndpoint>(
      API_ENDPOINTS.APIS.ENDPOINTS.DETAIL(apiId, endpointId),
      config
    )

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch endpoint details')
    }

    return response.data
  }

  static async create(apiId: string, data: CreateEndpointData): Promise<APIEndpoint> {
    const response = await apiClient.post<APIEndpoint>(
      API_ENDPOINTS.APIS.ENDPOINTS.CREATE(apiId),
      data
    )

    if (!response.success) {
      throw new Error(response.message || 'Failed to create endpoint')
    }

    return response.data
  }

  static async update(
    apiId: string,
    endpointId: string,
    data: UpdateEndpointData
  ): Promise<APIEndpoint> {
    const response = await apiClient.patch<APIEndpoint>(
      API_ENDPOINTS.APIS.ENDPOINTS.UPDATE(apiId, endpointId),
      data
    )

    if (!response.success) {
      throw new Error(response.message || 'Failed to update endpoint')
    }

    return response.data
  }

  static async delete(apiId: string, endpointId: string): Promise<void> {
    const response = await apiClient.delete(API_ENDPOINTS.APIS.ENDPOINTS.DELETE(apiId, endpointId))

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete endpoint')
    }
  }
}

export default EndpointService
