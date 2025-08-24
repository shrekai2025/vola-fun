/**
 * 认证相关 Hook
 * 从原来的根目录hooks移动到auth子目录
 */

'use client'

import {
  authLoadingAtom,
  clearAuthAtom,
  closeAuthModalAtom,
  initAuthAtom,
  isLoggedInAtom,
  openAuthModalAtom,
  setAuthLoadingAtom,
  userAtom,
} from '@/atoms/auth'
import { useToast } from '@/components/ui/toast'
import { AuthService } from '@/lib/api'
import { TokenManager } from '@/utils/cookie'
import { dataManager } from '@/lib/data-manager'
import { FirebaseAuthService } from '@/lib/api'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

/**
 * 认证相关 Hook
 */
export function useAuth() {
  const [user] = useAtom(userAtom)
  const [isLoggedIn] = useAtom(isLoggedInAtom)
  const [authLoading] = useAtom(authLoadingAtom)
  const [, openAuthModal] = useAtom(openAuthModalAtom)
  const [, closeAuthModal] = useAtom(closeAuthModalAtom)
  const [, clearAuth] = useAtom(clearAuthAtom)
  const [, initAuth] = useAtom(initAuthAtom)
  const [, setAuthLoading] = useAtom(setAuthLoadingAtom)
  const { toast } = useToast()

  // 登录处理
  const login = async (idToken: string): Promise<void> => {
    try {
      setAuthLoading(true)
      const response = await AuthService.login({ firebase_id_token: idToken })

      if (response.success && response.data) {
        TokenManager.setTokens({
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          tokenType: response.data.token_type,
        })

        await initAuth()
        closeAuthModal()

        toast({
          title: 'success',
          description: 'loginSuccess',
          variant: 'default',
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'error',
        description: 'authError',
        variant: 'destructive',
      })
      throw error
    } finally {
      setAuthLoading(false)
    }
  }

  // Google登录
  const loginWithGoogle = async (): Promise<void> => {
    try {
      const idToken = await FirebaseAuthService.signInWithGoogle()
      await login(idToken)
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    }
  }

  // 邮箱登录
  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      const idToken = await FirebaseAuthService.signInWithEmail(email, password)
      await login(idToken)
    } catch (error) {
      console.error('Email login error:', error)
      throw error
    }
  }

  // 注册
  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      const idToken = await FirebaseAuthService.signUpWithEmail(email, password)
      await login(idToken)
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  // 登出
  const logout = async (): Promise<void> => {
    try {
      await Promise.all([AuthService.logout(), FirebaseAuthService.signOut()])

      clearAuth()
      dataManager.clearCache()

      toast({
        title: 'success',
        description: 'logoutSuccess',
        variant: 'default',
      })
    } catch (error) {
      console.error('Logout error:', error)
      // 即使logout API失败，也要清除本地状态
      clearAuth()
      dataManager.clearCache()
    }
  }

  // 检查用户是否存在
  const checkUserExists = async (email: string): Promise<'exists' | 'not-found'> => {
    try {
      return await FirebaseAuthService.checkUserExists(email)
    } catch (error) {
      console.error('Check user exists error:', error)
      throw error
    }
  }

  // 初始化认证状态
  useEffect(() => {
    const initializeAuth = async () => {
      if (TokenManager.isLoggedIn() && !user) {
        await initAuth()
      }
    }

    initializeAuth()
  }, [user, initAuth])

  return {
    // 状态
    user,
    isLoggedIn,
    loading: authLoading,

    // 操作
    loginWithGoogle,
    loginWithEmail,
    signUp,
    logout,
    checkUserExists,
    openAuthModal,
    closeAuthModal,
  }
}
