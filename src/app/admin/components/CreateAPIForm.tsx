'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast'
import { useI18n } from '@/hooks'
import { APIService } from '@/lib/api'
import { getCategoryOptions } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Save, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'

// 创建表单验证模式函数
const createAPISchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t('admin.createAPI.apiNameRequired'))
      .max(255, t('admin.createAPI.apiNameMaxLength')),
    slug: z
      .string()
      .min(1, t('admin.createAPI.apiSlugRequired'))
      .regex(/^[a-z0-9-]+$/, t('admin.createAPI.apiSlugFormat')),
    short_description: z
      .string()
      .min(1, t('admin.createAPI.shortDescRequired'))
      .max(100, t('admin.createAPI.shortDescMaxLength')),
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
    base_url: z.url(t('admin.createAPI.validUrl')),
    health_check_url: z.url(t('admin.createAPI.validUrl')).optional().or(z.literal('')),
    is_public: z.boolean().default(true),
    website_url: z.url(t('admin.createAPI.validUrl')).optional().or(z.literal('')),
    documentation_url: z.url(t('admin.createAPI.validUrl')).optional().or(z.literal('')),
    terms_url: z.url(t('admin.createAPI.validUrl')).optional().or(z.literal('')),
    gateway_key: z.string().optional(),
    documentation_markdown: z.string().optional(),
  })

type CreateAPIFormData = z.infer<ReturnType<typeof createAPISchema>>

interface CreateAPIFormProps {
  onClose: () => void
  onSuccess: () => void
}

