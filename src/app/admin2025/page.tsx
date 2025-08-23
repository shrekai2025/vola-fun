'use client'

import { useTranslation } from '@/components/providers/LanguageProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { useUserCache } from '@/hooks/useUserCache'
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
  const { t: _t } = useTranslation()

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
            <div className='animate-pulse text-muted-foreground'>Loading...</div>
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
              System Administration
            </h1>
            <p className='text-muted-foreground mt-2'>
              Manage API services and system configuration
            </p>
          </div>
          <Badge variant='secondary' className='px-3 py-1'>
            <Database className='h-4 w-4 mr-2' />
            Admin Panel
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
              发布API
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
              审核API
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
                    发布新的API服务
                  </CardTitle>
                  <p className='text-muted-foreground'>在API市场中发布新的API服务</p>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    size='lg'
                    className='w-full sm:w-auto'
                  >
                    <Plus className='h-4 w-4 mr-2' />
                    开始发布API
                  </Button>
                </CardContent>
              </Card>

              {/* 其他管理功能预览 */}
              <div className='grid gap-4 md:grid-cols-2'>
                <Card className='opacity-60'>
                  <CardHeader className='pb-4'>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <Settings className='h-5 w-5 text-muted-foreground' />
                      用户管理
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground text-sm mb-4'>管理用户账户和权限设置</p>
                    <Button variant='outline' size='sm' disabled className='w-full'>
                      即将推出
                    </Button>
                  </CardContent>
                </Card>

                <Card className='opacity-60'>
                  <CardHeader className='pb-4'>
                    <CardTitle className='text-lg flex items-center gap-2'>
                      <Database className='h-5 w-5 text-muted-foreground' />
                      系统统计
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground text-sm mb-4'>查看系统性能和使用统计数据</p>
                    <Button variant='outline' size='sm' disabled className='w-full'>
                      即将推出
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <APIReviewList
              onAPIApproved={(apiId) => {
                toast.success('API审核通过成功!')
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
              toast.success('API发布成功!')
            }}
          />
        )}
      </div>
    </div>
  )
}
