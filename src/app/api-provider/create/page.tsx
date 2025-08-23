'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserCache } from '@/hooks/useUserCache'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/components/providers/LanguageProvider'
import UserAPICreateSection from '@/components/sections/UserAPICreateSection'

export default function CreateAPIPage() {
  const { isLoggedIn, loading } = useUserCache()
  const { showAuthModal } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    // 如果用户未登录，重定向到登录
    if (!loading && !isLoggedIn) {
      showAuthModal('email')
      router.push('/api-provider')
    }
  }, [loading, isLoggedIn, showAuthModal, router])

  // 显示加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t.common.loading}...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 用户未登录时显示空页面
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-muted-foreground">{t.apiProvider.create.loginPrompt}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <UserAPICreateSection />
    </div>
  )
}
