'use client'

import { useEffect } from 'react'
import { useUserCache } from '@/hooks/useUserCache'
import { useAuth } from '@/hooks/useAuth'
import UserAPIListSection from '@/components/sections/UserAPIListSection'

export default function APIProviderPage() {
  const { isLoggedIn, loading } = useUserCache()
  const { showAuthModal } = useAuth()

  useEffect(() => {
    // 如果用户未登录，重定向到登录
    if (!loading && !isLoggedIn) {
      showAuthModal('email')
    }
  }, [loading, isLoggedIn, showAuthModal])

  // 用户未登录时显示空页面（登录模态框会自动弹出）
  if (!loading && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-muted-foreground">请先登录以访问API Provider页面</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 无论是否在加载用户信息，都显示 UserAPIListSection
  // UserAPIListSection 会处理自己的加载状态
  return (
    <div className="min-h-screen bg-background">
      <UserAPIListSection />
    </div>
  )
}
