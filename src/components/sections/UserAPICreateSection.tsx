'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { useToast } from '@/components/ui/toast'
import { publishUserAPI } from '@/services/user-api'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'

// 表单验证模式 - 使用函数获取翻译
const createUserAPISchema = (t: any) => z.object({
  name: z.string().min(1, t.validation.apiNameRequired).max(255, t.validation.apiNameMaxLength),
  slug: z.string()
    .min(1, t.validation.apiSlugRequired)
    .regex(/^[a-z0-9-]+$/, t.validation.apiSlugFormat),
  short_description: z.string().min(1, t.validation.shortDescRequired).max(100, t.validation.shortDescMaxLength),
  long_description: z.string().optional(),
  category: z.enum(['data', 'ai_ml', 'finance', 'social', 'tools', 'communication', 'entertainment', 'business', 'other']),
  base_url: z.string().url(t.validation.urlInvalid),
  health_check_url: z.string().url(t.validation.urlInvalid).optional().or(z.literal('')),
  website_url: z.string().url(t.validation.urlInvalid).optional().or(z.literal('')),
  documentation_url: z.string().url(t.validation.urlInvalid).optional().or(z.literal('')),
  terms_url: z.string().url(t.validation.urlInvalid).optional().or(z.literal('')),
  estimated_response_time: z.number().min(1, t.validation.responseTimeRequired).max(600000, t.validation.responseTimeRange).optional(),
  documentation_markdown: z.string().optional(),
})

type CreateUserAPIFormData = z.infer<ReturnType<typeof createUserAPISchema>>

// API分类选项 - 动态获取翻译
const getCategoryOptions = (t: any) => [
  { value: 'data', label: t.apiProvider.categories.data },
  { value: 'ai_ml', label: t.apiProvider.categories.ai_ml },
  { value: 'finance', label: t.apiProvider.categories.finance },
  { value: 'social', label: t.apiProvider.categories.social },
  { value: 'tools', label: t.apiProvider.categories.tools },
  { value: 'communication', label: t.apiProvider.categories.communication },
  { value: 'entertainment', label: t.apiProvider.categories.entertainment },
  { value: 'business', label: t.apiProvider.categories.business },
  { value: 'other', label: t.apiProvider.categories.other },
]

