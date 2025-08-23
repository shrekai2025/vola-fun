'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useUserCache } from '@/hooks/useUserCache'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from '@/components/providers/LanguageProvider'
import APIEndpointsSection from '@/components/sections/APIEndpointsSection'

export default function EndpointsPage() {
  const { isLoggedIn, loading } = useUserCache()
  const { showAuthModal } = useAuth()
  const { t } = useTranslation()
  const params = useParams()
  const apiId = params.apiId as string

  useEffect(() => {
    // 如果用户未登录，重定向到登录
    if (!loading && !isLoggedIn) {
      showAuthModal('email')
    }
  }, [loading, isLoggedIn, showAuthModal])

  // 显示加载状态
  if (loading) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 py-8'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4' />
              <p className='text-muted-foreground'>{t('common.loading')}...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 用户未登录时显示空页面
  if (!isLoggedIn) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 py-8'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <p className='text-muted-foreground'>{t('endpoints.loginPrompt')}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <APIEndpointsSection apiId={apiId} />
    </div>
  )
}
