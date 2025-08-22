'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { useToast } from '@/components/ui/toast'
import { getMarketAPIs, type MarketAPI, type GetMarketAPIsParams } from '@/services/market-api'
import { Clock, AlertCircle, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { APICardSkeletonGrid, LoadMoreSkeleton } from '@/components/ui/api-card-skeleton'

// 分类映射和标签（如果将来需要使用）
// const CATEGORY_MAP = {
//   'data': 'data',
//   'ai_ml': 'ai',
//   'finance': 'finance', 
//   'social': 'social',
//   'tools': 'tools',
//   'communication': 'communication',
//   'entertainment': 'entertainment',
//   'business': 'business',
//   'other': 'other'
// } as const

// const CATEGORY_LABELS = {
//   'all': 'all',
//   'data': 'data',
//   'ai_ml': 'ai',
//   'finance': 'finance',
//   'tools': 'tools',
//   'communication': 'communication',
//   'entertainment': 'entertainment',
//   'business': 'business',
//   'other': 'other'
// } as const

export default function APIMarketSection() {
  const { t } = useTranslation()
  const toast = useToast()

  // 状态管理
  const [apis, setApis] = useState<MarketAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'total_calls' | 'created_at'>('total_calls')
  
  // 防抖和请求管理
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // 加载API列表
  const loadAPIs = useCallback(async (
    page: number = 1, 
    reset: boolean = false,
    params?: Partial<GetMarketAPIsParams>
  ) => {
    try {
      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      // 创建新的 AbortController
      abortControllerRef.current = new AbortController()
      
      if (reset) {
        setLoading(true)
        setApis([]) // 重置时清空现有数据，显示骨架屏
      } else {
        setLoadingMore(true)
      }
      setError(null)

      const requestParams: GetMarketAPIsParams = {
        page,
        page_size: 50,
        sort_by: sortBy,
        sort_order: 'desc',
        ...params
      }



      // 如果选择了分类，添加分类过滤
      if (selectedCategory && selectedCategory !== 'all') {
        requestParams.category = selectedCategory
      }

      const response = await getMarketAPIs({
        ...requestParams,
        signal: abortControllerRef.current?.signal
      })

      // 完整打印API响应数据
      console.log('=== API Market 完整响应数据 ===')
      console.log(JSON.stringify(response, null, 2))
      console.log('===============================')

      if (response.success) {
        if (reset) {
          setApis(response.data)
        } else {
          setApis(prev => [...prev, ...response.data])
        }
        setHasMore(response.pagination.has_next)
        setCurrentPage(response.pagination.page)
      } else {
        throw new Error(response.message || t.toast.networkError)
      }
    } catch (error: unknown) {
      // 如果是取消的请求，不显示错误
      const errorObj = error as { name?: string; code?: string; message?: string }
      if (errorObj.name === 'AbortError' || 
          errorObj.name === 'CanceledError' || 
          errorObj.code === 'ECONNABORTED' || 
          errorObj.code === 'ERR_CANCELED' ||
          errorObj.message === 'canceled') {
        console.log('请求已取消，不显示错误')
        return
      }
      
      const errorMessage = errorObj.message || t.toast.networkError
      console.error('加载API列表失败:', error)
      setError(errorMessage)
      if (reset) {
        setApis([])
      }
      toast.error(errorMessage)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [selectedCategory, sortBy])

  // 分类和排序变化时重新加载
  useEffect(() => {
    // 清除之前的定时器
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // 立即执行加载
    loadAPIs(1, true)
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [selectedCategory, sortBy, loadAPIs])

  // 分类选择处理
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  // 加载更多
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadAPIs(currentPage + 1, false)
    }
  }



  // 格式化调用次数
  const formatUsageCount = (count: number): string => {
    if (count < 1000) return count.toString()
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
    return `${(count / 1000000).toFixed(1)}M`
  }

  // 组件清理
  useEffect(() => {
    return () => {
      // 清理定时器
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      
      // 取消待处理的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <section id="api-market-section" className="bg-background pb-[60px]">
      <div className="container mx-auto px-4">
        {/* 介绍文案 */}
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground">
            {t.home.apiMarketIntro}
          </p>
        </div>


        {/* 搜索和筛选 */}
        <div className="mb-8 space-y-4">

          
          {/* 分类标签 */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge 
              variant={selectedCategory === 'all' ? 'secondary' : 'outline'} 
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => handleCategorySelect('all')}
            >
              {t.home.categories.all}
            </Badge>
            <Badge 
              variant={selectedCategory === 'ai_ml' ? 'secondary' : 'outline'} 
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => handleCategorySelect('ai_ml')}
            >
              {t.home.categories.ai}
            </Badge>
            <Badge 
              variant={selectedCategory === 'data' ? 'secondary' : 'outline'} 
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => handleCategorySelect('data')}
            >
              {t.home.categories.data}
            </Badge>
            <Badge 
              variant={selectedCategory === 'tools' ? 'secondary' : 'outline'} 
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => handleCategorySelect('tools')}
            >
              {t.home.categories.tools}
            </Badge>
            <Badge 
              variant={selectedCategory === 'finance' ? 'secondary' : 'outline'} 
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => handleCategorySelect('finance')}
            >
              {t.home.categories.finance}
            </Badge>
            <Badge 
              variant={selectedCategory === 'communication' ? 'secondary' : 'outline'} 
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => handleCategorySelect('communication')}
            >
              {t.home.categories.translation}
            </Badge>
            <Badge 
              variant={selectedCategory === 'business' ? 'secondary' : 'outline'} 
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => handleCategorySelect('business')}
            >
              {t.home.categories.validation}
            </Badge>
          </div>

          {/* 排序选项 */}
          <div className="flex justify-center gap-2">
            <Button 
              variant={sortBy === 'total_calls' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('total_calls')}
            >
              {t.home.sorting.popularity}
            </Button>
            <Button 
              variant={sortBy === 'created_at' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('created_at')}
            >
              {t.home.sorting.latest}
            </Button>
          </div>
        </div>

        {/* 错误状态 */}
        {error && !loading && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => loadAPIs(1, true)}>{t.projectDetail.retry}</Button>
          </div>
        )}

        {/* 骨架屏加载状态 */}
        {loading && <APICardSkeletonGrid count={9} />}

        {/* API服务列表 */}
        {!loading && !error && (
          <>
            {apis.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t.apiProvider.noAPIs}</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {apis.map((api) => (
                  <Card key={api.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <Link href={`/project/${api.slug}`} className="block">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            {api.avatar_url && (
                              <Image
                                src={api.avatar_url}
                                alt={api.name}
                                width={24}
                                height={24}
                                className="rounded"
                              />
                            )}
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {api.name}
                            </CardTitle>
                          </div>

                        </div>
                        <CardDescription className="line-clamp-2 h-10">
                          {api.short_description}
                        </CardDescription>
                      </CardHeader>
                    
                      <CardContent>
                        {/* 分类标签 */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          <Badge variant="secondary" className="text-xs">
                            {api.category}
                          </Badge>
                          {api.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* 统计信息 */}
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>~200ms</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground/80 text-center">
                            已调用 {formatUsageCount(api.total_calls)} 次
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1" asChild>
                            <span>
                              <FileText className="h-4 w-4 mr-1" />
                              {t.home.viewDetails}
                            </span>
                          </Button>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
                
                {/* 加载更多时的骨架屏 */}
                {loadingMore && <LoadMoreSkeleton count={6} />}
              </div>
            )}

            {/* 加载更多按钮 */}
            {hasMore && apis.length > 0 && !loadingMore && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleLoadMore}
                >
                  {t.home.loadMore}
                </Button>
              </div>
            )}

            {/* 全部加载完成提示 */}
            {!hasMore && apis.length > 0 && (
              <div className="text-center mt-8">
                <p className="text-muted-foreground text-sm">
                  {t.home.totalCount.replace('{count}', apis.length.toString())}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
