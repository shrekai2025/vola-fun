// 认证相关 Hook

'use client'

import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { 
  userAtom, 
  isLoggedInAtom, 
  openAuthModalAtom, 
  closeAuthModalAtom,
  setUserAtom,
  clearAuthAtom,
  initAuthAtom,
  authLoadingAtom,
  setAuthLoadingAtom
} from '@/atoms/auth'
import { TokenManager } from '@/lib/cookie'
import { AuthAPI } from '@/services/auth-api'
import FirebaseAuthService from '@/services/firebase-auth'
import { useToast } from '@/components/ui/toast'
import { clearUserIdCache } from '@/services/user-api'
import { dataManager } from '@/lib/data-manager'

/**
 * 认证相关 Hook
 */
export function useAuth() {
  const [user] = useAtom(userAtom)
  const [isLoggedIn] = useAtom(isLoggedInAtom)
  const [authLoading] = useAtom(authLoadingAtom)
  const [, setUser] = useAtom(setUserAtom)
  const [, openAuthModal] = useAtom(openAuthModalAtom)
  const [, closeAuthModal] = useAtom(closeAuthModalAtom)
  const [, clearAuth] = useAtom(clearAuthAtom)
  const [, initAuth] = useAtom(initAuthAtom)
  const [, setAuthLoading] = useAtom(setAuthLoadingAtom)
  const toast = useToast()

  // 初始化认证状态
  useEffect(() => {
    initAuth()
    
    // 处理 Google 重定向结果
    const handleRedirectResult = async () => {
      try {
        const idToken = await FirebaseAuthService.handleGoogleRedirectResult()
        if (idToken) {
          // 有重定向结果，处理登录
          const tokenData = await AuthAPI.loginWithFirebaseToken(idToken)
          
          // 存储 tokens
          TokenManager.setTokens({
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            tokenType: tokenData.token_type
          })

          toast.loginSuccess()
          window.location.reload()
        }
      } catch (error) {
        console.error('Handle redirect result error:', error)
        toast.authError('Google 登录失败，请重试')
      }
    }
    
    handleRedirectResult()
    
    // 监听 Firebase 认证状态变化
    const unsubscribe = FirebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser && TokenManager.isLoggedIn()) {
        // 用户已登录，可以在这里获取用户信息
        // TODO: 从后端 API 获取完整的用户信息
        console.log('Firebase user:', firebaseUser)
      } else if (!firebaseUser) {
        // 用户已登出
        clearAuth()
      }
    })

    return () => unsubscribe()
  }, [initAuth, clearAuth])

  /**
   * 打开认证弹窗
   */
  const showAuthModal = (step: 'email' | 'login' | 'signup' = 'email') => {
    openAuthModal(step)
  }

  /**
   * 关闭认证弹窗
   */
  const hideAuthModal = () => {
    closeAuthModal()
  }

  /**
   * 登出功能
   */
  const logout = async () => {
    setAuthLoading(true)
    try {
      // 1. 调用后端登出 API
      try {
        await AuthAPI.logout()
      } catch (error) {
        console.warn('Backend logout failed:', error)
        // 即使后端登出失败，我们也继续本地清理
      }

      // 2. Firebase 登出
      await FirebaseAuthService.signOut()

      // 3. 清除本地状态
      clearAuth()

      // 4. 清除所有缓存数据
      clearUserIdCache()
      dataManager.secureCleanup()

      toast.logoutSuccess()
      
      // 5. 刷新页面
      window.location.reload()
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('登出失败，请重试')
    } finally {
      setAuthLoading(false)
    }
  }

  /**
   * 检查是否已登录
   */
  const checkAuthStatus = () => {
    return TokenManager.isLoggedIn()
  }

  /**
   * 获取访问令牌
   */
  const getAccessToken = () => {
    return TokenManager.getAccessToken()
  }

  /**
   * 获取刷新令牌
   */
  const getRefreshToken = () => {
    return TokenManager.getRefreshToken()
  }

  return {
    // 状态
    user,
    isLoggedIn,
    authLoading,
    
    // 方法
    showAuthModal,
    hideAuthModal,
    logout,
    checkAuthStatus,
    getAccessToken,
    getRefreshToken,
  }
}

export default useAuth