export default function UserAPICreateSection() {
  const [submitting, setSubmitting] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const { t } = useTranslation()
  const toast = useToast()
  const router = useRouter()

  // 稳定化翻译对象
  const translations = useMemo(() => t.apiProvider, [t.apiProvider])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateUserAPIFormData>({
    resolver: zodResolver(createUserAPISchema(t)),
    defaultValues: {
      category: 'other',
    },
  })

  // 处理标签添加
  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags(prev => [...prev, trimmed])
      setTagInput('')
    }
  }, [tagInput, tags])

  // 处理标签删除
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }, [])

  // 处理表单提交
  const onSubmit = useCallback(async (data: CreateUserAPIFormData) => {
    try {
      setSubmitting(true)
      
      const submitData = {
        ...data,
        tags: tags,
        // 用户发布的API默认为草稿状态，不公开
        status: 'draft',
        is_public: false,
      }

      console.log('提交用户API发布:', submitData)
      
      const response = await publishUserAPI(submitData)
      
      toast.success(t.toast.apiCreateSuccessDraft)
      
      // 返回到API Provider页面
      router.push('/api-provider')
      
    } catch (error: unknown) {
      console.error('发布API失败:', error)
      const errorMessage = error instanceof Error ? error.message : '发布失败'
      toast.error(`API发布失败：${errorMessage}`)
    } finally {
      setSubmitting(false)
    }
  }, [tags]) // 移除toast和router依赖

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/api-provider" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t.apiProvider.edit.backToList}
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t.apiProvider.create.title}
        </h1>
        <p className="text-muted-foreground">
          {t.apiProvider.create.description}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>{t.apiProvider.create.basicInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* API名称和标识 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.apiProvider.create.apiName} <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register('name')}
                  placeholder={t.admin.apiNamePlaceholder}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.apiProvider.create.apiSlug} <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register('slug')}
                  placeholder={t.admin.apiSlugPlaceholder}
                  className={errors.slug ? 'border-destructive' : ''}
                />
                {errors.slug && (
                  <p className="text-destructive text-sm mt-1">{errors.slug.message}</p>
                )}
                <p className="text-muted-foreground text-xs mt-1">
                  {t.apiProvider.create.slugHelper}
                </p>
              </div>
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.apiProvider.create.shortDescription} <span className="text-destructive">*</span>
              </label>
              <Input
                {...register('short_description')}
                placeholder={t.admin.shortDescPlaceholder}
                className={errors.short_description ? 'border-destructive' : ''}
              />
              {errors.short_description && (
                <p className="text-destructive text-sm mt-1">{errors.short_description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t.apiProvider.create.longDescription}
              </label>
              <textarea
                {...register('long_description')}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder={t.admin.longDescPlaceholder}
              />
            </div>

            {/* 分类 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.apiProvider.create.category} <span className="text-destructive">*</span>
              </label>
              <select
                {...register('category')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {getCategoryOptions(t).map((category) => (
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
            <CardTitle>{t.apiProvider.create.technicalConfig}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.apiProvider.create.baseUrl} <span className="text-destructive">*</span>
              </label>
              <Input
                {...register('base_url')}
                placeholder="https://api.example.com"
                className={errors.base_url ? 'border-destructive' : ''}
              />
              {errors.base_url && (
                <p className="text-destructive text-sm mt-1">{errors.base_url.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t.apiProvider.create.healthCheckUrl}
              </label>
              <Input
                {...register('health_check_url')}
                placeholder="https://api.example.com/health"
                className={errors.health_check_url ? 'border-destructive' : ''}
              />
              {errors.health_check_url && (
                <p className="text-destructive text-sm mt-1">{errors.health_check_url.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t.apiProvider.create.estimatedResponseTime}
              </label>
              <Input
                type="number"
                {...register('estimated_response_time', { valueAsNumber: true })}
                placeholder={t.admin.estimatedResponseTimePlaceholder}
                className={errors.estimated_response_time ? 'border-destructive' : ''}
              />
              {errors.estimated_response_time && (
                <p className="text-destructive text-sm mt-1">{errors.estimated_response_time.message}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {t.apiProvider.create.responseTimeHelper}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 链接信息 */}
        <Card>
          <CardHeader>
            <CardTitle>{t.apiProvider.create.relatedLinks}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.apiProvider.create.websiteUrl}
                </label>
                <Input
                  {...register('website_url')}
                  placeholder="https://example.com"
                  className={errors.website_url ? 'border-destructive' : ''}
                />
                {errors.website_url && (
                  <p className="text-destructive text-sm mt-1">{errors.website_url.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t.apiProvider.create.documentationUrl}
                </label>
                <Input
                  {...register('documentation_url')}
                  placeholder="https://docs.example.com"
                  className={errors.documentation_url ? 'border-destructive' : ''}
                />
                {errors.documentation_url && (
                  <p className="text-destructive text-sm mt-1">{errors.documentation_url.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t.apiProvider.create.termsUrl}
              </label>
              <Input
                {...register('terms_url')}
                placeholder="https://example.com/terms"
                className={errors.terms_url ? 'border-destructive' : ''}
              />
              {errors.terms_url && (
                <p className="text-destructive text-sm mt-1">{errors.terms_url.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 标签和文档 */}
        <Card>
          <CardHeader>
            <CardTitle>{t.apiProvider.create.tagsAndDocs}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.apiProvider.create.tags}
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder={t.admin.tagsPlaceholder}
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || tags.length >= 5}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Markdown文档 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t.apiProvider.create.apiDocs}
              </label>
              <textarea
                {...register('documentation_markdown')}
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none font-mono"
                placeholder={`# API 文档

## 概述
描述您的API功能...

## 认证
描述认证方式...

## 端点
### GET /endpoint
描述端点用法...`}
              />
            </div>
          </CardContent>
        </Card>

        {/* 提交按钮 */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/api-provider">{t.apiProvider.create.cancel}</Link>
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                {t.apiProvider.create.publishing}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t.apiProvider.create.publishAPI}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
