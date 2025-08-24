/**
 * 登录表单组件
 * 使用标准化组件架构，支持灵活配置和多场景使用
 */

'use client'

import { authLoadingAtom, authModalAtom, setAuthLoadingAtom, setAuthModalAtom } from '@/atoms/auth'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { Input } from '@/components/ui/input'
import { StandardForm } from '@/components/ui/standard-form'
import { useToast } from '@/components/ui/toast'
import { auth } from '@/config/firebase'
import { AuthService } from '@/lib/api'
import { TokenManager } from '@/lib/cookie'
import type { FirebaseAuthError, LoginFormData } from '@/types/auth'
import type { BaseFormProps } from '@/types/ui/base'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import GoogleAuthButton from './GoogleAuthButton'

// Props接口
export interface LoginFormProps extends Partial<BaseFormProps<LoginFormData>> {
  variant?: 'default' | 'card' | 'inline'
  showGoogleLogin?: boolean
  onLoginSuccess?: () => void
  onSwitchToSignup?: () => void
  className?: string
  'data-testid'?: string
}

// 表单验证Schema
const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t('validation.emailInvalid')),
    password: z.string().min(6, t('validation.passwordMinLength')),
  })

export function LoginForm({
  variant = 'default',
  showGoogleLogin = true,
  onLoginSuccess,
  onSwitchToSignup,
  onCancel,
  className = '',
  'data-testid': dataTestId = 'login-form',
  ...formProps
}: LoginFormProps) {
  const [authModal] = useAtom(authModalAtom)
  const [, setAuthModal] = useAtom(setAuthModalAtom)
  const [isLoading] = useAtom(authLoadingAtom)
  const [, setLoading] = useAtom(setAuthLoadingAtom)
  const [formError, setFormError] = useState<string | null>(null)
  const { t } = useTranslation()
  const toast = useToast()

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: {
      email: authModal.email || '',
    },
  })

  // Google登录成功处理
  const handleGoogleSuccess = () => {
    setFormError(null)
    setAuthModal({ isOpen: false })
    onLoginSuccess?.()
    window.location.reload()
  }

  // 邮箱登录处理
  const handleEmailLogin = async (data: LoginFormData) => {
    setFormError(null)
    setLoading(true)

    try {
      const result = await signInWithEmailAndPassword(auth, data.email, data.password)
      const idToken = await result.user.getIdToken()

      // 调用后端API换取JWT
      const response = await AuthService.login({ firebase_id_token: idToken })

      if (!response.success || !response.data) {
        throw new Error(response.message || t('toast.authError'))
      }

      // 存储tokens
      TokenManager.setTokens({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        tokenType: response.data.token_type,
      })

      toast.loginSuccess()
      setAuthModal({ isOpen: false })
      onLoginSuccess?.()
      window.location.reload()
    } catch (error) {
      const firebaseError = error as FirebaseAuthError

      let errorMessage = t('toast.authError')

      switch (firebaseError.code) {
        case 'auth/wrong-password':
          errorMessage = t('toast.passwordIncorrect')
          break
        case 'auth/user-not-found':
          errorMessage = t('toast.userNotExists')
          break
        case 'auth/user-disabled':
          errorMessage = t('toast.accountDisabled')
          break
        case 'auth/too-many-requests':
          errorMessage = t('toast.tooManyAttempts')
          break
        default:
          errorMessage = firebaseError.message || t('toast.authError')
      }

      setFormError(errorMessage)
      console.error('Email login error:', error)
    } finally {
      setLoading(false)
    }
  }

  // 重置密码处理
  const handleResetPassword = () => {
    toast.message(t('auth.resetPasswordNotice'))
  }

  const handleCancel = () => {
    setFormError(null)
    reset()
    onCancel?.()
  }

  const handleRetry = () => {
    setFormError(null)
  }

  return (
    <div className={`space-y-6 ${className}`} data-testid={dataTestId}>
      {/* Google登录按钮 */}
      {showGoogleLogin && (
        <GoogleAuthButton
          onSuccess={handleGoogleSuccess}
          disabled={isLoading || isSubmitting}
          mode='popup'
        />
      )}

      {/* 分隔线 */}
      {showGoogleLogin && (
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>{t('common.or')}</span>
          </div>
        </div>
      )}

      {/* 使用标准化表单组件 */}
      <StandardForm<LoginFormData>
        variant={variant}
        onSubmit={handleEmailLogin}
        onCancel={handleCancel}
        onRetry={handleRetry}
        loading={isLoading}
        isSubmitting={isSubmitting}
        error={formError}
        submitText={t('auth.logIn')}
        cancelText={onCancel ? t('common.cancel') : undefined}
        showActions={true}
        spacing='normal'
        data-testid={`${dataTestId}-form`}
        {...formProps}
      >
        {/* 邮箱字段 */}
        <div className='space-y-2'>
          <Input
            {...register('email')}
            type='email'
            placeholder={t('auth.emailPlaceholder')}
            className='h-12 text-base'
            disabled={isLoading || isSubmitting}
            data-testid={`${dataTestId}-email`}
          />
          {errors.email && (
            <p className='text-sm text-destructive' role='alert'>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* 密码字段 */}
        <div className='space-y-2'>
          <Input
            {...register('password')}
            type='password'
            placeholder={t('auth.passwordPlaceholder')}
            className='h-12 text-base'
            disabled={isLoading || isSubmitting}
            data-testid={`${dataTestId}-password`}
          />
          {errors.password && (
            <p className='text-sm text-destructive' role='alert'>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* 重置密码链接 */}
        <div className='text-center'>
          <button
            type='button'
            onClick={handleResetPassword}
            className='text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors'
            disabled={isLoading || isSubmitting}
            data-testid={`${dataTestId}-reset-password`}
          >
            {t('auth.resetPassword')}
          </button>
        </div>
      </StandardForm>

      {/* 切换到注册 */}
      {onSwitchToSignup && (
        <div className='text-center text-sm'>
          <span className='text-muted-foreground'>{t('auth.noAccount')}</span>
          <button
            type='button'
            onClick={onSwitchToSignup}
            className='text-primary hover:text-primary/80 underline underline-offset-4 transition-colors font-medium'
            disabled={isLoading || isSubmitting}
            data-testid={`${dataTestId}-switch-signup`}
          >
            {t('auth.signUp')}
          </button>
        </div>
      )}
    </div>
  )
}

export default LoginForm
