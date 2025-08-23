'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useUserCache } from '@/hooks/useUserCache'
import { useAuth } from '@/hooks/useAuth'
import UserAPIEditSection from '@/components/sections/UserAPIEditSection'

export default function EditAPIPage() {
  const { isLoggedIn, loading } = useUserCache()
  const { showAuthModal } = useAuth()
  const params = useParams()
  const apiId = params.id as string

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
              <p className='text-muted-foreground'>Loading...</p>
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
              <p className='text-muted-foreground'>请先登录以编辑API</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <UserAPIEditSection apiId={apiId} />
    </div>
  )
}
