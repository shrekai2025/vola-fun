'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { CheckCircle, Clock, User, ExternalLink, AlertCircle, Loader2 } from 'lucide-react'
import { APIService, type API } from '@/lib/api'
import Image from 'next/image'

interface APIReviewListProps {
  onAPIApproved?: (apiId: string) => void
}

export default function APIReviewList({ onAPIApproved }: APIReviewListProps) {
  const [apis, setApis] = useState<API[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [approving, setApproving] = useState<string | null>(null) // 正在审核的API ID
  const toast = useToast()

  // 加载待审核的API列表
  const loadDraftAPIs = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.debug('🔄 [APIReviewList] 开始加载待审核API列表')

      const response = await APIService.list({
        status: 'draft',
        page: 1,
        page_size: 50, // 加载更多以防有很多待审核
      })

      setApis(response.data)
      console.debug('✅ [APIReviewList] 待审核API列表加载成功:', response.data.length, '个API')
    } catch (error: unknown) {
      console.error('❌ [APIReviewList] 加载API列表失败:', error)
      setError(error instanceof Error ? error.message : '加载失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [])

  // 组件加载时获取数据
  useEffect(() => {
    loadDraftAPIs()
  }, [loadDraftAPIs])

  // 审核通过API
  const handleApprove = async (api: API) => {
    if (approving) return

    try {
      setApproving(api.id)
      console.debug('🔄 [APIReviewList] 开始审核通过 API:', api.name)

      const _updatedAPI = await APIService.update(api.id, { status: 'published' })

      console.debug('✅ [APIReviewList] API审核通过成功:', api.name)

      // 从列表中移除已审核的API
      setApis((prev) => prev.filter((item) => item.id !== api.id))

      // 通知父组件
      onAPIApproved?.(api.id)

      toast.success(`API "${api.name}" 已审核通过`)
    } catch (error: unknown) {
      console.error('❌ [APIReviewList] API审核失败:', error)
      toast.error(error instanceof Error ? error.message : '审核失败，请稍后重试')
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
            加载待审核API列表...
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
            <Button onClick={loadDraftAPIs} variant='outline' size='sm' className='mt-3'>
              重新加载
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
              <h3 className='text-lg font-medium text-foreground mb-2'>暂无待审核API</h3>
              <p className='text-muted-foreground'>所有API都已完成审核</p>
              <Button onClick={loadDraftAPIs} variant='outline' size='sm' className='mt-4'>
                刷新列表
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
          <h2 className='text-xl font-semibold text-foreground'>API审核列表</h2>
          <p className='text-sm text-muted-foreground'>共 {apis.length} 个API等待审核</p>
        </div>
        <Button onClick={loadDraftAPIs} variant='outline' size='sm'>
          刷新列表
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
                      待审核
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
                  <span className='text-muted-foreground'>分类:</span>
                  <Badge variant='secondary' className='ml-2'>
                    {api.category}
                  </Badge>
                </div>
                <div>
                  <span className='text-muted-foreground'>公开状态:</span>
                  <Badge variant={api.is_public ? 'default' : 'outline'} className='ml-2'>
                    {api.is_public ? '公开' : '私有'}
                  </Badge>
                </div>
                <div>
                  <span className='text-muted-foreground'>提交时间:</span>
                  <span className='ml-2'>{formatDate(api.created_at)}</span>
                </div>
                {api.owner && (
                  <div className='flex items-center gap-1'>
                    <User className='h-3 w-3 text-muted-foreground' />
                    <span className='text-muted-foreground'>创建者:</span>
                    <span className='ml-1'>{api.owner.full_name || api.owner.username}</span>
                  </div>
                )}
              </div>

              {/* 标签 */}
              {api.tags.length > 0 && (
                <div className='flex flex-wrap gap-1'>
                  {api.tags.map((tag, index) => (
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
                    <strong>详细描述:</strong>
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
                      onClick={() => window.open(api.website_url, '_blank')}
                    >
                      <ExternalLink className='h-3 w-3 mr-1' />
                      网站
                    </Button>
                  )}
                  {api.documentation_url && (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => window.open(api.documentation_url, '_blank')}
                    >
                      <ExternalLink className='h-3 w-3 mr-1' />
                      文档
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
                      审核中...
                    </>
                  ) : (
                    <>
                      <CheckCircle className='h-3 w-3 mr-1' />
                      通过
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
