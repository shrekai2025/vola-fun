/**
 * 节点相关类型定义
 */

export interface Node {
  id: string
  name: string
  slug: string
  description: string
  category: string
  tags: string[]
  price: number
  currency: string
  avatar_url?: string
  owner_id: string
  owner_name: string
  is_public: boolean
  status: 'draft' | 'published' | 'archived'
  total_downloads: number
  rating: number
  created_at: string
  updated_at: string
}

export interface NodeVersion {
  id: string
  node_id: string
  version: string
  changelog?: string
  file_url: string
  file_size: number
  created_at: string
}

export interface NodePurchase {
  id: string
  node_id: string
  node_name: string
  version_id: string
  version: string
  price: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  purchase_date: string
  download_url?: string
  download_expires_at?: string
}

export interface NodeListParams {
  page?: number
  page_size?: number
  category?: string
  tags?: string[]
  search?: string
  sort_by?: 'created_at' | 'updated_at' | 'total_downloads' | 'rating' | 'price'
  sort_order?: 'asc' | 'desc'
  is_public?: boolean
  status?: 'draft' | 'published' | 'archived'
  owner_id?: string
  min_price?: number
  max_price?: number
}

export interface CreateNodeData {
  name: string
  description: string
  category: string
  tags?: string[]
  price: number
  is_public?: boolean
}

export interface UpdateNodeData {
  name?: string
  description?: string
  category?: string
  tags?: string[]
  price?: number
  is_public?: boolean
  status?: 'draft' | 'published' | 'archived'
}

export interface CreateNodeVersionData {
  version: string
  changelog?: string
  file: File | Blob
}