export default function CreateAPIForm({ onClose, onSuccess }: CreateAPIFormProps) {
  const { t } = useI18n()
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  // 使用统一的分类选项
  const categories = useMemo(() => getCategoryOptions(t), [t])

  const {
    register,
    handleSubmit,
    watch: _watch,
    formState: { errors },
    setValue: _setValue,
    control,
  } = useForm({
    resolver: zodResolver(createAPISchema(t)),
    defaultValues: {
      category: 'data',
      is_public: true,
    },
  })

  // 添加标签
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 3) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // 提交表单
  const onSubmit = async (data: CreateAPIFormData) => {
    try {
      setIsSubmitting(true)

      // 准备API数据
      const apiData = {
        ...data,
        tags,
        // 处理可选字段
        health_check_url: data.health_check_url || undefined,
        website_url: data.website_url || undefined,
        documentation_url: data.documentation_url || undefined,
        terms_url: data.terms_url || undefined,
        gateway_key: data.gateway_key || undefined,
        documentation_markdown: data.documentation_markdown || undefined,
      }

      console.debug('🚀 [CreateAPIForm] 创建API:', apiData.name)

      // 调用API并记录响应
      const startTime = Date.now()
      await APIService.create(apiData)
      const endTime = Date.now()

      console.debug('✅ [CreateAPIForm] API发布成功，耗时:', `${endTime - startTime}ms`)

      toast.success(t('admin.createAPI.publishSuccess'))
      onSuccess()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const httpError = error as {
        response?: { status?: number; headers?: unknown; data?: unknown }
        request?: unknown
      }

      console.error('❌ [CreateAPIForm] API发布失败:', errorMessage)

      // 如果是网络错误，记录更多详细信息
      if (httpError.response) {
        console.error('📥 HTTP响应状态:', httpError.response.status)
        console.error('📥 HTTP响应头:', httpError.response.headers)
        console.error('📥 HTTP响应数据:', httpError.response.data)
      } else if (httpError.request) {
        console.error('📤 HTTP请求对象:', httpError.request)
        console.error('📤 请求未收到响应')
      } else {
        console.error('⚠️ 请求配置错误:', error)
      }

      // 记录更多环境信息
      console.error('🌍 当前URL:', window.location.href)
      console.error('🌍 User Agent:', navigator.userAgent)
      console.error('⏰ 错误时间:', new Date().toISOString())
      console.groupEnd()

      toast.error(
        `${t('admin.createAPI.publishFailed')}: ${(error as Error).message || t('admin.createAPI.unknownError')}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
      <Card className='w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4 sticky top-0 bg-card z-10 border-b'>
          <CardTitle className='text-xl'>{t('admin.createAPI.title')}</CardTitle>
          <Button variant='ghost' size='sm' onClick={onClose} className='h-8 w-8 p-0'>
            <X className='h-4 w-4' />
          </Button>
        </CardHeader>

        <CardContent className='pt-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* 基本信息 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-foreground'>
                {t('admin.createAPI.basicInfo')}
              </h3>

              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='text-sm font-medium text-foreground block mb-2'>
                    {t('admin.createAPI.apiName')} <span className='text-destructive'>*</span>
                  </label>
                  <Input
                    {...register('name')}
                    placeholder={t('admin.createAPI.placeholders.apiName')}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className='text-sm text-destructive mt-1'>{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className='text-sm font-medium text-foreground block mb-2'>
                    {t('admin.createAPI.apiSlug')} <span className='text-destructive'>*</span>
                  </label>
                  <Input
                    {...register('slug')}
                    placeholder={t('admin.createAPI.placeholders.apiSlug')}
                    className={errors.slug ? 'border-destructive' : ''}
                  />
                  {errors.slug && (
                    <p className='text-sm text-destructive mt-1'>{errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className='text-sm font-medium text-foreground block mb-2'>
                  {t('admin.createAPI.shortDescription')}{' '}
                  <span className='text-destructive'>*</span>
                </label>
                <Input
                  {...register('short_description')}
                  placeholder={t('admin.createAPI.placeholders.shortDesc')}
                  className={errors.short_description ? 'border-destructive' : ''}
                />
                {errors.short_description && (
                  <p className='text-sm text-destructive mt-1'>
                    {errors.short_description.message}
                  </p>
                )}
              </div>

              <div>
                <label className='text-sm font-medium text-foreground block mb-2'>
                  {t('admin.createAPI.longDescription')}
                </label>
                <textarea
                  {...register('long_description')}
                  placeholder={t('admin.createAPI.placeholders.longDesc')}
                  className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  rows={3}
                />
              </div>
            </div>

            {/* 分类和标签 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-foreground'>
                {t('admin.createAPI.categoryAndTags')}
              </h3>

              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='text-sm font-medium text-foreground block mb-2'>
                    {t('admin.createAPI.apiCategory')} <span className='text-destructive'>*</span>
                  </label>
                  <Controller
                    name='category'
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                          <SelectValue placeholder={t('admin.createAPI.selectCategory')} />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className='text-sm text-destructive mt-1'>{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className='text-sm font-medium text-foreground block mb-2'>
                    {t('admin.createAPI.tags')}
                  </label>
                  <div className='flex gap-2'>
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder={t('admin.createAPI.addTag')}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      disabled={tags.length >= 3}
                    />
                    <Button
                      type='button'
                      onClick={addTag}
                      size='sm'
                      variant='outline'
                      disabled={!newTag.trim() || tags.includes(newTag.trim()) || tags.length >= 3}
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {tags.map((tag) => (
                      <Badge key={tag} variant='secondary' className='px-2 py-1'>
                        {tag}
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          onClick={() => removeTag(tag)}
                          className='ml-2 h-auto p-0 hover:text-destructive'
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* URL配置 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-foreground'>
                {t('admin.createAPI.urlConfig')}
              </h3>

              <div className='grid gap-4'>
                <div>
                  <label className='text-sm font-medium text-foreground block mb-2'>
                    {t('admin.createAPI.baseUrl')} <span className='text-destructive'>*</span>
                  </label>
                  <Input
                    {...register('base_url')}
                    placeholder={t('admin.createAPI.placeholders.baseUrl')}
                    className={errors.base_url ? 'border-destructive' : ''}
                  />
                  {errors.base_url && (
                    <p className='text-sm text-destructive mt-1'>{errors.base_url.message}</p>
                  )}
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <label className='text-sm font-medium text-foreground block mb-2'>
                      {t('admin.createAPI.healthCheckUrl')}
                    </label>
                    <Input
                      {...register('health_check_url')}
                      placeholder={t('admin.createAPI.placeholders.healthCheck')}
                    />
                  </div>

                  <div>
                    <label className='text-sm font-medium text-foreground block mb-2'>
                      {t('admin.createAPI.websiteUrl')}
                    </label>
                    <Input
                      {...register('website_url')}
                      placeholder={t('admin.createAPI.placeholders.website')}
                    />
                  </div>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <label className='text-sm font-medium text-foreground block mb-2'>
                      {t('admin.createAPI.documentationUrl')}
                    </label>
                    <Input
                      {...register('documentation_url')}
                      placeholder={t('admin.createAPI.placeholders.documentation')}
                    />
                  </div>

                  <div>
                    <label className='text-sm font-medium text-foreground block mb-2'>
                      {t('admin.createAPI.termsUrl')}
                    </label>
                    <Input
                      {...register('terms_url')}
                      placeholder={t('admin.createAPI.placeholders.terms')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 其他设置 */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-foreground'>
                {t('admin.createAPI.otherSettings')}
              </h3>

              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <label className='text-sm font-medium text-foreground block mb-2'>
                    {t('admin.createAPI.gatewayKey')}
                  </label>
                  <Input
                    {...register('gateway_key')}
                    placeholder={t('admin.createAPI.placeholders.gatewayKey')}
                    type='password'
                  />
                  <p className='text-xs text-muted-foreground mt-1'>
                    {t('admin.createAPI.gatewayKeyHelper')}
                  </p>
                </div>

                <div className='flex items-center space-x-2 pt-6'>
                  <Input
                    type='checkbox'
                    {...register('is_public')}
                    className='h-4 w-4 rounded border border-input'
                  />
                  <label className='text-sm font-medium text-foreground'>
                    {t('admin.createAPI.publicApi')}
                  </label>
                </div>
              </div>

              <div>
                <label className='text-sm font-medium text-foreground block mb-2'>
                  {t('admin.createAPI.apiDocs')}
                </label>
                <textarea
                  {...register('documentation_markdown')}
                  placeholder={t('admin.createAPI.placeholders.apiDocs')}
                  className='flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono'
                  rows={4}
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <div className='flex justify-end space-x-2 pt-6 border-t'>
              <Button type='button' variant='outline' onClick={onClose} disabled={isSubmitting}>
                {t('admin.createAPI.cancel')}
              </Button>
              <Button type='submit' disabled={isSubmitting} className='min-w-[120px]'>
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                    {t('admin.createAPI.publishing')}
                  </>
                ) : (
                  <>
                    <Save className='h-4 w-4 mr-2' />
                    {t('admin.createAPI.publishApi')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
