import { useState, useCallback } from 'react'
import { AuthService, UserService } from '../services'
import type { User } from '@/types'
import { TokenManager } from '@/utils/cookie'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const login = useCallback(async (firebaseIdToken: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await AuthService.login({ firebase_id_token: firebaseIdToken })
      const tokenData = response.data

      TokenManager.setTokens({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenType: tokenData.token_type,
      })

      // 获取用户信息
      const userInfo = await UserService.getCurrentUser()
      setUser(userInfo.data)

      return tokenData
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await AuthService.logout()
      TokenManager.clearTokens()
      setUser(null)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Logout failed')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const getCurrentUser = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await UserService.getCurrentUser()
      setUser(response.data)
      return response.data
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get user info')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const isAuthenticated = useCallback(() => {
    return !!TokenManager.getAccessToken()
  }, [])

  return {
    user,
    loading,
    error,
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
  }
}
