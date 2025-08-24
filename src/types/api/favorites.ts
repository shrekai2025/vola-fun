/**
 * 收藏相关类型定义
 */

export interface Favorite {
  id: string
  user_id: string
  resource_type: 'api' | 'node'
  resource_id: string
  created_at: string
}

export interface FavoriteListParams {
  page?: number
  page_size?: number
  resource_type?: 'api' | 'node'
}

export interface CreateFavoriteData {
  resource_type: 'api' | 'node'
  resource_id: string
}

export interface FavoriteStats {
  total_favorites: number
  api_favorites: number
  node_favorites: number
}

export interface FavoriteCheckItem {
  resource_id: string
  is_favorite: boolean
}
