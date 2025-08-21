'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { useToast } from '@/components/ui/toast'
import { getMarketAPIs, searchMarketAPIs, getMarketAPIsByCategory, type MarketAPI, type GetMarketAPIsParams } from '@/services/market-api'
import { Search, Star, Clock, DollarSign, Loader2, AlertCircle, ExternalLink, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { APICardSkeletonGrid, LoadMoreSkeleton } from '@/components/ui/api-card-skeleton'

// 分类映射
const CATEGORY_MAP = {
  'data': 'data',
  'ai_ml': 'ai',
  'finance': 'finance', 
  'social': 'social',
  'tools': 'tools',
  'communication': 'communication',
  'entertainment': 'entertainment',
  'business': 'business',
  'other': 'other'
} as const

const CATEGORY_LABELS = {
  'all': 'all',
  'data': 'data',
  'ai_ml': 'ai',
  'finance': 'finance',
  'tools': 'tools',
  'communication': 'communication',
  'entertainment': 'entertainment',
  'business': 'business',
  'other': 'other'
} as const

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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'total_calls' | 'rating' | 'created_at'>('total_calls')
  
  // 防抖和请求管理
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const abortControllerRef = useRef<AbortController>()

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

      // 如果有搜索词，使用搜索接口
      if (searchTerm.trim()) {
        requestParams.search = searchTerm.trim()
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
        throw new Error(response.message || '获取API列表失败')
      }
    } catch (error: any) {
      // 如果是取消的请求，不显示错误
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        console.log('请求已取消')
        return
      }
      
      console.error('加载API列表失败:', error)
      setError(error.message || '加载失败，请稍后重试')
      if (reset) {
        setApis([])
      }
      toast.error(error.message || '加载API列表失败')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [searchTerm, selectedCategory, sortBy, toast])

  // 防抖搜索效果
  useEffect(() => {
    // 清除之前的定时器
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    // 设置新的防抖定时器
    searchTimeoutRef.current = setTimeout(() => {
      loadAPIs(1, true)
    }, searchTerm ? 300 : 0) // 搜索时防抖300ms，其他立即执行
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchTerm, selectedCategory, sortBy])

  // 搜索处理 - 只更新搜索词，实际请求由 useEffect 处理
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

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

  // 格式化价格显示
  const formatPrice = (totalCalls: number): string => {
    if (totalCalls === 0) return '免费试用'
    if (totalCalls < 1000) return `¥0.01/次`
    if (totalCalls < 10000) return `¥0.005/次`
    return `¥0.002/次`
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
    <section id="api-market-section" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* 标题 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-center">{t.home.marketTitle}</h2>
          <p className="text-muted-foreground text-center">
            {t.home.marketSubtitle}
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder={t.home.searchPlaceholder}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
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
              热门度
            </Button>
            <Button 
              variant={sortBy === 'rating' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('rating')}
            >
              评分
            </Button>
            <Button 
              variant={sortBy === 'created_at' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('created_at')}
            >
              最新
            </Button>
          </div>
        </div>

        {/* 错误状态 */}
        {error && !loading && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => loadAPIs(1, true)}>重试</Button>
          </div>
        )}

        {/* 骨架屏加载状态 */}
        {loading && <APICardSkeletonGrid count={9} />}

        {/* API服务列表 */}
        {!loading && !error && (
          <>
            {apis.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">暂无API服务</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {apis.map((api) => (
                  <Card key={api.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
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
                        {api.rating && api.rating > 0 && (
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 fill-warning text-warning" />
                            <span>{api.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatPrice(api.total_calls)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>~200ms</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground/80">
                          已调用 {formatUsageCount(api.total_calls)} 次
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <FileText className="h-4 w-4 mr-1" />
                          查看详情
                        </Button>
                        {api.documentation_url && (
                          <Button size="sm" variant="outline" asChild>
                            <Link href={api.documentation_url} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
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
                  已显示全部 {apis.length} 个API服务
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
