/**
 * API密钥相关类型定义
 */

export interface APIKey {
  id: string
  name: string
  key_preview: string
  description?: string
  is_active: boolean
  last_used?: string
  total_requests: number
  rate_limit?: number
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface KeyListParams {
  page?: number
  page_size?: number
  is_active?: boolean
  search?: string
}

export interface CreateKeyData {
  name: string
  description?: string
  rate_limit?: number
  expires_at?: string
}

export interface UpdateKeyData {
  name?: string
  description?: string
  rate_limit?: number
  expires_at?: string
  is_active?: boolean
}

export interface RegeneratedKey {
  id: string
  name: string
  api_key: string
  key_preview: string
}
