'use client'

import { useTranslation } from '@/components/providers/LanguageProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast'
import { APIService, type API, type UpdateAPIData } from '@/lib/api'
import { dataManager } from '@/lib/data-manager'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Plus, Save, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// 表单验证模式 - 使用函数获取翻译
const updateUserAPISchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('validation.required')).max(255, t('validation.apiNameMaxLength')),
    slug: z
      .string()
      .min(1, t('validation.required'))
      .regex(/^[a-z0-9-]+$/, t('validation.apiSlugFormat')),
    short_description: z
      .string()
      .min(1, t('validation.required'))
      .max(100, t('validation.shortDescMaxLength')),
    long_description: z.string().optional(),
    category: z.enum([
      'data',
      'ai_ml',
      'finance',
      'social',
      'tools',
      'communication',
      'entertainment',
      'business',
      'other',
    ]),
    base_url: z.string().url(t('validation.urlInvalid')),
    health_check_url: z.string().url(t('validation.urlInvalid')).optional().or(z.literal('')),
    website_url: z.string().url(t('validation.urlInvalid')).optional().or(z.literal('')),
    documentation_url: z.string().url(t('validation.urlInvalid')).optional().or(z.literal('')),
    terms_url: z.string().url(t('validation.urlInvalid')).optional().or(z.literal('')),
    estimated_response_time: z
      .number()
      .min(1, t('validation.responseTimeRange'))
      .max(600000, t('validation.responseTimeRange'))
      .optional(),
    documentation_markdown: z.string().optional(),
  })

type UpdateUserAPIFormData = z.infer<ReturnType<typeof updateUserAPISchema>>

interface UserAPIEditSectionProps {
  apiId: string
}

