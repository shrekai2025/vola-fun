import type {
  ApiResponse,
  CreateNodeData,
  CreateNodeVersionData,
  Node,
  NodeListParams,
  NodePurchase,
  NodeVersion,
  PaginatedResponse,
  UpdateNodeData,
} from '@/types/api'
import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'

export type {
  CreateNodeData,
  CreateNodeVersionData,
  Node,
  NodeListParams,
  NodePurchase,
  NodeVersion,
  UpdateNodeData,
}

export class NodeService {
  /**
   * 获取节点列表
   */
  static async list(params?: NodeListParams): Promise<PaginatedResponse<Node>> {
    const processedParams: Record<string, string | number | boolean> = {
      page: 1,
      page_size: 20,
    }

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            processedParams[key] = value.join(',')
          } else {
            processedParams[key] = value
          }
        }
      })
    }

    const response = (await apiClient.get<Node[]>(API_ENDPOINTS.NODES.LIST, {
      params: processedParams,
    })) as PaginatedResponse<Node>

    return response
  }

  /**
   * 获取节点详情
   */
  static async get(nodeId: string): Promise<ApiResponse<Node>> {
    const response = await apiClient.get<Node>(API_ENDPOINTS.NODES.DETAIL(nodeId))
    return response
  }

  /**
   * 创建节点
   */
  static async create(data: CreateNodeData): Promise<ApiResponse<Node>> {
    const response = await apiClient.post<Node>(API_ENDPOINTS.NODES.CREATE, data)
    return response
  }

  /**
   * 更新节点
   */
  static async update(nodeId: string, data: UpdateNodeData): Promise<ApiResponse<Node>> {
    const response = await apiClient.patch<Node>(API_ENDPOINTS.NODES.UPDATE(nodeId), data)
    return response
  }

  /**
   * 删除节点
   */
  static async delete(nodeId: string): Promise<ApiResponse<null>> {
    const response = (await apiClient.delete(
      API_ENDPOINTS.NODES.DELETE(nodeId)
    )) as ApiResponse<null>
    return response
  }

  /**
   * 上传节点头像
   */
  static async uploadAvatar(
    nodeId: string,
    avatar: File
  ): Promise<ApiResponse<{ avatar_url: string }>> {
    const formData = new FormData()
    formData.append('avatar', avatar)

    const response = await apiClient.post<{ avatar_url: string }>(
      API_ENDPOINTS.NODES.UPLOAD_AVATAR(nodeId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response
  }

  /**
   * 购买节点
   */
  static async purchase(nodeId: string): Promise<ApiResponse<NodePurchase>> {
    const response = await apiClient.post<NodePurchase>(API_ENDPOINTS.NODES.PURCHASE(nodeId))
    return response
  }

  /**
   * 下载已购买的节点
   */
  static async download(
    nodeId: string
  ): Promise<ApiResponse<{ download_url: string; expires_at: string }>> {
    const response = await apiClient.get<{ download_url: string; expires_at: string }>(
      API_ENDPOINTS.NODES.DOWNLOAD(nodeId)
    )
    return response
  }

  /**
   * 获取我的节点购买记录
   */
  static async getMyPurchases(params?: {
    page?: number
    page_size?: number
  }): Promise<PaginatedResponse<NodePurchase>> {
    const response = (await apiClient.get<NodePurchase[]>(API_ENDPOINTS.NODES.MY_PURCHASES, {
      params: {
        page: 1,
        page_size: 20,
        ...params,
      },
    })) as PaginatedResponse<NodePurchase>

    return response
  }

  /**
   * 获取节点版本历史
   */
  static async getVersions(nodeId: string): Promise<ApiResponse<NodeVersion[]>> {
    const response = await apiClient.get<NodeVersion[]>(API_ENDPOINTS.NODES.VERSIONS.LIST(nodeId))
    return response
  }

  /**
   * 创建节点版本
   */
  static async createVersion(
    nodeId: string,
    data: CreateNodeVersionData
  ): Promise<ApiResponse<NodeVersion>> {
    const formData = new FormData()
    formData.append('version', data.version)
    if (data.changelog) {
      formData.append('changelog', data.changelog)
    }
    formData.append('file', data.file)

    const response = await apiClient.post<NodeVersion>(
      API_ENDPOINTS.NODES.VERSIONS.CREATE(nodeId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response
  }

  /**
   * 获取市场节点列表（公开且已发布）
   */
  static async getMarketNodes(params?: NodeListParams): Promise<PaginatedResponse<Node>> {
    return this.list({
      ...params,
      status: 'published',
      is_public: true,
    })
  }

  /**
   * 获取用户的节点列表
   */
  static async getUserNodes(
    userId?: string,
    params?: NodeListParams
  ): Promise<PaginatedResponse<Node>> {
    return this.list({
      ...params,
      owner_id: userId,
    })
  }

  /**
   * 搜索节点
   */
  static async searchNodes(
    query: string,
    params?: Omit<NodeListParams, 'search'>
  ): Promise<PaginatedResponse<Node>> {
    return this.list({
      ...params,
      search: query,
      status: 'published',
      is_public: true,
    })
  }

  /**
   * 根据分类获取节点
   */
  static async getNodesByCategory(
    category: string,
    params?: Omit<NodeListParams, 'category'>
  ): Promise<PaginatedResponse<Node>> {
    return this.list({
      ...params,
      category,
      status: 'published',
      is_public: true,
    })
  }

  /**
   * 获取热门节点
   */
  static async getPopularNodes(params?: NodeListParams): Promise<PaginatedResponse<Node>> {
    return this.list({
      ...params,
      sort_by: 'total_downloads',
      sort_order: 'desc',
      status: 'published',
      is_public: true,
    })
  }

  /**
   * 获取最新节点
   */
  static async getLatestNodes(params?: NodeListParams): Promise<PaginatedResponse<Node>> {
    return this.list({
      ...params,
      sort_by: 'created_at',
      sort_order: 'desc',
      status: 'published',
      is_public: true,
    })
  }
}

export default NodeService
