/**
 * 用户相关API类型定义
 */

import type { BaseQueryParams } from './common'

// 用户角色类型
export type UserRole = 'USER' | 'PROVIDER' | 'ADMIN'

// 订阅计划类型
export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise'

// 订阅状态
export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'EXPIRED'

// 基础用户信息
export interface User {
  id: string
  firebase_uid: string
  email: string
  username: string
  full_name: string
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  is_verified: boolean
  subscription_balance: number
  one_time_balance: number
  bio: string | null
  company: string | null
  website: string | null
  location: string | null
  plan?: SubscriptionPlan
  created_at: string
  updated_at: string
}

// 用户公开信息（不包含敏感数据）
export interface PublicUser {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  bio: string | null
  company: string | null
  website: string | null
  location: string | null
  is_verified: boolean
  created_at: string
}

// 订阅信息
export interface SubscriptionInfo {
  plan: SubscriptionPlan
  status: SubscriptionStatus
  current_period_end: string
  monthly_price: number
}

// 支付信息
export interface PaymentInfo {
  subscription_balance: number
  one_time_balance: number
  total_balance: number
  subscription: SubscriptionInfo
}

// 详细用户信息（包含支付信息）
export interface DetailedUser extends User {
  payment_info: PaymentInfo
}

// 用户统计信息
export interface UserStats {
  total_apis: number
  total_nodes: number
  total_favorites: number
  total_api_calls: number
  total_revenue: number
  member_since_days: number
}

// 用户列表查询参数
export interface UserListParams extends BaseQueryParams {
  role?: UserRole
  is_verified?: boolean
  is_active?: boolean
}

// 用户更新数据
export interface UpdateUserData {
  username?: string
  full_name?: string
  bio?: string
  company?: string
  website?: string
  location?: string
}

// 管理员用户管理参数
export interface AdminUserParams {
  is_active?: boolean
  role?: UserRole
}

// 管理员用户详细数据
export interface AdminUserData extends User {
  last_login_at?: string
  login_count: number
  ip_address?: string
  user_agent?: string
  notes?: string
}
