'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { X, Plus, Trash2, Save } from 'lucide-react'
import { publishAPI } from '@/services/admin-api'

// 表单验证模式
const createAPISchema = z.object({
  name: z.string().min(1, 'API名称不能为空').max(255, 'API名称不能超过255个字符'),
  slug: z.string()
    .min(1, 'API标识不能为空')
    .regex(/^[a-z0-9-]+$/, 'API标识只能包含小写字母、数字和连字符'),
  short_description: z.string().min(1, '简短描述不能为空').max(100, '简短描述不能超过100个字符'),
  long_description: z.string().optional(),
  category: z.enum(['data', 'ai_ml', 'finance', 'social', 'tools', 'communication', 'entertainment', 'business', 'other']),
  base_url: z.string().url('请输入有效的URL'),
  health_check_url: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  is_public: z.boolean().default(true),
  website_url: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  documentation_url: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  terms_url: z.string().url('请输入有效的URL').optional().or(z.literal('')),
  gateway_key: z.string().optional(),
  documentation_markdown: z.string().optional(),
})

type CreateAPIFormData = z.infer<typeof createAPISchema>

interface CreateAPIFormProps {
  onClose: () => void
  onSuccess: () => void
}

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
] as const

export default function CreateAPIForm({ onClose, onSuccess }: CreateAPIFormProps) {
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(createAPISchema),
    defaultValues: {
      category: 'data',
      is_public: true,
    }
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
    setTags(tags.filter(tag => tag !== tagToRemove))
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

      // 详细的请求日志
      console.group('🚀 [CreateAPIForm] 开始发布API请求')
      console.log('🔧 [CreateAPIForm] 当前模式: 直接请求后端服务器')
      console.log('💡 [CreateAPIForm] 配置说明: 按用户要求启用直接API访问')
      console.log('🎯 [CreateAPIForm] 请求路径: https://api.vola.fun/api/v1/apis/')
      console.log('📤 [CreateAPIForm] 发送数据:', JSON.stringify(apiData, null, 2))
      console.log('🌍 [CreateAPIForm] 当前环境:', process.env.NODE_ENV)
      console.log('⏰ [CreateAPIForm] 请求时间:', new Date().toISOString())
      
      // 🔍 Network面板调试指导
      console.group('🔍 Network面板调试指导 (直接API模式)')
      console.log('%c1. 打开浏览器开发者工具的Network面板', 'color: #4CAF50; font-weight: bold;')
      console.log('%c2. 确保勾选了"Preserve log"选项', 'color: #2196F3; font-weight: bold;')
      console.log('%c3. 查找以下请求链路:', 'color: #FF9800; font-weight: bold;')
      console.log('   • OPTIONS https://api.vola.fun/api/v1/apis/ - CORS预检请求')
      console.log('   • POST https://api.vola.fun/api/v1/apis/ - 实际的API发布请求')
      console.log('   • 直接访问后端服务器，跳过代理层')
      console.log('   • 如果出现CORS错误，这是正常现象')
      console.log('%c4. ⚠️ 注意：可能出现跨域限制', 'color: #FF9800; font-weight: bold;')
      console.log('%c5. 🎯 优势：直接观察后端响应', 'color: #4CAF50; font-weight: bold;')
      console.groupEnd()
      console.groupEnd()
      
      // 调用API并记录响应
      const startTime = Date.now()
      const response = await publishAPI(apiData)
      const endTime = Date.now()
      
      console.log('✅ [CreateAPIForm] API发布成功')
      console.log('📥 [CreateAPIForm] 响应数据:', JSON.stringify(response, null, 2))
      console.log('⏱️ [CreateAPIForm] 请求耗时:', `${endTime - startTime}ms`)
      
              toast.success('API发布成功！')
      onSuccess()
    } catch (error: any) {
              console.group('❌ [CreateAPIForm] API发布失败')
      console.error('完整错误对象:', error)
      console.error('错误消息:', error.message)
      console.error('错误堆栈:', error.stack)
      
      // 如果是网络错误，记录更多详细信息
      if (error.response) {
        console.error('📥 HTTP响应状态:', error.response.status)
        console.error('📥 HTTP响应头:', error.response.headers)
        console.error('📥 HTTP响应数据:', error.response.data)
      } else if (error.request) {
        console.error('📤 HTTP请求对象:', error.request)
        console.error('📤 请求未收到响应')
      } else {
        console.error('⚠️ 请求配置错误:', error.config)
      }
      
      // 记录更多环境信息
      console.error('🌍 当前URL:', window.location.href)
      console.error('🌍 User Agent:', navigator.userAgent)
      console.error('⏰ 错误时间:', new Date().toISOString())
      console.groupEnd()
      
      toast.error(`发布API失败: ${error.message || '未知错误'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 sticky top-0 bg-card z-10 border-b">
          <CardTitle className="text-xl">New API</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">基本信息</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    API名称 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="例: Weather API"
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    API标识 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('slug')}
                    placeholder="例: weather-api"
                    className={errors.slug ? 'border-destructive' : ''}
                  />
                  {errors.slug && (
                    <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  简短描述 <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register('short_description')}
                  placeholder="例: 提供全球天气信息查询服务"
                  className={errors.short_description ? 'border-destructive' : ''}
                />
                {errors.short_description && (
                  <p className="text-sm text-destructive mt-1">{errors.short_description.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  详细描述
                </label>
                <textarea
                  {...register('long_description')}
                  placeholder="详细描述API的功能和特性..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  rows={3}
                />
              </div>
            </div>

            {/* 分类和标签 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">分类和标签</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    API分类 <span className="text-destructive">*</span>
                  </label>
                  <select
                    {...register('category')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {CATEGORIES.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    标签 (最多3个)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="添加标签"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      disabled={tags.length >= 3}
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      size="sm"
                      variant="outline"
                      disabled={!newTag.trim() || tags.includes(newTag.trim()) || tags.length >= 3}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-2 py-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* URL配置 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">URL配置</h3>
              
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    API基础URL <span className="text-destructive">*</span>
                  </label>
                  <Input
                    {...register('base_url')}
                    placeholder="https://api.myweather.com"
                    className={errors.base_url ? 'border-destructive' : ''}
                  />
                  {errors.base_url && (
                    <p className="text-sm text-destructive mt-1">{errors.base_url.message}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      健康检查URL
                    </label>
                    <Input
                      {...register('health_check_url')}
                      placeholder="https://api.myweather.com/health"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      官方网站URL
                    </label>
                    <Input
                      {...register('website_url')}
                      placeholder="https://myweather.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      API文档URL
                    </label>
                    <Input
                      {...register('documentation_url')}
                      placeholder="https://docs.myweather.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      服务条款URL
                    </label>
                    <Input
                      {...register('terms_url')}
                      placeholder="https://myweather.com/terms"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 其他设置 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">其他设置</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    网关密钥
                  </label>
                  <Input
                    {...register('gateway_key')}
                    placeholder="secret_key_for_gateway_authentication"
                    type="password"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    用于自动填充请求中的 x-vola-gateway 头
                  </p>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    {...register('is_public')}
                    className="h-4 w-4 rounded border border-input"
                  />
                  <label className="text-sm font-medium text-foreground">
                    公开API（其他用户可见）
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Markdown格式的API文档
                </label>
                <textarea
                  {...register('documentation_markdown')}
                  placeholder="# Weather API&#10;&#10;## 使用说明&#10;&#10;这个API提供全球天气信息查询服务。"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                  rows={4}
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    发布中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    发布API
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
