/**
 * 认证相关类型定义（兼容性文件）
 * 重新导出新的API类型，保持向后兼容性
 */

// 导入新的类型
export type {
  TokenData,
  LoginResponse,
  RefreshTokenResponse,
  SignupData,
  FirebaseUser,
  AuthErrorCode,
  AuthState,
} from './api/auth'

export type { ApiResponse } from './api/common'
export type { User } from './api/user'

// 保留旧接口的兼容性定义
export type LogoutResponse = import('./api/common').ApiResponse<null>

// 认证弹窗状态
export type AuthModalStep = 'email' | 'login' | 'signup'

export interface AuthModalState {
  isOpen: boolean
  step: AuthModalStep
  email?: string
}

// 表单数据类型
export interface EmailFormData {
  email: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
}

// Firebase 错误代码（向后兼容）
export type FirebaseAuthErrorCode =
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/network-request-failed'
  | 'auth/too-many-requests'

// Firebase 错误
export interface FirebaseAuthError {
  code: FirebaseAuthErrorCode
  message: string
}

// 认证服务接口
export interface AuthService {
  // Google 登录
  signInWithGoogle: () => Promise<string> // 返回 Firebase ID Token

  // 邮箱登录
  signInWithEmail: (email: string, password: string) => Promise<string>

  // 邮箱注册
  signUpWithEmail: (email: string, password: string) => Promise<string>

  // 检查用户是否存在
  checkUserExists: (email: string) => Promise<'exists' | 'not-found'>

  // 登出
  signOut: () => Promise<void>
}

// Cookie 存储的 Token 信息 - 重新导出统一类型
export type { StoredTokens } from '@/types/storage'

// 保留旧的用户接口，但推荐使用新的 User 类型
export interface LegacyUser {
  id: string
  email: string
  name?: string
  credits: number
  subscription?: 'free' | 'pro'
  apiKeys: LegacyApiKey[]
}

// 保留旧的ApiKey接口
export interface LegacyApiKey {
  id: string
  key: string
  name: string
  createdAt: string
  isActive: boolean
}
