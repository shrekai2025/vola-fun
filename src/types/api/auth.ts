/**
 * 认证相关API类型定义
 */

import type { User } from './user'

// 登录凭据
export interface LoginCredentials {
  firebase_id_token: string
}

// Token数据
export interface TokenData {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
}

// 刷新Token请求
export interface RefreshTokenRequest {
  refresh_token: string
}

// 登录响应
export type LoginResponse = TokenData

// 刷新Token响应
export type RefreshTokenResponse = TokenData

// 注册数据
export interface SignupData {
  email: string
  password: string
  username: string
  full_name: string
}

// 用户认证状态
export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  tokens: TokenData | null
}

// Firebase用户信息
export interface FirebaseUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

// 认证错误代码
export type AuthErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'TOKEN_EXPIRED'
  | 'INVALID_TOKEN'
  | 'USER_NOT_FOUND'
  | 'EMAIL_NOT_VERIFIED'
  | 'ACCOUNT_DISABLED'
