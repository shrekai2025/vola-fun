'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import FirebaseAuthService from '@/services/firebase-auth'
import { AuthAPI } from '@/services/auth-api'
import { TokenManager } from '@/lib/cookie'
import { useToast } from '@/components/ui/toast'

interface GoogleAuthButtonProps {
  onSuccess: () => void
  disabled?: boolean
  mode?: 'popup' | 'redirect'
  className?: string
}

/**
 * Google 认证按钮组件
 */
export function GoogleAuthButton({ 
  onSuccess, 
  disabled, 
  mode = 'popup',
  className = "w-full h-12 text-base font-medium"
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  // Google 登录处理
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      let idToken: string

      if (mode === 'popup') {
        try {
          // 尝试弹窗模式
          idToken = await FirebaseAuthService.signInWithGoogle()
          console.log('🎯 Google 登录成功，获得 ID Token')
        } catch (popupError: any) {
          console.warn('Popup failed, falling back to redirect:', popupError)
          
          // 如果是弹窗被阻止的错误，使用重定向模式
          if (popupError.code === 'auth/popup-blocked' || 
              popupError.code === 'auth/popup-closed-by-user' ||
              popupError.message?.includes('popup')) {
            try {
              await FirebaseAuthService.signInWithGoogleRedirect()
              return // 重定向不需要后续处理
            } catch (redirectError) {
              console.error('Redirect also failed:', redirectError)
              throw redirectError
            }
          } else {
            throw popupError
          }
        }
      } else {
        // 直接使用重定向模式
        await FirebaseAuthService.signInWithGoogleRedirect()
        return // 重定向不需要后续处理
      }

      // 调用后端 API 换取 JWT
      console.log('🔄 开始调用后端登录接口...')
      const tokenData = await AuthAPI.loginWithFirebaseToken(idToken)
      console.log('✅ 后端登录成功，获得 JWT tokens')
      
      // 存储 tokens
      TokenManager.setTokens({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenType: tokenData.token_type
      })

      // 获取用户信息
      try {
        console.log('👤 获取用户信息...')
        const userInfo = await AuthAPI.getUserInfo()
        console.log('✅ 用户信息获取成功:', userInfo)
        // 触发全局状态更新（通过 onSuccess 回调）
      } catch (userError) {
        console.warn('⚠️ 获取用户信息失败，但登录成功:', userError)
        // 不阻断登录流程，用户信息获取失败不影响登录
      }

      toast.loginSuccess()
      onSuccess()
    } catch (error: any) {
      console.error('Google sign in error:', error)
      
      // 更详细的错误处理
      let errorMessage = 'Google 登录失败，请重试'
      if (error.response?.status === 404) {
        errorMessage = '登录服务暂时不可用，请稍后重试'
      } else if (error.message?.includes('CORS')) {
        errorMessage = '网络连接问题，请检查网络设置'
      } else if (error.code?.includes('auth/')) {
        errorMessage = '身份验证失败，请重试'
      }
      
      toast.authError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={disabled || isLoading}
      className={className}
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {isLoading ? 'Connecting...' : 'Continue with Google'}
    </Button>
  )
}

export default GoogleAuthButton
