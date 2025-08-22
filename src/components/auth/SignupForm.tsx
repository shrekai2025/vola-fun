'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAtom } from 'jotai'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/config/firebase'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GoogleAuthButton from './GoogleAuthButton'
import { authModalAtom, setAuthModalAtom, authLoadingAtom, setAuthLoadingAtom, setWelcomeModalAtom } from '@/atoms/auth'
import { AuthAPI } from '@/services/auth-api'
import { TokenManager } from '@/lib/cookie'
import { useToast } from '@/components/ui/toast'
import type { SignupFormData, FirebaseAuthError } from '@/types/auth'

// 表单验证 Schema
const signupSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少需要6个字符'),
  confirmPassword: z.string().min(6, '确认密码至少需要6个字符')
}).refine((data) => data.password === data.confirmPassword, {
  message: "密码不匹配",
  path: ["confirmPassword"],
})

/**
 * 注册表单组件
 */
export function SignupForm() {
  const [authModal] = useAtom(authModalAtom)
  const [, setAuthModal] = useAtom(setAuthModalAtom)
  const [isLoading] = useAtom(authLoadingAtom)
  const [, setLoading] = useAtom(setAuthLoadingAtom)
  const [, setWelcomeModal] = useAtom(setWelcomeModalAtom)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: authModal.email || ''
    }
  })

  // 检查是否显示欢迎弹窗
  const shouldShowWelcome = () => {
    return process.env.NEXT_PUBLIC_SHOW_WELCOME_MODAL === 'true'
  }

  // Google 登录成功处理
  const handleGoogleSuccess = () => {
    toast.signupSuccess()
    
    // 关闭认证弹窗
    setAuthModal({ isOpen: false })
    
    // 显示欢迎弹窗（如果配置为显示）
    if (shouldShowWelcome()) {
      setWelcomeModal(true)
    } else {
      window.location.reload()
    }
  }

  // 邮箱注册处理
  const handleEmailSignup = async (data: SignupFormData) => {
    setLoading(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const idToken = await result.user.getIdToken()

      // 调用后端 API 换取 JWT
      const tokenData = await AuthAPI.loginWithFirebaseToken(idToken)
      
      // 存储 tokens
      TokenManager.setTokens({
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenType: tokenData.token_type
      })

      toast.signupSuccess()
      
      // 关闭认证弹窗
      setAuthModal({ isOpen: false })
      
      // 显示欢迎弹窗（如果配置为显示）
      if (shouldShowWelcome()) {
        setWelcomeModal(true)
      } else {
        window.location.reload()
      }
    } catch (error) {
      const firebaseError = error as FirebaseAuthError
      
      if (firebaseError.code === 'auth/email-already-in-use') {
        toast.error('该邮箱已被注册，请使用其他邮箱或尝试登录')
      } else if (firebaseError.code === 'auth/weak-password') {
        toast.error('密码强度不够，请选择更强的密码')
      } else if (firebaseError.code === 'auth/invalid-email') {
        toast.error('邮箱格式不正确')
      } else {
        console.error('Email signup error:', error)
        toast.authError('注册失败，请重试')
      }
    } finally {
      setLoading(false)
    }
  }

  // 跳转到登录
  const handleSwitchToLogin = () => {
    setAuthModal({ step: 'login' })
  }

  return (
    <div className="space-y-6">
      {/* 隐私政策提示 */}
      <div className="text-sm text-gray-600 text-center leading-relaxed">
        By clicking &ldquo;Continue with Google&rdquo; or &ldquo;Create account&rdquo;, you agree to the{' '}
        <a href="#" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>
        .
      </div>

      {/* Google 注册按钮 */}
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

      {/* 邮箱注册表单 */}
      <form onSubmit={handleSubmit(handleEmailSignup)} className="space-y-4">
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

        <div>
          <Input
            {...register('confirmPassword')}
            type="password"
            placeholder="Confirm Password"
            className="h-12 text-base"
            disabled={isLoading || isSubmitting}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="w-full h-12 text-base font-medium bg-black text-white hover:bg-gray-800"
        >
          Create account
        </Button>

        {/* 切换到登录 */}
        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <button
            type="button"
            onClick={handleSwitchToLogin}
            className="text-blue-600 hover:text-blue-500 underline"
            disabled={isLoading || isSubmitting}
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  )
}

export default SignupForm
