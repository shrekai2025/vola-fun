import type {
  API,
  ApiResponse,
  CreateFavoriteData,
  Favorite,
  FavoriteCheckItem,
  FavoriteListParams,
  FavoriteStats,
  Node,
  PaginatedResponse,
} from '@/types/api'
import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'

export type { CreateFavoriteData, Favorite, FavoriteCheckItem, FavoriteListParams, FavoriteStats }

export class FavoriteService {
  /**
   * 添加收藏
   */
  static async create(data: CreateFavoriteData): Promise<ApiResponse<Favorite>> {
    const response = await apiClient.post<Favorite>(API_ENDPOINTS.FAVORITES.CREATE, data)
    return response
  }

  /**
   * 获取收藏列表
   */
  static async list(params?: FavoriteListParams): Promise<PaginatedResponse<Favorite>> {
    const response = (await apiClient.get<Favorite[]>(API_ENDPOINTS.FAVORITES.LIST, {
      params: {
        page: 1,
        page_size: 20,
        ...params,
      },
    })) as PaginatedResponse<Favorite>

    return response
  }

  /**
   * 获取API收藏列表
   */
  static async getAPIFavorites(
    params?: Omit<FavoriteListParams, 'resource_type'>
  ): Promise<PaginatedResponse<API>> {
    const response = (await apiClient.get<API[]>(API_ENDPOINTS.FAVORITES.APIS, {
      params: {
        page: 1,
        page_size: 20,
        ...params,
      },
    })) as PaginatedResponse<API>

    return response
  }

  /**
   * 获取节点收藏列表
   */
  static async getNodeFavorites(
    params?: Omit<FavoriteListParams, 'resource_type'>
  ): Promise<PaginatedResponse<Node>> {
    const response = (await apiClient.get<Node[]>(API_ENDPOINTS.FAVORITES.NODES, {
      params: {
        page: 1,
        page_size: 20,
        ...params,
      },
    })) as PaginatedResponse<Node>

    return response
  }

  /**
   * 取消收藏（通过收藏ID）
   */
  static async delete(favoriteId: string): Promise<ApiResponse<null>> {
    const response = (await apiClient.delete(
      API_ENDPOINTS.FAVORITES.DELETE(favoriteId)
    )) as ApiResponse<null>
    return response
  }

  /**
   * 获取收藏统计
   */
  static async getStats(): Promise<ApiResponse<FavoriteStats>> {
    const response = await apiClient.get<FavoriteStats>(API_ENDPOINTS.FAVORITES.STATS)
    return response
  }

  /**
   * 批量检查收藏状态
   */
  static async checkFavoriteStatus(
    resourceIds: string[]
  ): Promise<ApiResponse<FavoriteCheckItem[]>> {
    const response = await apiClient.get<FavoriteCheckItem[]>(API_ENDPOINTS.FAVORITES.CHECK, {
      params: {
        resource_ids: resourceIds.join(','),
      },
    })
    return response
  }

  /**
   * 检查单个资源是否已收藏
   */
  static async isFavorite(resourceId: string): Promise<boolean> {
    try {
      const response = await this.checkFavoriteStatus([resourceId])
      return response.data[0]?.is_favorite || false
    } catch {
      return false
    }
  }

  /**
   * 切换收藏状态（收藏/取消收藏）
   */
  static async toggleFavorite(
    resourceType: 'api' | 'node',
    resourceId: string
  ): Promise<ApiResponse<Favorite | null>> {
    const isFavorited = await this.isFavorite(resourceId)

    if (isFavorited) {
      // 需要先找到收藏ID，然后删除
      const favorites = await this.list({ resource_type: resourceType })
      const favorite = favorites.data.find((f) => f.resource_id === resourceId)

      if (favorite) {
        await this.delete(favorite.id)
        return {
          success: true,
          code: 'SUCCESS',
          message: '取消收藏成功',
          data: null,
        }
      }
    } else {
      // 添加收藏
      return this.create({ resource_type: resourceType, resource_id: resourceId })
    }

    throw new Error('操作失败')
  }
}

export default FavoriteService
