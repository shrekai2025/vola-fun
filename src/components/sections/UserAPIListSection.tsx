'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { useToast } from '@/components/ui/toast'
import { getUserAPIs, deleteUserAPI } from '@/services/user-api'
import type { MarketAPI } from '@/services/market-api'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'

export default function UserAPIListSection() {
  const [apis, setApis] = useState<MarketAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const { t } = useTranslation()
  const toast = useToast()

  // 稳定化翻译对象
  const translations = useMemo(() => t.apiProvider, [t.apiProvider])

  // 加载用户API列表
  const loadUserAPIs = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getUserAPIs({
        page: 1,
        page_size: 50,
        sort_by: 'created_at',
        sort_order: 'desc'
      })
      
      setApis(response.data || [])
    } catch (error: unknown) {
      console.error('加载用户API列表失败:', error)
      const errorMessage = error instanceof Error ? error.message : '加载失败'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, []) // 移除toast依赖避免无限循环

  // 删除API
  const handleDeleteAPI = useCallback(async (apiId: string, apiName: string) => {
    if (!confirm(`确定要删除API "${apiName}" 吗？此操作不可撤销。`)) {
      return
    }

    try {
      setDeleting(apiId)
      await deleteUserAPI(apiId)
      
      // 从列表中移除已删除的API
      setApis(prev => prev.filter(api => api.id !== apiId))
      toast.success('API删除成功')
    } catch (error: unknown) {
      console.error('删除API失败:', error)
      const errorMessage = error instanceof Error ? error.message : '删除失败'
      toast.error(errorMessage)
    } finally {
      setDeleting(null)
    }
  }, []) // 移除toast依赖

  // 格式化日期
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }, [])

  // 获取状态样式
  const getStatusStyle = useCallback((status: string) => {
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
  }, [])

  // 获取状态文本
  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'draft':
        return '草稿'
      case 'published':
        return '已发布'
      case 'deprecated':
        return '已弃用'
      case 'suspended':
        return '已暂停'
      default:
        return status
    }
  }, [])

  useEffect(() => {
    loadUserAPIs()
  }, [loadUserAPIs])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题和创建按钮 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {translations.title}
          </h1>
          <p className="text-muted-foreground">
            {translations.description}
          </p>
        </div>
        <Button asChild size="default">
          <Link href="/api-provider/create" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {translations.createNew}
          </Link>
        </Button>
      </div>

      {/* 加载状态 */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">{translations.loading}</p>
          </div>
        </div>
      ) : apis.length === 0 ? (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Plus className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {translations.noAPIs}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {translations.noAPIsDescription}
          </p>
          <Button asChild>
            <Link href="/api-provider/create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {translations.createFirst}
            </Link>
          </Button>
        </div>
      ) : (
        /* API列表 */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apis.map((api) => (
            <Card key={api.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold truncate">
                      {api.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusStyle(api.status)} text-xs`}
                      >
                        {getStatusText(api.status)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {api.category.replace('_', '/')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {api.short_description || '暂无描述'}
                </p>
                
                <div className="space-y-2 text-xs text-muted-foreground mb-4">
                  <div className="flex justify-between">
                    <span>调用量：</span>
                    <span>{api.total_calls?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>创建时间：</span>
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
                        编辑Project
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
                        查看Endpoints
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
                    {deleting === api.id ? '删除中...' : '删除API'}
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
