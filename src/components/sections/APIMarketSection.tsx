/**
 * APIMarketSection V2 - 使用统一数据管理器
 * 优化网络请求、避免重复加载、提升性能
 */

'use client'

import { useTranslation } from '@/components/providers/LanguageProvider'
import { APICardSkeletonGrid } from '@/components/ui/api-card-skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAPIList } from '@/hooks/data'
import type { APIListParams } from '@/lib/api'
import type { APICategory } from '@/types/api/apis'
import { AlertCircle, Clock, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function APIMarketSection() {
  const { t } = useTranslation()

  // 筛选和排序状态
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'total_calls' | 'created_at'>('total_calls')
  const [currentPage, setCurrentPage] = useState(1)

  // 构建查询参数
  const queryParams = useMemo((): APIListParams => {
    const params: APIListParams = {
      page: currentPage,
      page_size: 50,
      sort_by: sortBy,
      sort_order: 'desc',
      status: 'published',
      is_public: true,
    }

    if (selectedCategory && selectedCategory !== 'all') {
      params.category = selectedCategory as APICategory
    }

    return params
  }, [currentPage, sortBy, selectedCategory])

  // 使用统一数据管理Hook，启用页面级强制刷新
  const { data: apiResponse, loading, error, refresh } = useAPIList(queryParams, true)

  // 从响应中提取数据
  const apis = apiResponse || []
  const hasMore = false // TODO: 从分页信息中获取
  const [loadingMore, setLoadingMore] = useState(false)

  // 分类选择处理
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  // 排序变化处理
  const handleSortChange = (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy)
    setCurrentPage(1)
  }

  // 加载更多（暂时保留原有逻辑，后续可以优化为使用数据管理器）
  const handleLoadMore = async () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true)
      setCurrentPage((prev) => prev + 1)
      // TODO: 实现增量加载逻辑
      setLoadingMore(false)
    }
  }

  // 格式化调用次数
  const formatUsageCount = (count: number): string => {
    if (count < 1000) return count.toString()
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
    return `${(count / 1000000).toFixed(1)}M`
  }

  // 格式化响应时间显示
  const formatResponseTime = (time?: number): string => {
    if (!time || time <= 0) return '~200ms'
    if (time >= 1000) {
      return `~${(time / 1000).toFixed(1)}s`
    } else {
      return `~${Math.round(time)}ms`
    }
  }

  return (
    <section id='api-market-section' className='bg-background pb-[60px]'>
      <div className='container mx-auto px-4'>
        {/* 介绍文案 */}
        <div className='text-center mb-8'>
          <p className='text-lg text-muted-foreground'>{t('home.apiMarketIntro')}</p>
        </div>

        {/* 搜索和筛选 */}
        <div className='mb-8 space-y-4'>
          {/* 分类标签 */}
          <div className='flex flex-wrap gap-2 justify-center'>
            <Badge
              variant={selectedCategory === 'all' ? 'secondary' : 'outline'}
              className='cursor-pointer hover:bg-secondary/80'
              onClick={() => handleCategorySelect('all')}
            >
              {t('home.categories.all')}
            </Badge>
            <Badge
              variant={selectedCategory === 'ai_ml' ? 'secondary' : 'outline'}
              className='cursor-pointer hover:bg-accent/50'
              onClick={() => handleCategorySelect('ai_ml')}
            >
              {t('home.categories.ai')}
            </Badge>
            <Badge
              variant={selectedCategory === 'data' ? 'secondary' : 'outline'}
              className='cursor-pointer hover:bg-accent/50'
              onClick={() => handleCategorySelect('data')}
            >
              {t('home.categories.data')}
            </Badge>
            <Badge
              variant={selectedCategory === 'tools' ? 'secondary' : 'outline'}
              className='cursor-pointer hover:bg-accent/50'
              onClick={() => handleCategorySelect('tools')}
            >
              {t('home.categories.tools')}
            </Badge>
            <Badge
              variant={selectedCategory === 'finance' ? 'secondary' : 'outline'}
              className='cursor-pointer hover:bg-accent/50'
              onClick={() => handleCategorySelect('finance')}
            >
              {t('home.categories.finance')}
            </Badge>
            <Badge
              variant={selectedCategory === 'communication' ? 'secondary' : 'outline'}
              className='cursor-pointer hover:bg-accent/50'
              onClick={() => handleCategorySelect('communication')}
            >
              {t('home.categories.translation')}
            </Badge>
            <Badge
              variant={selectedCategory === 'business' ? 'secondary' : 'outline'}
              className='cursor-pointer hover:bg-accent/50'
              onClick={() => handleCategorySelect('business')}
            >
              {t('home.categories.validation')}
            </Badge>
          </div>

          {/* 排序选项 */}
          <div className='flex justify-center gap-2'>
            <Button
              variant={sortBy === 'total_calls' ? 'secondary' : 'ghost'}
              size='sm'
              onClick={() => handleSortChange('total_calls')}
            >
              {t('home.sorting.popularity')}
            </Button>
            <Button
              variant={sortBy === 'created_at' ? 'secondary' : 'ghost'}
              size='sm'
              onClick={() => handleSortChange('created_at')}
            >
              {t('home.sorting.latest')}
            </Button>
          </div>
        </div>

        {/* 错误状态 */}
        {error && !loading && (
          <div className='text-center py-8'>
            <AlertCircle className='h-12 w-12 text-destructive mx-auto mb-4' />
            <p className='text-muted-foreground mb-4'>{error}</p>
            <Button onClick={() => refresh()}>重试</Button>
          </div>
        )}

        {/* 骨架屏加载状态 */}
        {loading && <APICardSkeletonGrid count={9} />}

        {/* API服务列表 */}
        {!loading && !error && (
          <>
            {apis.length === 0 ? (
              <div className='text-center py-8'>
                <p className='text-muted-foreground'>{t('home.noResults')}</p>
              </div>
            ) : (
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {apis.map((api) => (
                  <Card
                    key={api.id}
                    className='hover:shadow-lg transition-shadow cursor-pointer group'
                  >
                    <CardHeader>
                      <div className='flex justify-between items-start'>
                        <div className='flex items-center space-x-2'>
                          {api.avatar_url && (
                            <Image
                              src={api.avatar_url}
                              alt={api.name}
                              width={24}
                              height={24}
                              className='rounded'
                            />
                          )}
                          <CardTitle className='text-lg group-hover:text-primary transition-colors'>
                            {api.name}
                          </CardTitle>
                        </div>
                      </div>
                      <CardDescription className='line-clamp-2 h-10'>
                        {api.short_description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      {/* 分类标签 */}
                      <div className='flex flex-wrap gap-1 mb-4'>
                        <Badge variant='secondary' className='text-xs'>
                          {api.category}
                        </Badge>
                        {api.tags?.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant='outline' className='text-xs'>
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* 统计信息 */}
                      <div className='space-y-2 text-sm mb-4'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-1'>
                            <Clock className='w-4 h-4 text-muted-foreground' />
                            <span className='text-xs text-muted-foreground'>
                              {formatUsageCount(api.total_calls || 0)} {t('home.usageCount')}
                            </span>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <FileText className='w-4 h-4 text-muted-foreground' />
                            <span className='text-xs text-muted-foreground'>
                              {formatResponseTime(api.estimated_response_time || 0)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className='flex space-x-2'>
                        <Button className='flex-1' size='sm' asChild>
                          <Link href={`/project/${api.id}`}>{t('home.viewDetails')}</Link>
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='w-8 h-8 p-0'
                          onClick={(e) => {
                            e.preventDefault()
                            // TODO: 添加到收藏
                          }}
                        >
                          ♡
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* 加载更多按钮 */}
            {hasMore && (
              <div className='text-center mt-8'>
                <Button onClick={handleLoadMore} disabled={loadingMore} size='lg' variant='outline'>
                  {loadingMore ? t('common.loading') : t('home.loadMore')}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
