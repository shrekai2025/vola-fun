'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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
import { getUserAPI, updateUserAPI } from '@/services/user-api'
import type { MarketAPI } from '@/services/market-api'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'

// 表单验证模式
const updateUserAPISchema = z.object({
  name: z.string().min(1, 'API名称不能为空').max(255, 'API名称不能超过255个字符'),
  slug: z.string()
    .min(1, 'API标识不能为空')
    .regex(/^[a-z0-9-]+$/, 'API标识只能包含小写字母、数字和连字符'),
  short_description: z.string().min(1, '简短描述不能为空').max(100, '简短描述不能超过100个字符'),
  long_description: z.string().optional(),
  category: z.enum(['data', 'ai_ml', 'finance', 'social', 'tools', 'communication', 'entertainment', 'business', 'other']),
  base_url: z.string().url('请输入有效的URL'),
  health_check_url: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  website_url: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  documentation_url: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  terms_url: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  documentation_markdown: z.string().optional(),
})

type UpdateUserAPIFormData = z.infer<typeof updateUserAPISchema>

const CATEGORIES = [
  { value: 'data', label: '数据' },
  { value: 'ai_ml', label: 'AI/机器学习' },
  { value: 'finance', label: '金融' },
  { value: 'social', label: '社交' },
  { value: 'tools', label: '工具' },
  { value: 'communication', label: '通信' },
  { value: 'entertainment', label: '娱乐' },
  { value: 'business', label: '商业' },
  { value: 'other', label: '其他' },
]

interface UserAPIEditSectionProps {
  apiId: string
}

export default function UserAPIEditSection({ apiId }: UserAPIEditSectionProps) {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [api, setApi] = useState<MarketAPI | null>(null)
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
    reset,
  } = useForm<UpdateUserAPIFormData>({
    resolver: zodResolver(updateUserAPISchema),
  })

  // 加载API详情
  const loadAPI = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getUserAPI(apiId)
      const apiData = response.data
      
      setApi(apiData)
      setTags(apiData.tags || [])
      
      // 填充表单
      reset({
        name: apiData.name,
        slug: apiData.slug,
        short_description: apiData.short_description,
        long_description: '', // MarketAPI中没有此字段，使用空字符串
        category: apiData.category as any,
        base_url: apiData.base_url,
        health_check_url: apiData.health_check_url || '',
        website_url: apiData.website_url || '',
        documentation_url: apiData.documentation_url || '',
        terms_url: apiData.terms_url || '',
        documentation_markdown: apiData.documentation_markdown || '',
      })
      
    } catch (error: unknown) {
      console.error('加载API详情失败:', error)
      const errorMessage = error instanceof Error ? error.message : '加载失败'
      toast.error(errorMessage)
      // 返回列表页
      router.push('/api-provider')
    } finally {
      setLoading(false)
    }
  }, [apiId, reset]) // 移除toast和router依赖避免无限循环

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
  const onSubmit = useCallback(async (data: UpdateUserAPIFormData) => {
    try {
      setSubmitting(true)
      
      const updateData = {
        ...data,
        tags: tags,
      }

      console.log('更新用户API:', updateData)
      
      await updateUserAPI(apiId, updateData)
      
      toast.success('API更新成功！')
      
      // 返回到API Provider页面
      router.push('/api-provider')
      
    } catch (error: unknown) {
      console.error('更新API失败:', error)
      const errorMessage = error instanceof Error ? error.message : '更新失败'
      toast.error(`更新失败：${errorMessage}`)
    } finally {
      setSubmitting(false)
    }
  }, [apiId, tags]) // 移除toast和router依赖

  useEffect(() => {
    loadAPI()
  }, [loadAPI])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载API信息中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!api) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">API不存在或您没有访问权限</p>
            <Button asChild>
              <Link href="/api-provider">返回列表</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 页面标题 */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/api-provider" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-foreground">
            编辑 API: {api.name}
          </h1>
          <Badge 
            variant="outline" 
            className={`${api.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}
          >
            {api.status === 'draft' ? '草稿' : api.status}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          编辑您的API信息。保存后，如果是草稿状态的API将继续保持草稿状态。
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* API名称和标识 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  API 名称 <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register('name')}
                  placeholder="例如：天气预报API"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  API 标识 (slug) <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register('slug')}
                  placeholder="例如：weather-forecast"
                  className={errors.slug ? 'border-destructive' : ''}
                />
                {errors.slug && (
                  <p className="text-destructive text-sm mt-1">{errors.slug.message}</p>
                )}
                <p className="text-muted-foreground text-xs mt-1">
                  用于生成API访问URL，只能包含小写字母、数字和连字符
                </p>
              </div>
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                简短描述 <span className="text-destructive">*</span>
              </label>
              <Input
                {...register('short_description')}
                placeholder="简要描述您的API功能..."
                className={errors.short_description ? 'border-destructive' : ''}
              />
              {errors.short_description && (
                <p className="text-destructive text-sm mt-1">{errors.short_description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                详细描述
              </label>
              <textarea
                {...register('long_description')}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="详细介绍您的API功能、使用场景等..."
              />
            </div>

            {/* 分类 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                API 分类 <span className="text-destructive">*</span>
              </label>
              <select
                {...register('category')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {CATEGORIES.map((category) => (
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
            <CardTitle>技术配置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                基础 URL <span className="text-destructive">*</span>
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
                健康检查 URL
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
          </CardContent>
        </Card>

        {/* 链接信息 */}
        <Card>
          <CardHeader>
            <CardTitle>相关链接</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  官方网站
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
                  文档链接
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
                服务条款链接
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
            <CardTitle>标签和文档</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                标签 (最多5个)
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="输入标签..."
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
                API 文档 (Markdown)
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
            <Link href="/api-provider">取消</Link>
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                保存更改
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
