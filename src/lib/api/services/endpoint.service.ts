import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'
import type {
  APIEndpoint,
  EndpointListParams,
  CreateEndpointData,
  UpdateEndpointData,
  PaginatedResponse,
  ApiResponse,
} from '@/types/api'

// 重新导出类型以保持向后兼容
export type { APIEndpoint, EndpointListParams, CreateEndpointData, UpdateEndpointData }

export class EndpointService {
  /**
   * 获取API的端点列表
   */
  static async list(
    apiId: string,
    params?: EndpointListParams
  ): Promise<PaginatedResponse<APIEndpoint>> {
    const response = (await apiClient.get<APIEndpoint[]>(API_ENDPOINTS.APIS.ENDPOINTS.LIST(apiId), {
      params: {
        page: 1,
        page_size: 50,
        ...params,
      },
    })) as PaginatedResponse<APIEndpoint>

    return response
  }

  /**
   * 获取端点详情
   */
  static async get(apiId: string, endpointId: string): Promise<ApiResponse<APIEndpoint>> {
    const response = await apiClient.get<APIEndpoint>(
      API_ENDPOINTS.APIS.ENDPOINTS.DETAIL(apiId, endpointId)
    )

    return response
  }

  /**
   * 创建端点
   */
  static async create(apiId: string, data: CreateEndpointData): Promise<ApiResponse<APIEndpoint>> {
    const response = await apiClient.post<APIEndpoint>(
      API_ENDPOINTS.APIS.ENDPOINTS.CREATE(apiId),
      data
    )

    return response
  }

  /**
   * 更新端点
   */
  static async update(
    apiId: string,
    endpointId: string,
    data: UpdateEndpointData
  ): Promise<ApiResponse<APIEndpoint>> {
    const response = await apiClient.patch<APIEndpoint>(
      API_ENDPOINTS.APIS.ENDPOINTS.UPDATE(apiId, endpointId),
      data
    )

    return response
  }

  /**
   * 删除端点
   */
  static async delete(apiId: string, endpointId: string): Promise<ApiResponse<null>> {
    const response = (await apiClient.delete(
      API_ENDPOINTS.APIS.ENDPOINTS.DELETE(apiId, endpointId)
    )) as ApiResponse<null>
    return response
  }
}

export default EndpointService
