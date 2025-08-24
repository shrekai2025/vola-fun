/**
 * 注册表单组件
 * 使用标准化组件架构，支持灵活配置和多场景使用
 */

'use client'

import {
  authLoadingAtom,
  authModalAtom,
  setAuthLoadingAtom,
  setAuthModalAtom,
  setWelcomeModalAtom,
} from '@/atoms/auth'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { Input } from '@/components/ui/input'
import { StandardForm } from '@/components/ui/standard-form'
import { useToast } from '@/components/ui/toast'
import { auth } from '@/config/firebase'
import { AuthService } from '@/lib/api'
import { TokenManager } from '@/lib/cookie'
import type { FirebaseAuthError, SignupFormData } from '@/types/auth'
import type { BaseFormProps } from '@/types/ui/base'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import GoogleAuthButton from './GoogleAuthButton'

// Props接口
export interface SignupFormProps extends Partial<BaseFormProps<SignupFormData>> {
  variant?: 'default' | 'card' | 'inline'
  showGoogleLogin?: boolean
  onSignupSuccess?: () => void
  onSwitchToLogin?: () => void
  className?: string
  'data-testid'?: string
}

// 表单验证 Schema
const createSignupSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z.email(t('validation.emailInvalid')),
      password: z.string().min(6, t('validation.passwordMinLength')),
      confirmPassword: z.string().min(6, t('validation.passwordMinLength')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    })

/**
 * 注册表单组件
 */
export function SignupForm({
  variant = 'default',
  showGoogleLogin = true,
  onSignupSuccess,
  onSwitchToLogin,
  onCancel,
  className = '',
  'data-testid': dataTestId = 'signup-form',
  ...formProps
}: SignupFormProps = {}) {
  const [authModal] = useAtom(authModalAtom)
  const [, setAuthModal] = useAtom(setAuthModalAtom)
  const [isLoading] = useAtom(authLoadingAtom)
  const [, setLoading] = useAtom(setAuthLoadingAtom)
  const [, setWelcomeModal] = useAtom(setWelcomeModalAtom)
  const [formError, setFormError] = useState<string | null>(null)
  const { t } = useTranslation()
  const toast = useToast()

  const {
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(createSignupSchema(t)),
    defaultValues: {
      email: authModal.email || '',
    },
  })

  // 检查是否显示欢迎弹窗
  const shouldShowWelcome = () => {
    return process.env.NEXT_PUBLIC_SHOW_WELCOME_MODAL === 'true'
  }

  // Google 登录成功处理
  const handleGoogleSuccess = () => {
    setFormError(null)
    toast.signupSuccess()
    setAuthModal({ isOpen: false })
    onSignupSuccess?.()

    // 显示欢迎弹窗（如果配置为显示）
    if (shouldShowWelcome()) {
      setWelcomeModal(true)
    } else {
      window.location.reload()
    }
  }

  // 邮箱注册处理
  const handleEmailSignup = async (data: SignupFormData) => {
    setFormError(null)
    setLoading(true)

    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const idToken = await result.user.getIdToken()

      // 调用后端 API 换取 JWT
      const response = await AuthService.login({ firebase_id_token: idToken })

      if (!response.success || !response.data) {
        throw new Error(response.message || t('toast.authError'))
      }

      // 存储 tokens
      TokenManager.setTokens({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        tokenType: response.data.token_type,
      })

      toast.signupSuccess()
      setAuthModal({ isOpen: false })
      onSignupSuccess?.()

      // 显示欢迎弹窗（如果配置为显示）
      if (shouldShowWelcome()) {
        setWelcomeModal(true)
      } else {
        window.location.reload()
      }
    } catch (error) {
      const firebaseError = error as FirebaseAuthError

      let errorMessage = t('toast.authError')

      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          errorMessage = t('toast.emailAlreadyExists')
          break
        case 'auth/weak-password':
          errorMessage = t('toast.passwordWeak')
          break
        case 'auth/invalid-email':
          errorMessage = t('validation.emailInvalid')
          break
        default:
          errorMessage = firebaseError.message || t('toast.authError')
      }

      setFormError(errorMessage)
      console.error('Email signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  // 跳转到登录
  const handleSwitchToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin()
    } else {
      setAuthModal({ step: 'login' })
    }
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
      {/* 隐私政策提示 */}
      <div className='text-sm text-muted-foreground text-center leading-relaxed'>
        {t('auth.privacyNotice')}{' '}
        <a
          href='#'
          className='text-primary hover:text-primary/80 underline underline-offset-4 transition-colors'
        >
          {t('auth.privacyPolicy')}
        </a>
        .
      </div>

      {/* Google 登录按钮 */}
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
      <StandardForm<SignupFormData>
        variant={variant}
        onSubmit={handleEmailSignup}
        onCancel={handleCancel}
        onRetry={handleRetry}
        loading={isLoading}
        isSubmitting={isSubmitting}
        error={formError}
        submitText={t('auth.createAccount')}
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

        {/* 确认密码字段 */}
        <div className='space-y-2'>
          <Input
            {...register('confirmPassword')}
            type='password'
            placeholder={t('auth.confirmPasswordPlaceholder')}
            className='h-12 text-base'
            disabled={isLoading || isSubmitting}
            data-testid={`${dataTestId}-confirm-password`}
          />
          {errors.confirmPassword && (
            <p className='text-sm text-destructive' role='alert'>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </StandardForm>

      {/* 切换到登录 */}
      <div className='text-center text-sm'>
        <span className='text-muted-foreground'>{t('auth.alreadyHaveAccount')}</span>
        <button
          type='button'
          onClick={handleSwitchToLogin}
          className='text-primary hover:text-primary/80 underline underline-offset-4 transition-colors font-medium'
          disabled={isLoading || isSubmitting}
          data-testid={`${dataTestId}-switch-login`}
        >
          {t('auth.logIn')}
        </button>
      </div>
    </div>
  )
}

export default SignupForm
