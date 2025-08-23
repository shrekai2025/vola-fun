import { useState, useCallback } from 'react'
import { AuthService, UserInfo } from '../services'
import { TokenManager } from '@/lib/cookie'

export function useAuth() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const login = useCallback(async (firebaseIdToken: string) => {
    setLoading(true)
    setError(null)

    try {
      const tokenData = await AuthService.login(firebaseIdToken)

      TokenManager.setTokens({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenType: tokenData.token_type,
      })

      if (tokenData.user) {
        setUser(tokenData.user)
      } else {
        const userInfo = await AuthService.getCurrentUser()
        setUser(userInfo)
      }

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
      const userInfo = await AuthService.getCurrentUser()
      setUser(userInfo)
      return userInfo
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
