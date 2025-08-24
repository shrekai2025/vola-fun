'use client'

import { useTranslation } from '@/components/providers/LanguageProvider'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { AuthService, FirebaseAuthService } from '@/lib/api'
import { TokenManager } from '@/utils/cookie'
import { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'

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
  className = 'w-full h-12 text-base font-medium',
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const { t } = useTranslation()

  // Google 登录处理
  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      let idToken: string

      if (mode === 'popup') {
        try {
          // 尝试弹窗模式
          idToken = await FirebaseAuthService.signInWithGoogle()
          console.debug('🎯 Google 登录成功，获得 ID Token')
        } catch (popupError: unknown) {
          console.warn('Popup failed, falling back to redirect:', popupError)

          // 如果是弹窗被阻止的错误，使用重定向模式
          const errorCode = (popupError as { code?: string })?.code
          const errorMessage = (popupError as { message?: string })?.message
          if (
            errorCode === 'auth/popup-blocked' ||
            errorCode === 'auth/popup-closed-by-user' ||
            errorMessage?.includes('popup')
          ) {
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
      console.debug('🔄 开始调用后端登录接口...')
      const response = await AuthService.login({ firebase_id_token: idToken })
      console.debug('✅ 后端登录成功，获得 JWT tokens')

      if (!response.success || !response.data) {
        throw new Error(response.message || '登录失败')
      }

      // 存储 tokens
      TokenManager.setTokens({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        tokenType: response.data.token_type,
      })

      // TokenManager.setTokens已经触发了auth-tokens-updated事件
      // Header会自动监听这个事件并刷新用户信息
      console.debug('✅ 登录成功，tokens已存储')

      toast.loginSuccess()
      onSuccess()
    } catch (error: unknown) {
      console.error('Google sign in error:', error)

      // 更详细的错误处理
      let errorMessage = 'Google 登录失败，请重试'
      const errorResponse = (error as { response?: { status?: number } })?.response
      const errorMsg = (error as { message?: string })?.message
      const errorCode = (error as { code?: string })?.code

      if (errorResponse?.status === 404) {
        errorMessage = '登录服务暂时不可用，请稍后重试'
      } else if (errorMsg?.includes('CORS')) {
        errorMessage = '网络连接问题，请检查网络设置'
      } else if (errorCode?.includes('auth/')) {
        errorMessage = '身份验证失败，请重试'
      }

      toast.authError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant='outline'
      onClick={handleGoogleSignIn}
      disabled={disabled || isLoading}
      className={className}
    >
      <FaGoogle className='w-4 h-4' />
      {isLoading ? t('auth.connecting') : t('auth.continueWithGoogle')}
    </Button>
  )
}

export default GoogleAuthButton
