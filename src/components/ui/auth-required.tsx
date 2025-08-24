'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useUserCache } from '@/hooks/data'
import { useAuth } from '@/hooks/auth'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { PageLoading } from './loading'

interface AuthRequiredProps {
  children: ReactNode
  redirectTo?: string
  loginPrompt?: string
  showLoginModal?: boolean
}

export default function AuthRequired({
  children,
  redirectTo,
  loginPrompt,
  showLoginModal = true,
}: AuthRequiredProps) {
  const { isLoggedIn, loading } = useUserCache()
  const { openAuthModal } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      if (showLoginModal) {
        openAuthModal()
      }
      if (redirectTo) {
        router.push(redirectTo)
      }
    }
  }, [loading, isLoggedIn, openAuthModal, router, redirectTo, showLoginModal])

  // 显示加载状态
  if (loading) {
    return (
      <div className='min-h-screen bg-background'>
        <PageLoading />
      </div>
    )
  }

  // 用户未登录时显示提示信息
  if (!isLoggedIn) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 py-8'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <p className='text-muted-foreground'>
                {loginPrompt || t('apiProvider.create.loginPrompt')}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 用户已登录，渲染子组件
  return <>{children}</>
}
