'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAtom } from 'jotai'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GoogleAuthButton from './GoogleAuthButton'
import { setAuthModalAtom, authLoadingAtom, setAuthLoadingAtom } from '@/atoms/auth'
import { useToast } from '@/components/ui/toast'
import type { EmailFormData, FirebaseAuthError } from '@/types/auth'

// 表单验证 Schema
const emailSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址')
})

/**
 * 邮箱输入步骤组件
 */
export function EmailStep() {
  const [, setAuthModal] = useAtom(setAuthModalAtom)
  const [isLoading] = useAtom(authLoadingAtom)
  const [, setLoading] = useAtom(setAuthLoadingAtom)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema)
  })

  // Google 登录成功处理
  const handleGoogleSuccess = () => {
    // 关闭弹窗并刷新页面
    setAuthModal({ isOpen: false })
    window.location.reload()
  }

  // 邮箱继续处理
  const handleEmailContinue = async (data: EmailFormData) => {
    setLoading(true)
    try {
      // 使用假密码尝试登录来检查用户是否存在
      await signInWithEmailAndPassword(auth, data.email, '123456789')
    } catch (error) {
      const firebaseError = error as FirebaseAuthError
      
      if (firebaseError.code === 'auth/user-not-found') {
        // 用户不存在，跳转到注册表单
        setAuthModal({ 
          step: 'signup',
          email: data.email 
        })
      } else if (firebaseError.code === 'auth/wrong-password') {
        // 用户存在但密码错误，跳转到登录表单
        setAuthModal({ 
          step: 'login',
          email: data.email 
        })
      } else if (firebaseError.code === 'auth/invalid-email') {
        toast.error('邮箱格式不正确')
      } else if (firebaseError.code === 'auth/user-disabled') {
        toast.error('该账户已被禁用')
      } else {
        console.error('Email check error:', error)
        toast.error('检查邮箱时出现错误，请重试')
      }
    } finally {
      setLoading(false)
    }
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

      {/* 邮箱输入表单 */}
      <form onSubmit={handleSubmit(handleEmailContinue)} className="space-y-4">
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

        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="w-full h-12 text-base font-medium bg-black text-white hover:bg-gray-800"
        >
          Continue with Email
        </Button>
      </form>
    </div>
  )
}

export default EmailStep