export default function UserAPIEditSection({ apiId }: UserAPIEditSectionProps) {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [api, setApi] = useState<API | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const { t } = useTranslation()
  const toast = useToast()
  const router = useRouter()

  // 创建分类选项
  const categories = useMemo(
    () => [
      { value: 'data', label: t('apiProvider.categories.data') },
      { value: 'ai_ml', label: t('apiProvider.categories.ai_ml') },
      { value: 'finance', label: t('apiProvider.categories.finance') },
      { value: 'social', label: t('apiProvider.categories.social') },
      { value: 'tools', label: t('apiProvider.categories.tools') },
      { value: 'communication', label: t('apiProvider.categories.communication') },
      { value: 'entertainment', label: t('apiProvider.categories.entertainment') },
      { value: 'business', label: t('apiProvider.categories.business') },
      { value: 'other', label: t('apiProvider.categories.other') },
    ],
    [t]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserAPIFormData>({
    resolver: zodResolver(updateUserAPISchema(t)),
  })

  // 加载API详情
  const loadAPI = useCallback(async () => {
    try {
      setLoading(true)
      const apiData = await APIService.get(apiId)

      setApi(apiData)
      setTags(apiData.tags || [])

      // 填充表单
      reset({
        name: apiData.name,
        slug: apiData.slug,
        short_description: apiData.short_description,
        long_description: apiData.long_description || '', // 现在MarketAPI包含此字段
        category: apiData.category as
          | 'data'
          | 'ai_ml'
          | 'finance'
          | 'social'
          | 'tools'
          | 'communication'
          | 'entertainment'
          | 'business'
          | 'other',
        base_url: apiData.base_url,
        estimated_response_time: apiData.estimated_response_time || undefined,
        health_check_url: apiData.health_check_url || '',
        website_url: apiData.website_url || '',
        documentation_url: apiData.documentation_url || '',
        terms_url: apiData.terms_url || '',
        documentation_markdown: apiData.documentation_markdown || '',
      })
    } catch (error: unknown) {
      console.error('Failed to load API details:', error)
      const errorMessage = error instanceof Error ? error.message : t('errors.loadFailed')
      toast.error(errorMessage)
      // 返回列表页
      router.push('/api-provider')
    } finally {
      setLoading(false)
    }
  }, [apiId, reset, router, toast, t])

  // 处理标签添加
  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags((prev) => [...prev, trimmed])
      setTagInput('')
    }
  }, [tagInput, tags])

  // 处理标签删除
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }, [])

  // 处理表单提交
  const onSubmit = useCallback(
    async (data: UpdateUserAPIFormData) => {
      try {
        setSubmitting(true)

        // 处理空URL字段 - 如果为空字符串则不传该字段
        const updateData: UpdateAPIData & { tags?: string[] } = {
          name: data.name,
          slug: data.slug,
          short_description: data.short_description,
          category: data.category,
          base_url: data.base_url,
          tags: tags,
        }

        // 可选字段：只有不为空时才传递
        if (data.long_description && data.long_description.trim()) {
          updateData.long_description = data.long_description
        }

        if (data.health_check_url && data.health_check_url.trim()) {
          updateData.health_check_url = data.health_check_url
        }

        if (data.estimated_response_time && data.estimated_response_time > 0) {
          updateData.estimated_response_time = data.estimated_response_time
        }

        if (data.website_url && data.website_url.trim()) {
          updateData.website_url = data.website_url
        }

        if (data.documentation_url && data.documentation_url.trim()) {
          updateData.documentation_url = data.documentation_url
        }

        if (data.terms_url && data.terms_url.trim()) {
          updateData.terms_url = data.terms_url
        }

        if (data.documentation_markdown && data.documentation_markdown.trim()) {
          updateData.documentation_markdown = data.documentation_markdown
        }

        await APIService.update(apiId, updateData)

        // 清除用户API列表缓存，确保跳转后显示最新数据
        dataManager.clearCache('user-apis')

        toast.success(t('apiProvider.edit.saveChanges') + ' ' + t('common.success'))

        // 延迟跳转，确保Toast显示完成
        setTimeout(() => {
          router.push('/api-provider')
        }, 800)
      } catch (error: unknown) {
        console.error('Failed to update API:', error)
        const errorMessage = error instanceof Error ? error.message : t('errors.updateFailed')
        toast.error(`${t('common.error')}：${errorMessage}`)
      } finally {
        setSubmitting(false)
      }
    },
    [apiId, tags, t, router, toast]
  )

  useEffect(() => {
    loadAPI()
  }, [loadAPI])

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4' />
            <p className='text-muted-foreground'>{t('apiProvider.edit.loadingAPI')}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!api) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center'>
            <p className='text-muted-foreground mb-4'>{t('apiProvider.edit.notFound')}</p>
            <Button asChild>
              <Link href='/api-provider'>{t('apiProvider.edit.noAccess')}</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      {/* 页面标题 */}
      <div className='mb-8'>
        <div className='flex items-center gap-4 mb-4'>
          <Button variant='ghost' size='sm' asChild>
            <Link href='/api-provider' className='flex items-center gap-2'>
              <ArrowLeft className='w-4 h-4' />
              {t('apiProvider.edit.backToList')}
            </Link>
          </Button>
        </div>
        <div className='flex items-center gap-3 mb-2'>
          <h1 className='text-3xl font-bold text-foreground'>
            {t('apiProvider.edit.title')}: {api.name}
          </h1>
          <Badge
            variant='outline'
            className={`${api.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}
          >
            {api.status === 'draft' ? t('apiProvider.edit.draft') : t('apiProvider.edit.published')}
          </Badge>
        </div>
        <p className='text-muted-foreground'>{t('apiProvider.edit.editingNote')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('apiProvider.edit.basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* API名称和标识 */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  {t('apiProvider.edit.apiName')} <span className='text-destructive'>*</span>
                </label>
                <Input
                  {...register('name')}
                  placeholder={t('apiProvider.edit.namePlaceholder')}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className='text-destructive text-sm mt-1'>{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  {t('apiProvider.edit.apiSlug')} <span className='text-destructive'>*</span>
                </label>
                <Input
                  {...register('slug')}
                  placeholder={t('apiProvider.edit.slugPlaceholder')}
                  className={errors.slug ? 'border-destructive' : ''}
                />
                {errors.slug && (
                  <p className='text-destructive text-sm mt-1'>{errors.slug.message}</p>
                )}
                <p className='text-muted-foreground text-xs mt-1'>
                  {t('apiProvider.edit.slugHelper')}
                </p>
              </div>
            </div>

            {/* 描述 */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                {t('apiProvider.edit.shortDescription')} <span className='text-destructive'>*</span>
              </label>
              <Input
                {...register('short_description')}
                placeholder={t('apiProvider.edit.shortDescPlaceholder')}
                className={errors.short_description ? 'border-destructive' : ''}
              />
              {errors.short_description && (
                <p className='text-destructive text-sm mt-1'>{errors.short_description.message}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>
                {t('apiProvider.edit.longDescription')}
              </label>
              <textarea
                {...register('long_description')}
                className='flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none'
                placeholder={t('apiProvider.edit.longDescPlaceholder')}
              />
            </div>

            {/* 分类 */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                {t('apiProvider.edit.category')} <span className='text-destructive'>*</span>
              </label>
              <select
                {...register('category')}
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* 技术配置 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('apiProvider.edit.technicalConfig')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div>
              <label className='block text-sm font-medium mb-2'>
                {t('apiProvider.edit.baseUrl')} <span className='text-destructive'>*</span>
              </label>
              <Input
                {...register('base_url')}
                placeholder={t('apiProvider.edit.baseUrlPlaceholder')}
                className={errors.base_url ? 'border-destructive' : ''}
              />
              {errors.base_url && (
                <p className='text-destructive text-sm mt-1'>{errors.base_url.message}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>
                {t('admin.estimatedResponseTime')}
              </label>
              <Input
                type='number'
                {...register('estimated_response_time', {
                  setValueAs: (value) => (value === '' ? undefined : Number(value)),
                })}
                placeholder={t('admin.estimatedResponseTimePlaceholder')}
                className={errors.estimated_response_time ? 'border-destructive' : ''}
              />
              {errors.estimated_response_time && (
                <p className='text-destructive text-sm mt-1'>
                  {errors.estimated_response_time.message}
                </p>
              )}
              <p className='text-xs text-muted-foreground mt-1'>
                API预期响应时间，单位为毫秒（可选）
              </p>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>
                {t('apiProvider.edit.healthCheckUrl')}
              </label>
              <Input
                {...register('health_check_url')}
                placeholder={t('apiProvider.edit.healthUrlPlaceholder')}
                className={errors.health_check_url ? 'border-destructive' : ''}
              />
              {errors.health_check_url && (
                <p className='text-destructive text-sm mt-1'>{errors.health_check_url.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 链接信息 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('apiProvider.edit.relatedLinks')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  {t('apiProvider.edit.websiteUrl')}
                </label>
                <Input
                  {...register('website_url')}
                  placeholder={t('apiProvider.edit.websiteUrlPlaceholder')}
                  className={errors.website_url ? 'border-destructive' : ''}
                />
                {errors.website_url && (
                  <p className='text-destructive text-sm mt-1'>{errors.website_url.message}</p>
                )}
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>
                  {t('apiProvider.edit.documentationUrl')}
                </label>
                <Input
                  {...register('documentation_url')}
                  placeholder={t('apiProvider.edit.docsUrlPlaceholder')}
                  className={errors.documentation_url ? 'border-destructive' : ''}
                />
                {errors.documentation_url && (
                  <p className='text-destructive text-sm mt-1'>
                    {errors.documentation_url.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium mb-2'>
                {t('apiProvider.edit.termsUrl')}
              </label>
              <Input
                {...register('terms_url')}
                placeholder={t('apiProvider.edit.termsUrlPlaceholder')}
                className={errors.terms_url ? 'border-destructive' : ''}
              />
              {errors.terms_url && (
                <p className='text-destructive text-sm mt-1'>{errors.terms_url.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 标签和文档 */}
        <Card>
          <CardHeader>
            <CardTitle>{t('apiProvider.edit.tagsAndDocs')}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* 标签 */}
            <div>
              <label className='block text-sm font-medium mb-2'>{t('apiProvider.edit.tags')}</label>
              <div className='flex gap-2 mb-2'>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder={t('apiProvider.edit.tagsPlaceholder')}
                  className='flex-1'
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button
                  type='button'
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || tags.length >= 5}
                  size='sm'
                >
                  <Plus className='w-4 h-4' />
                </Button>
              </div>
              <div className='flex flex-wrap gap-2'>
                {tags.map((tag) => (
                  <Badge key={tag} variant='secondary' className='flex items-center gap-1'>
                    {tag}
                    <button
                      type='button'
                      onClick={() => handleRemoveTag(tag)}
                      className='text-muted-foreground hover:text-foreground'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Markdown文档 */}
            <div>
              <label className='block text-sm font-medium mb-2'>
                {t('apiProvider.edit.apiDocs')}
              </label>
              <textarea
                {...register('documentation_markdown')}
                className='flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none font-mono'
                placeholder={t('apiProvider.edit.docsPlaceholder')}
              />
            </div>
          </CardContent>
        </Card>

        {/* 提交按钮 */}
        <div className='flex items-center justify-end gap-4'>
          <Button type='button' variant='outline' asChild>
            <Link href='/api-provider'>{t('apiProvider.edit.cancel')}</Link>
          </Button>
          <Button type='submit' disabled={submitting} className='flex items-center gap-2'>
            {submitting ? (
              <>
                <div className='w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin' />
                {t('apiProvider.edit.saving')}
              </>
            ) : (
              <>
                <Save className='w-4 h-4' />
                {t('apiProvider.edit.saveChanges')}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
