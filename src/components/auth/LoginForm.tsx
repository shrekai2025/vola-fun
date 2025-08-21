'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAtom } from 'jotai'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GoogleAuthButton from './GoogleAuthButton'
import { authModalAtom, setAuthModalAtom, authLoadingAtom, setAuthLoadingAtom } from '@/atoms/auth'
import { AuthAPI } from '@/services/auth-api'
import { TokenManager } from '@/lib/cookie'
import { useToast } from '@/components/ui/toast'
import type { LoginFormData, FirebaseAuthError } from '@/types/auth'

// 表单验证 Schema
const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符')
})

/**
 * 登录表单组件
 */
export function LoginForm() {
  const [authModal] = useAtom(authModalAtom)
  const [, setAuthModal] = useAtom(setAuthModalAtom)
  const [isLoading] = useAtom(authLoadingAtom)
  const [, setLoading] = useAtom(setAuthLoadingAtom)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: authModal.email || ''
    }
  })

  // Google 登录成功处理
  const handleGoogleSuccess = () => {
    // 关闭弹窗并刷新页面
    setAuthModal({ isOpen: false })
    window.location.reload()
  }

  // 邮箱登录处理
  const handleEmailLogin = async (data: LoginFormData) => {
    setLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, data.email, data.password)
      const idToken = await result.user.getIdToken()

      // 调用后端 API 换取 JWT
      const tokenData = await AuthAPI.loginWithFirebaseToken(idToken)
      
      // 存储 tokens
      TokenManager.setTokens({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenType: tokenData.token_type
      })

      toast.loginSuccess()
      
      // 关闭弹窗并刷新页面
      setAuthModal({ isOpen: false })
      window.location.reload()
    } catch (error) {
      const firebaseError = error as FirebaseAuthError
      
      if (firebaseError.code === 'auth/wrong-password') {
        toast.error('密码错误，请重试')
      } else if (firebaseError.code === 'auth/user-not-found') {
        toast.error('用户不存在')
      } else if (firebaseError.code === 'auth/user-disabled') {
        toast.error('该账户已被禁用')
      } else if (firebaseError.code === 'auth/too-many-requests') {
        toast.error('登录尝试次数过多，请稍后重试')
      } else {
        console.error('Email login error:', error)
        toast.authError('登录失败，请重试')
      }
    } finally {
      setLoading(false)
    }
  }

  // 重置密码处理（暂时用 toast 提示）
  const handleResetPassword = () => {
    // TODO: 实现重置密码功能
    toast.message('密码重置功能即将推出')
  }

  return (
    <div className="space-y-6">
      {/* Google 登录按钮 */}
      <GoogleAuthButton
        onSuccess={handleGoogleSuccess}
        disabled={isLoading || isSubmitting}
        mode="popup"
      />

      {/* 分隔线 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      {/* 邮箱登录表单 */}
      <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-4">
        <div>
          <Input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="h-12 text-base"
            disabled={isLoading || isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('password')}
            type="password"
            placeholder="Password"
            className="h-12 text-base"
            disabled={isLoading || isSubmitting}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="w-full h-12 text-base font-medium bg-black text-white hover:bg-gray-800"
        >
          Log in
        </Button>

        {/* 重置密码链接 */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleResetPassword}
            className="text-sm text-blue-600 hover:text-blue-500 underline"
            disabled={isLoading || isSubmitting}
          >
            Reset password
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
