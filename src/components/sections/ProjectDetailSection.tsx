'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useTranslation } from '@/components/providers/LanguageProvider'
import { InlineLoading, PageLoading } from '@/components/ui/loading'
import { APIService, EndpointService, type API, type APIEndpoint } from '@/lib/api'
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Shield,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ProjectDetailSectionProps {
  apiId: string
}

export function ProjectDetailSection({ apiId }: ProjectDetailSectionProps) {
  const { t } = useTranslation()
  const router = useRouter()

  // 状态管理
  const [api, setApi] = useState<API | null>(null)
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([])
  const [loading, setLoading] = useState(true)
  const [endpointsLoading, setEndpointsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState('description')

  // 加载API详情
  useEffect(() => {
    const loadAPIDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await APIService.get(apiId)

        if (response.success) {
          setApi(response.data)
        } else {
          throw new Error(response.message || 'API详情加载失败')
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '加载失败，请稍后重试'
        console.error('加载API详情失败:', error)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (apiId) {
      loadAPIDetail()
    }
  }, [apiId]) // 移除toast依赖

  // 加载API端点列表
  const loadEndpoints = useCallback(async (apiId: string) => {
    try {
      setEndpointsLoading(true)
      const response = await EndpointService.list(apiId)
      if (response.success) {
        setEndpoints(response.data)
      }
    } catch (error) {
      console.error('加载端点列表失败:', error)
      // 端点加载失败不阻塞页面展示
    } finally {
      setEndpointsLoading(false)
    }
  }, [])

  // 当API加载完成时，加载端点
  useEffect(() => {
    if (api?.id) {
      loadEndpoints(api.id)
    }
  }, [api?.id, loadEndpoints])

  // 返回上一页
  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  // 格式化调用次数
  const formatUsageCount = useCallback((count: number): string => {
    if (count < 1000) return count.toString()
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
    return `${(count / 1000000).toFixed(1)}M`
  }, [])

  // 切换端点展开状态
  const toggleEndpoint = useCallback((endpointId: string) => {
    setExpandedEndpoints((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(endpointId)) {
        newSet.delete(endpointId)
      } else {
        newSet.add(endpointId)
      }
      return newSet
    })
  }, [])

  // 获取HTTP方法的样式
  const getMethodStyle = useCallback((method: string) => {
    switch (method.toLowerCase()) {
      case 'get':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
      case 'post':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
      case 'put':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
      case 'patch':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
      case 'delete':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
    }
  }, [])

  // 检查是否有有效的相关链接
  const hasRelatedLinks = useMemo(() => {
    if (!api) return false
    return !!(api.documentation_url || api.website_url || api.terms_url || api.health_check_url)
  }, [api])

  // 格式化日期
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }, [])

  // 获取服务状态显示
  const getStatusInfo = useCallback(
    (status: string) => {
      switch (status) {
        case 'published':
          return {
            text: t('projectDetail.activeService'),
            color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          }
        case 'draft':
          return {
            text: 'Draft',
            color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
          }
        case 'deprecated':
          return {
            text: t('projectDetail.deprecatedService'),
            color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
          }
        default:
          return {
            text: 'Unknown',
            color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
          }
      }
    },
    [t]
  )

  // 加载状态
  if (loading) {
    return <PageLoading text={t('projectDetail.loading')} />
  }

  // 错误状态
  if (error || !api) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center py-20'>
          <AlertCircle className='h-16 w-16 text-destructive mx-auto mb-4' />
          <h2 className='text-2xl font-bold mb-2'>{t('projectDetail.loadFailed')}</h2>
          <p className='text-muted-foreground mb-6'>{error || t('projectDetail.apiNotFound')}</p>
          <div className='space-x-4'>
            <Button onClick={handleBack} variant='outline'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              {t('projectDetail.backButton')}
            </Button>
            <Button onClick={() => window.location.reload()}>{t('projectDetail.retry')}</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* 返回按钮 */}
      <div className='mb-6'>
        <Button onClick={handleBack} variant='ghost' className='pl-0 hover:pl-2 transition-all'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          {t('projectDetail.backButton')}
        </Button>
      </div>

      <div className='grid gap-6 lg:gap-8 lg:grid-cols-3'>
        {/* 左侧主要内容 */}
        <div className='lg:col-span-2 space-y-6'>
          {/* API简介板块 */}
          <Card>
            <CardHeader>
              <div className='flex flex-col lg:flex-row lg:items-start justify-between gap-6'>
                {/* 左侧基本信息 */}
                <div className='flex-1'>
                  <div className='flex items-start space-x-4'>
                    {api.avatar_url && (
                      <Image
                        src={api.avatar_url}
                        alt={api.name}
                        width={64}
                        height={64}
                        className='rounded-lg flex-shrink-0'
                      />
                    )}
                    <div className='flex-1 min-w-0'>
                      <CardTitle className='text-2xl font-bold mb-2'>{api.name}</CardTitle>
                      <CardDescription className='text-base mb-4'>
                        {api.short_description}
                      </CardDescription>

                      {/* 状态、分类、标签、统计信息 */}
                      <div className='flex flex-wrap items-center gap-2'>
                        <Badge
                          variant='outline'
                          className={`text-sm ${getStatusInfo(api.status).color}`}
                        >
                          <Shield className='h-3 w-3 mr-1' />
                          {getStatusInfo(api.status).text}
                        </Badge>
                        <Badge variant='secondary' className='text-sm'>
                          {api.category}
                        </Badge>
                        {api.tags &&
                          api.tags.length > 0 &&
                          api.tags.map((tag) => (
                            <Badge key={tag} variant='outline' className='text-sm'>
                              {tag}
                            </Badge>
                          ))}

                        {/* 统计信息 */}
                        <div className='flex items-center gap-3 ml-2'>
                          <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                            <Clock className='h-3 w-3' />
                            <span>~200ms</span>
                          </div>
                          <div className='flex items-center gap-1 text-sm text-muted-foreground'>
                            <Activity className='h-3 w-3' />
                            <span>{formatUsageCount(api.total_calls)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Description和Endpoints切换标签 */}
          <div className='space-y-6'>
            {/* 自定义Tab切换器 */}
            <div className='border-b border-border'>
              <div className='flex space-x-8'>
                <Button
                  variant='ghost'
                  onClick={() => setActiveTab('description')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors h-auto rounded-none ${
                    activeTab === 'description'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }`}
                >
                  {t('projectDetail.description')}
                </Button>
                <Button
                  variant='ghost'
                  onClick={() => setActiveTab('endpoints')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 h-auto rounded-none ${
                    activeTab === 'endpoints'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                  }`}
                >
                  {t('projectDetail.endpoints')}
                  <Zap className='h-3 w-3' />
                </Button>
              </div>
            </div>

            {/* Tab内容 */}
            <div className='min-h-[200px]'>
              {activeTab === 'description' && (
                <div>
                  {api.documentation_markdown ? (
                    <div className='prose prose-sm max-w-none dark:prose-invert'>
                      <div className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>
                        {api.documentation_markdown}
                      </div>
                    </div>
                  ) : (
                    <div className='text-center py-8 text-muted-foreground'>
                      <FileText className='h-8 w-8 mx-auto mb-2 opacity-50' />
                      <p>{t('projectDetail.noDescription')}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'endpoints' && (
                <div>
                  {endpointsLoading ? (
                    <div className='flex items-center justify-center py-8'>
                      <InlineLoading text={t('projectDetail.loadingEndpoints')} size='md' />
                    </div>
                  ) : endpoints.length > 0 ? (
                    <div className='space-y-4'>
                      {endpoints.map((endpoint) => (
                        <div key={endpoint.id} className='border rounded-lg'>
                          <div
                            className='flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors'
                            onClick={() => toggleEndpoint(endpoint.id)}
                          >
                            <div className='flex items-center gap-3 flex-1'>
                              {expandedEndpoints.has(endpoint.id) ? (
                                <ChevronDown className='w-4 h-4 text-muted-foreground' />
                              ) : (
                                <ChevronRight className='w-4 h-4 text-muted-foreground' />
                              )}
                              <Badge
                                variant='outline'
                                className={`${getMethodStyle(endpoint.method)} text-xs font-mono`}
                              >
                                {endpoint.method.toUpperCase()}
                              </Badge>
                              <div className='flex-1 min-w-0'>
                                <p className='font-medium truncate'>{endpoint.path}</p>
                                <p className='text-sm text-muted-foreground truncate'>
                                  {endpoint.name}
                                </p>
                              </div>
                            </div>

                            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                              <span>
                                ${endpoint.price_per_call}/{t('projectDetail.calls')}
                              </span>
                              <span>
                                {formatUsageCount(endpoint.total_calls)} {t('projectDetail.calls')}
                              </span>
                            </div>
                          </div>

                          {expandedEndpoints.has(endpoint.id) && (
                            <div className='border-t bg-muted/20 p-4'>
                              <div className='space-y-4'>
                                <div>
                                  <h4 className='font-medium mb-2'>
                                    {t('projectDetail.endpointDescription')}
                                  </h4>
                                  <p className='text-sm text-muted-foreground'>
                                    {endpoint.description || t('projectDetail.noDescription')}
                                  </p>
                                </div>

                                {endpoint.query_params &&
                                  Object.keys(endpoint.query_params).length > 0 && (
                                    <div>
                                      <h4 className='font-medium mb-2'>
                                        {t('projectDetail.queryParams')}
                                      </h4>
                                      <pre className='text-xs bg-background p-3 rounded overflow-x-auto'>
                                        {JSON.stringify(endpoint.query_params, null, 2)}
                                      </pre>
                                    </div>
                                  )}

                                {endpoint.body_params &&
                                  Object.keys(endpoint.body_params).length > 0 && (
                                    <div>
                                      <h4 className='font-medium mb-2'>
                                        {t('projectDetail.bodyParams')}
                                      </h4>
                                      <pre className='text-xs bg-background p-3 rounded overflow-x-auto'>
                                        {JSON.stringify(endpoint.body_params, null, 2)}
                                      </pre>
                                    </div>
                                  )}

                                {endpoint.response_params &&
                                  Object.keys(endpoint.response_params).length > 0 && (
                                    <div>
                                      <h4 className='font-medium mb-2'>
                                        {t('projectDetail.responseExample')}
                                      </h4>
                                      <pre className='text-xs bg-background p-3 rounded overflow-x-auto'>
                                        {JSON.stringify(endpoint.response_params, null, 2)}
                                      </pre>
                                    </div>
                                  )}

                                <div className='flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t'>
                                  {endpoint.avg_response_time && endpoint.avg_response_time > 0 && (
                                    <span>
                                      {t('projectDetail.avgResponseTime')}:{' '}
                                      {endpoint.avg_response_time}ms
                                    </span>
                                  )}
                                  {endpoint.success_rate !== null &&
                                    endpoint.success_rate !== undefined && (
                                      <span>
                                        {t('projectDetail.successRate')}:{' '}
                                        {(endpoint.success_rate * 100).toFixed(1)}%
                                      </span>
                                    )}
                                  <span>
                                    {t('projectDetail.endpointStatus')}:{' '}
                                    {endpoint.is_active
                                      ? t('projectDetail.active')
                                      : t('projectDetail.inactive')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-8 text-muted-foreground'>
                      <Zap className='h-8 w-8 mx-auto mb-2 opacity-50' />
                      <p>{t('projectDetail.noEndpoints')}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧边栏 */}
        <div className='space-y-6'>
          {/* Related Links板块 */}
          {hasRelatedLinks && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>{t('projectDetail.relatedLinks')}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {api.documentation_url && (
                  <Button variant='outline' size='sm' className='w-full justify-start' asChild>
                    <Link href={api.documentation_url} target='_blank'>
                      <FileText className='h-4 w-4 mr-2' />
                      {t('projectDetail.viewDocs')}
                      <ExternalLink className='h-3 w-3 ml-auto' />
                    </Link>
                  </Button>
                )}
                {api.website_url && (
                  <Button variant='outline' size='sm' className='w-full justify-start' asChild>
                    <Link href={api.website_url} target='_blank'>
                      <Globe className='h-4 w-4 mr-2' />
                      {t('projectDetail.officialWebsite')}
                      <ExternalLink className='h-3 w-3 ml-auto' />
                    </Link>
                  </Button>
                )}
                {api.terms_url && (
                  <Button variant='outline' size='sm' className='w-full justify-start' asChild>
                    <Link href={api.terms_url} target='_blank'>
                      <FileText className='h-4 w-4 mr-2' />
                      {t('projectDetail.termsOfService')}
                      <ExternalLink className='h-3 w-3 ml-auto' />
                    </Link>
                  </Button>
                )}
                {api.health_check_url && (
                  <Button variant='outline' size='sm' className='w-full justify-start' asChild>
                    <Link href={api.health_check_url} target='_blank'>
                      <Activity className='h-4 w-4 mr-2' />
                      {t('projectDetail.healthCheck')}
                      <ExternalLink className='h-3 w-3 ml-auto' />
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* 基本信息 */}
          <Card>
            <CardContent className='space-y-3 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>{t('projectDetail.createdAt')}</span>
                <span>{formatDate(api.created_at)}</span>
              </div>

              <div className='flex justify-between'>
                <span className='text-muted-foreground'>{t('projectDetail.updatedAt')}</span>
                <span>{formatDate(api.updated_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
