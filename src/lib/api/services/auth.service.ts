import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'

export interface LoginCredentials {
  firebaseIdToken: string
}

export interface TokenData {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user?: UserInfo
}

export interface UserInfo {
  id: string
  firebase_uid: string
  email: string
  username: string
  full_name: string
  avatar_url: string
  role: string
  is_active: boolean
  is_verified: boolean
  subscription_balance: number
  one_time_balance: number
  bio: string
  company: string
  website: string
  location: string
  plan?: string
  created_at: string
  updated_at: string
}

export class AuthService {
  static async login(firebaseIdToken: string): Promise<TokenData> {
    const response = await apiClient.post<TokenData>(API_ENDPOINTS.AUTH.LOGIN, null, {
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
    })

    if (!response.success) {
      throw new Error(response.message || 'Login failed')
    }

    return response.data
  }

  static async logout(): Promise<void> {
    const response = await apiClient.post<null>(API_ENDPOINTS.AUTH.LOGOUT)

    if (!response.success) {
      throw new Error(response.message || 'Logout failed')
    }
  }

  static async refreshToken(refreshToken: string): Promise<TokenData> {
    const response = await apiClient.post<TokenData>(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    })

    if (!response.success) {
      throw new Error(response.message || 'Token refresh failed')
    }

    return response.data
  }

  static async getCurrentUser(): Promise<UserInfo> {
    const response = await apiClient.get<UserInfo>(API_ENDPOINTS.AUTH.ME)

    if (!response.success) {
      throw new Error(response.message || 'Failed to get user info')
    }

    return response.data
  }
}

export default AuthService
