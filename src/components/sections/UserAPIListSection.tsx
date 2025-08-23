'use client'

import { useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { useToast } from '@/components/ui/toast'
import { useUserCache } from '@/hooks/useUserCache'
import { useUserAPIList } from '@/hooks/useUnifiedData'
import { deleteUserAPI, updateUserAPI, clearUserIdCache } from '@/services/user-api'
import { dataManager } from '@/lib/data-manager'
import type { MarketAPI } from '@/services/market-api'
import type { GetUserAPIsParams } from '@/services/user-api'
import { Plus, Eye, Edit, Trash2, Info } from 'lucide-react'
import { APICardSkeletonGrid } from '@/components/ui/api-card-skeleton'

// 纯函数，移到组件外部避免重新创建
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
    case 'published':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
    case 'deprecated':
      return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
    case 'suspended':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
  }
}

const getStatusText = (status: string, t: any) => {
  switch (status) {
    case 'draft':
      return t.apiProvider.status.draft
    case 'published':
      return t.apiProvider.status.published
    case 'deprecated':
      return t.apiProvider.status.deprecated
    case 'suspended':
      return t.apiProvider.status.suspended
    default:
      return status
  }
}

export default function UserAPIListSection() {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const { t } = useTranslation()
  const toast = useToast()
  const { isLoggedIn, loading: userLoading } = useUserCache()
  
  // 固定查询参数，避免对象引用每次变化导致Hook重复执行
  const queryParams: GetUserAPIsParams = useMemo(() => ({
    page: 1,
    page_size: 50,
    sort_by: 'created_at',
    sort_order: 'desc'
  }), [])

  // 使用统一数据管理Hook，启用页面级强制刷新
  const { 
    data: apis, 
    loading: apiLoading, 
    error, 
    refresh: refreshAPIs 
  } = useUserAPIList(queryParams, true)

  const loading = userLoading || apiLoading

  // 删除API
  const handleDeleteAPI = useCallback(async (apiId: string, apiName: string) => {
    if (!confirm(t.confirmDialog.deleteAPIMessage.replace('{name}', apiName))) {
      return
    }

    try {
      setDeleting(apiId)
      await deleteUserAPI(apiId)
      
      // 刷新API列表以反映删除结果（强制不使用缓存）
      await refreshAPIs(true)
      toast.success(t.toast.apiDeleteSuccess)
    } catch (error: unknown) {
      console.error('删除API失败', error)
      const errorMessage = error instanceof Error ? error.message : t.errors.deleteAPIFailed
      toast.error(errorMessage)
    } finally {
      setDeleting(null)
    }
  }, [refreshAPIs, toast, t])

  // 切换API公开状态
  const handleTogglePublic = useCallback(async (apiId: string, currentPublic: boolean) => {
    try {
      setUpdating(apiId)
      await updateUserAPI(apiId, { is_public: !currentPublic })
      
      // 刷新API列表以反映更新结果
      await refreshAPIs(true)
      toast.success(currentPublic ? t.toast.apiSetToPrivate : t.toast.apiSetToPublic)
    } catch (error: unknown) {
      console.error('更新API状态失败', error)
      const errorMessage = error instanceof Error ? error.message : t.toast.apiUpdateFailed
      toast.error(`${t.toast.apiUpdateFailed}：${errorMessage}`)
    } finally {
      setUpdating(null)
    }
  }, [refreshAPIs, toast])

  // useUserAPIList Hook会自动处理数据加载，无需手动useEffect

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题和创建按钮 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t.apiProvider.title}
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">
              {t.apiProvider.description}
            </p>
            <div className="relative group">
              <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
              <div className="absolute left-0 top-6 w-80 p-3 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <p className="text-sm text-foreground">
                  {t.apiProvider.description}{' '}
                  <a 
                    href="/docs" 
                    className="text-primary hover:text-primary/80 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.nav.docs}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <Button asChild size="default">
          <Link href="/api-provider/create" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t.apiProvider.createNew}
          </Link>
        </Button>
      </div>

      {/* 错误状态 */}
      {error && !loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <Info className="w-12 h-12 text-destructive" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t.errors.loadAPIsFailed}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {error}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => refreshAPIs()} variant="default">
              {t.projectDetail.retry}
            </Button>
            <Button 
              onClick={() => {
                // 清除所有相关缓存并重试
                clearUserIdCache()
                dataManager.clearCache('user-apis')
                dataManager.clearCache('user-info')
                refreshAPIs(true)
              }}
              variant="outline"
            >
              清除缓存重试
            </Button>
          </div>
        </div>
      ) :
      /* 加载状态 - 使用骨架屏 */
      loading ? (
        <APICardSkeletonGrid count={9} />
      ) : !isLoggedIn ? (
        /* 用户未登录状态 */
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Plus className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t.apiProvider.create.loginPrompt}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {t.apiProvider.create.loginPrompt}
          </p>
        </div>
      ) : (!apis || apis.length === 0) ? (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Plus className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t.apiProvider.noAPIs}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {t.apiProvider.noAPIsDescription}
          </p>
          <Button asChild>
            <Link href="/api-provider/create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {t.apiProvider.createFirst}
            </Link>
          </Button>
        </div>
      ) : (
        /* API列表 */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apis?.map((api) => (
            <Card key={api.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold truncate">
                      <Link 
                        href={`/project/${api.slug}`}
                        className="hover:text-primary transition-colors cursor-pointer"
                      >
                        {api.name}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusStyle(api.status)} text-xs`}
                      >
                        {getStatusText(api.status, t)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {api.category.replace('_', '/')}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Switch for is_public */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleTogglePublic(api.id, api.is_public || false)}
                      disabled={updating === api.id}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                        api.is_public 
                          ? 'bg-primary' 
                          : 'bg-muted-foreground/20'
                      } ${updating === api.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      title={api.is_public ? t.toast.clickToSetPrivate : t.toast.clickToSetPublic}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-background transition-transform ${
                          api.is_public ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {api.short_description || t.apiProvider.noDescription}
                </p>
                
                <div className="space-y-2 text-xs text-muted-foreground mb-4">
                  <div className="flex justify-between">
                    <span>{t.apiProvider.totalCalls}：</span>
                    <span>{api.total_calls?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.apiProvider.createdAt}：</span>
                    <span>{formatDate(api.created_at)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      asChild
                    >
                      <Link href={`/api-provider/edit/${api.id}`}>
                        <Edit className="w-3 h-3 mr-1" />
                        {t.apiProvider.editProject}
                      </Link>
                    </Button>
                    <Button
                      variant="outline" 
                      size="sm"
                      className="flex-1 text-xs"
                      asChild
                    >
                      <Link href={`/api-provider/${api.id}/endpoints`}>
                        <Eye className="w-3 h-3 mr-1" />
                        {t.apiProvider.viewEndpoints}
                      </Link>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAPI(api.id, api.name)}
                    disabled={deleting === api.id}
                    className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    {deleting === api.id ? t.apiProvider.deleting : t.apiProvider.deleteAPI}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
