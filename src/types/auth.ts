// 认证相关类型定义

// Firebase 用户信息
export interface FirebaseUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

// JWT Token 数据
export interface TokenData {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
}

// API 响应基础结构
export interface ApiResponse<T = unknown> {
  success: boolean
  code: string
  message: string
  data: T
}

// 登录API响应
export type LoginResponse = ApiResponse<TokenData>

// 刷新Token API响应
export type RefreshTokenResponse = ApiResponse<TokenData>

// 登出API响应
export type LogoutResponse = ApiResponse<null>

// 用户状态
export interface User {
  id: string
  email: string
  name?: string
  credits: number
  subscription?: 'free' | 'pro'
  apiKeys: ApiKey[]
}

// API密钥
export interface ApiKey {
  id: string
  key: string
  name: string
  createdAt: string
  isActive: boolean
}

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

// Firebase 错误代码
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

// Cookie 存储的 Token 信息
export interface StoredTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
}
