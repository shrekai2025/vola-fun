/**
 * 认证操作 Hook
 * 专注于处理登录、注册、登出等认证操作
 * 用户状态由 useUserCache 统一管理
 */

'use client'

import {
  authLoadingAtom,
  closeAuthModalAtom,
  openAuthModalAtom,
  setAuthLoadingAtom,
} from '@/atoms/auth'
import { useToast } from '@/components/ui/toast'
import { AuthService } from '@/lib/api'
import { TokenManager } from '@/utils/cookie'
import { dataManager } from '@/lib/data-manager'
import { FirebaseAuthService } from '@/lib/api'
import { useAtom } from 'jotai'
import type { AuthModalState } from '@/types/auth'

/**
 * 认证操作 Hook
 * 注意：此 Hook 只处理认证操作，不管理用户状态
 * 用户状态请使用 useUserCache Hook
 */
export function useAuth() {
  const [authLoading] = useAtom(authLoadingAtom)
  const [, openAuthModal] = useAtom(openAuthModalAtom)
  const [, closeAuthModal] = useAtom(closeAuthModalAtom)
  const [, setAuthLoading] = useAtom(setAuthLoadingAtom)
  const { loginSuccess, authError, logoutSuccess } = useToast()

  // 基础登录处理 - 只处理token存储，不管理用户状态
  const login = async (idToken: string): Promise<void> => {
    try {
      setAuthLoading(true)
      const response = await AuthService.login({ firebase_id_token: idToken })

      if (response.success && response.data) {
        // 存储 tokens - 这会触发 auth-tokens-updated 事件
        TokenManager.setTokens({
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          tokenType: response.data.token_type,
        })

        closeAuthModal()
        loginSuccess()
      } else {
        throw new Error(response.message || '登录失败')
      }
    } catch (error) {
      console.error('Login error:', error)
      authError()
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

  // 登出 - 只清除 tokens 和 Firebase 状态，用户状态由事件处理
  const logout = async (): Promise<void> => {
    try {
      setAuthLoading(true)

      // 调用后端登出API（如果失败也继续本地清理）
      try {
        await AuthService.logout()
      } catch (error) {
        console.warn('Backend logout failed:', error)
      }

      // 清除 Firebase 状态
      try {
        await FirebaseAuthService.signOut()
      } catch (error) {
        console.warn('Firebase logout failed:', error)
      }

      // 清除本地 tokens - 这会触发 auth-tokens-cleared 事件
      TokenManager.clearTokens()

      // 清除数据管理器缓存
      dataManager.clearCache()

      logoutSuccess()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setAuthLoading(false)
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

  // 打开认证弹窗
  const openModal = (step: AuthModalState['step'] = 'email') => {
    openAuthModal(step)
  }

  // 关闭认证弹窗
  const closeModal = () => {
    closeAuthModal()
  }

  return {
    // 状态
    loading: authLoading,

    // 认证操作
    loginWithGoogle,
    loginWithEmail,
    signUp,
    logout,
    checkUserExists,

    // 弹窗操作
    openAuthModal: openModal,
    closeAuthModal: closeModal,
  }
}
