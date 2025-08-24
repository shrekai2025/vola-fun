'use client'

import { useTranslation } from '@/components/providers/LanguageProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InlineLoading } from '@/components/ui/loading'
import { useToast } from '@/components/ui/toast'
import { useUserCache } from '@/hooks/data'
import { Clock, Database, Plus, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import APIReviewList from './components/APIReviewList'
import CreateAPIForm from './components/CreateAPIForm'

type TabType = 'create' | 'review'

export default function AdminPage() {
  const { user, isLoggedIn, loading } = useUserCache()
  const router = useRouter()
  const toast = useToast()
  const { t } = useTranslation()

  const [activeTab, setActiveTab] = useState<TabType>('create')
  const [showCreateForm, setShowCreateForm] = useState(false)

  // 权限检查
  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn || !user) {
        // 未登录，返回404
        router.replace('/404')
        return
      }

      // 检查用户角色
      const userRole = user.role?.toUpperCase() || ''
      if (userRole !== 'ADMIN') {
        // 非管理员，返回404
        router.replace('/404')
        return
      }
    }
  }, [loading, isLoggedIn, user, router])

  // 加载状态
  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex items-center justify-center h-64'>
            <InlineLoading />
          </div>
        </div>
      </div>
    )
  }

  // 权限验证失败，不渲染内容（将被重定向）
  if (!isLoggedIn || !user || user.role?.toUpperCase() !== 'ADMIN') {
    return null
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        {/* 页面头部 */}
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-foreground flex items-center gap-3'>
              <Settings className='h-8 w-8 text-primary' />
              {t('admin.systemAdministration')}
            </h1>
            <p className='text-muted-foreground mt-2'>{t('admin.manageAPIServicesDescription')}</p>
          </div>
          <Badge variant='secondary' className='px-3 py-1'>
            <Database className='h-4 w-4 mr-2' />
            {t('admin.adminPanel')}
          </Badge>
        </div>

        {/* Tab 导航 */}
        <div className='border-b border-border mb-6'>
          <nav className='flex space-x-8'>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'create'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              <Plus className='h-4 w-4 inline mr-2' />
              {t('admin.publishAPI')}
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'review'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              <Clock className='h-4 w-4 inline mr-2' />
              {t('admin.reviewAPI')}
            </button>
          </nav>
        </div>

        {/* Tab 内容 */}
        <div className='min-h-[600px]'>
          {activeTab === 'create' && (
            <div className='space-y-6'>
              {/* API发布页面 */}
              <Card className='hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <CardTitle className='text-xl flex items-center gap-2'>
                    <Plus className='h-6 w-6 text-primary' />
                    {t('admin.publishNewAPIService')}
                  </CardTitle>
                  <p className='text-muted-foreground'>{t('admin.publishAPIMarketDescription')}</p>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    size='lg'
                    className='w-full sm:w-auto'
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    {t('admin.startPublishAPI')}
                  </Button>
                </CardContent>
              </Card>

              {/* 其他管理功能预览 */}
              <div className='grid gap-4 md:grid-cols-2'>
                <Card className='opacity-60'>
                  <CardHeader className='pb-4'>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <Settings className='h-5 w-5 text-muted-foreground' />
                      {t('admin.userManagement')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground text-sm mb-4'>
                      {t('admin.manageUserAccounts')}
                    </p>
                    <Button variant='outline' size='sm' disabled className='w-full'>
                      {t('admin.comingSoon')}
                    </Button>
                  </CardContent>
                </Card>

                <Card className='opacity-60'>
                  <CardHeader className='pb-4'>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <Database className='h-5 w-5 text-muted-foreground' />
                      {t('admin.systemStatistics')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground text-sm mb-4'>
                      {t('admin.viewSystemPerformance')}
                    </p>
                    <Button variant='outline' size='sm' disabled className='w-full'>
                      {t('admin.comingSoon')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <APIReviewList
              onAPIApproved={(apiId) => {
                toast.success(t('admin.apiReviewSuccess'))
                console.debug('API审核通过:', apiId)
              }}
            />
          )}
        </div>

        {/* API 发布表单模态框 */}
        {showCreateForm && (
          <CreateAPIForm
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false)
              toast.success(t('admin.apiPublishSuccess'))
            }}
          />
        )}
      </div>
    </div>
  )
}
