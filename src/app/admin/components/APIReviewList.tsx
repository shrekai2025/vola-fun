'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useToast } from '@/components/ui/toast'
import { useI18n } from '@/hooks'
import { APIService, type API } from '@/lib/api'
import type { PaginatedResponse } from '@/lib/api/types'
import { AlertCircle, CheckCircle, Clock, ExternalLink, Loader2, User } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

interface APIReviewListProps {
  onAPIApproved?: (apiId: string) => void
}

export default function APIReviewList({ onAPIApproved }: APIReviewListProps) {
  const { t } = useI18n()
  const [apis, setApis] = useState<API[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approving, setApproving] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginatedResponse<API>['pagination'] | null>(null)
  const toast = useToast()

  const PAGE_SIZE = 10 // 每页显示10个API

  // 生成页码数组的辅助函数
  const generatePageNumbers = (current: number, total: number) => {
    const pages: (number | 'ellipsis')[] = []
    const showEllipsis = total > 7

    if (!showEllipsis) {
      // 如果页数不多，显示所有页码
      for (let i = 1; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 复杂页码逻辑
      pages.push(1)

      if (current > 4) {
        pages.push('ellipsis')
      }

      const start = Math.max(2, current - 1)
      const end = Math.min(total - 1, current + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== total) {
          pages.push(i)
        }
      }

      if (current < total - 3) {
        pages.push('ellipsis')
      }

      if (total > 1) {
        pages.push(total)
      }
    }

    return pages
  }

  // 加载待审核的API列表
  const loadDraftAPIs = useCallback(
    async (page: number = currentPage) => {
      try {
        setLoading(true)
        setError(null)

        console.debug('🔄 [APIReviewList] 开始加载待审核API列表，页码:', page)

        const response = await APIService.list({
          status: 'draft',
          page: page,
          page_size: PAGE_SIZE,
        })

        setApis(response.data)
        setPagination(response.pagination)
        console.debug(
          '✅ [APIReviewList] 待审核API列表加载成功:',
          response.data.length,
          '个API，总计:',
          response.pagination.total
        )
      } catch (error: unknown) {
        console.error('❌ [APIReviewList] 加载API列表失败:', error)
        setError(error instanceof Error ? error.message : t('admin.apiReview.loadError'))
      } finally {
        setLoading(false)
      }
    },
    [currentPage, t]
  )

  // 组件加载时获取数据
  useEffect(() => {
    loadDraftAPIs(currentPage)
  }, [currentPage, loadDraftAPIs])

  // 页码变化处理
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // 审核通过API
  const handleApprove = async (api: API) => {
    if (approving) return

    try {
      setApproving(api.id)
      console.debug('🔄 [APIReviewList] 开始审核通过 API:', api.name)

      await APIService.update(api.id, { status: 'published' })

      console.debug('✅ [APIReviewList] API审核通过成功:', api.name)

      // 从列表中移除已审核的API
      setApis((prev) => prev.filter((item) => item.id !== api.id))

      // 更新分页信息
      if (pagination) {
        const newTotal = pagination.total - 1
        const newTotalPages = Math.ceil(newTotal / PAGE_SIZE)
        setPagination({
          ...pagination,
          total: newTotal,
          total_pages: newTotalPages,
          has_next: currentPage < newTotalPages,
          has_prev: currentPage > 1,
        })

        // 如果当前页没有数据了且不是第一页，返回上一页
        if (apis.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      }

      // 通知父组件
      onAPIApproved?.(api.id)

      toast.success(`API "${api.name}" ${t('toast.apiApprovalSuccess')}`)
    } catch (error: unknown) {
      console.error('❌ [APIReviewList] API审核失败:', error)
      toast.error(error instanceof Error ? error.message : '审核失败')
    } finally {
      setApproving(null)
    }
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 加载状态
  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='flex items-center justify-center h-32'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Loader2 className='h-5 w-5 animate-spin' />
            {t('admin.apiReview.loadingList')}
          </div>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className='space-y-4'>
        <Card className='border-destructive/50'>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2 text-destructive'>
              <AlertCircle className='h-5 w-5' />
              <span>{error}</span>
            </div>
            <Button
              onClick={() => loadDraftAPIs(currentPage)}
              variant='outline'
              size='sm'
              className='mt-3'
            >
              {t('admin.apiReview.reloadList')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 空状态
  if (apis.length === 0) {
    return (
      <div className='space-y-4'>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center py-8'>
              <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-foreground mb-2'>
                {t('admin.apiReview.noReviewAPIs')}
              </h3>
              <p className='text-muted-foreground'>{t('admin.apiReview.allReviewed')}</p>
              <Button
                onClick={() => loadDraftAPIs(currentPage)}
                variant='outline'
                size='sm'
                className='mt-4'
              >
                {t('admin.apiReview.refreshList')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* 页面头部信息 */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold text-foreground'>{t('admin.apiReview.title')}</h2>
          <p className='text-sm text-muted-foreground'>
            {t('admin.apiReview.countInfo', { count: pagination?.total || 0 })}
          </p>
        </div>
        <Button onClick={() => loadDraftAPIs(currentPage)} variant='outline' size='sm'>
          {t('admin.apiReview.refreshList')}
        </Button>
      </div>

      {/* API列表 */}
      <div className='grid gap-4'>
        {apis.map((api) => (
          <Card key={api.id} className='hover:shadow-md transition-shadow'>
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <CardTitle className='text-lg flex items-center gap-2'>
                    {api.avatar_url && (
                      <Image
                        src={api.avatar_url}
                        alt={api.name}
                        width={24}
                        height={24}
                        className='w-6 h-6 rounded object-cover'
                      />
                    )}
                    {api.name}
                    <Badge variant='outline' className='text-orange-600 border-orange-300'>
                      <Clock className='h-3 w-3 mr-1' />
                      {t('admin.apiReview.pendingReview')}
                    </Badge>
                  </CardTitle>
                  <p className='text-sm text-muted-foreground mt-1'>{api.short_description}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className='space-y-4'>
              {/* API详细信息 */}
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-muted-foreground'>{t('admin.apiReview.category')}</span>
                  <Badge variant='secondary' className='ml-2'>
                    {api.category}
                  </Badge>
                </div>
                <div>
                  <span className='text-muted-foreground'>{t('admin.apiReview.publicStatus')}</span>
                  <Badge variant={api.is_public ? 'default' : 'outline'} className='ml-2'>
                    {api.is_public ? t('admin.apiReview.public') : t('admin.apiReview.private')}
                  </Badge>
                </div>
                <div>
                  <span className='text-muted-foreground'>{t('admin.apiReview.submitTime')}</span>
                  <span className='ml-2'>{formatDate(api.created_at)}</span>
                </div>
                {api.owner_id && (
                  <div className='flex items-center gap-1'>
                    <User className='h-3 w-3 text-muted-foreground' />
                    <span className='text-muted-foreground'>{t('admin.apiReview.creator')}</span>
                    <span className='ml-1'>{api.owner_id}</span>
                  </div>
                )}
              </div>

              {/* 标签 */}
              {api.tags && api.tags.length > 0 && (
                <div className='flex flex-wrap gap-1'>
                  {api.tags!.map((tag, index) => (
                    <Badge key={index} variant='outline' className='text-xs'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* 长描述 */}
              {api.long_description && (
                <div className='bg-muted/50 p-3 rounded-lg'>
                  <p className='text-sm text-muted-foreground'>
                    <strong>{t('admin.apiReview.detailDescription')}</strong>
                  </p>
                  <p className='text-sm mt-1 line-clamp-3'>{api.long_description}</p>
                </div>
              )}

              {/* 操作按钮 */}
              <div className='flex items-center justify-between pt-2 border-t'>
                <div className='flex gap-2'>
                  {api.website_url && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => window.open(api.website_url!, '_blank')}
                    >
                      <ExternalLink className='h-3 w-3 mr-1' />
                      {t('admin.apiReview.website')}
                    </Button>
                  )}
                  {api.documentation_url && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => window.open(api.documentation_url!, '_blank')}
                    >
                      <ExternalLink className='h-3 w-3 mr-1' />
                      {t('admin.apiReview.documentation')}
                    </Button>
                  )}
                </div>

                <Button
                  onClick={() => handleApprove(api)}
                  disabled={approving === api.id}
                  className='bg-green-600 hover:bg-green-700'
                  size='sm'
                >
                  {approving === api.id ? (
                    <>
                      <Loader2 className='h-3 w-3 mr-1 animate-spin' />
                      {t('admin.apiReview.approving')}
                    </>
                  ) : (
                    <>
                      <CheckCircle className='h-3 w-3 mr-1' />
                      {t('admin.apiReview.approve')}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 分页组件 */}
      {pagination && pagination.total_pages > 1 && (
        <div className='mt-6 space-y-4'>
          <div className='text-sm text-muted-foreground text-center'>
            {t('admin.pagination.showing', { count: apis.length, total: pagination.total })}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href='#'
                  onClick={(e) => {
                    e.preventDefault()
                    if (pagination.has_prev && !loading) {
                      handlePageChange(currentPage - 1)
                    }
                  }}
                  className={
                    !pagination.has_prev || loading
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {generatePageNumbers(currentPage, pagination.total_pages).map((page, index) => (
                <PaginationItem key={index}>
                  {page === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href='#'
                      onClick={(e) => {
                        e.preventDefault()
                        if (!loading) {
                          handlePageChange(page as number)
                        }
                      }}
                      isActive={page === currentPage}
                      className={loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href='#'
                  onClick={(e) => {
                    e.preventDefault()
                    if (pagination.has_next && !loading) {
                      handlePageChange(currentPage + 1)
                    }
                  }}
                  className={
                    !pagination.has_next || loading
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
