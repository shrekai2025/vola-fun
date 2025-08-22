'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { useToast } from '@/components/ui/toast'
import { getMarketAPIDetailBySlug, type MarketAPI } from '@/services/market-api'
import { 
  ArrowLeft, 
  Star, 
  Clock, 
  DollarSign, 
  Loader2, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  Globe,
  Play,
  Copy,
  CheckCircle
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ProjectDetailSectionProps {
  slug: string
}

export function ProjectDetailSection({ slug }: ProjectDetailSectionProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const toast = useToast()

  // 状态管理
  const [api, setApi] = useState<MarketAPI | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [apiKey, setApiKey] = useState('vola_test_key_placeholder_12345')
  const [testResult, setTestResult] = useState<{
    success: boolean
    data?: {
      message: string
      timestamp: string
      response_time: string
      status_code: number
    }
    usage?: {
      credits_used: number
      remaining_credits: number
    }
    error?: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  // 提取翻译文本，减少useCallback依赖
  const translations = useMemo(() => ({
    apiKeyCopied: t.projectDetail.apiKeyCopied,
    copyFailed: t.projectDetail.copyFailed,
    testCompleted: t.projectDetail.testCompleted,
    testFailed: t.projectDetail.testFailed
  }), [t.projectDetail.apiKeyCopied, t.projectDetail.copyFailed, t.projectDetail.testCompleted, t.projectDetail.testFailed])

  // 加载API详情
  useEffect(() => {
    const loadAPIDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await getMarketAPIDetailBySlug(slug)
        
        if (response.success) {
          setApi(response.data)
        } else {
          throw new Error(response.message || 'API详情加载失败')
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : '加载失败，请稍后重试'
        console.error('加载API详情失败:', error)
        setError(errorMessage)
        toast.error(errorMessage || '加载API详情失败')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadAPIDetail()
    }
  }, [slug]) // 移除 toast 依赖

  // 返回上一页
  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  // 复制API密钥
  const handleCopyApiKey = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      toast.success(translations.apiKeyCopied)
      setTimeout(() => setCopied(false), 2000)
    } catch (_error) {
      toast.error(translations.copyFailed)
    }
  }, [apiKey, translations])

  // 测试API
  const handleTestAPI = useCallback(async () => {
    if (!api) return
    
    try {
      setTestLoading(true)
      
      // 模拟API测试调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 模拟测试结果
      const mockResult = {
        success: true,
        data: {
          message: "API测试成功",
          timestamp: new Date().toISOString(),
          response_time: "245ms",
          status_code: 200
        },
        usage: {
          credits_used: 1,
          remaining_credits: 9999
        }
      }
      
      setTestResult(mockResult)
      toast.success(translations.testCompleted)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : translations.testFailed
      setTestResult({
        success: false,
        error: errorMessage
      })
      toast.error(translations.testFailed)
    } finally {
      setTestLoading(false)
    }
  }, [api, translations])

  // 格式化价格显示
  const formatPrice = useCallback((totalCalls: number): string => {
    if (totalCalls === 0) return '免费试用'
    if (totalCalls < 1000) return `¥0.01/次`
    if (totalCalls < 10000) return `¥0.005/次`
    return `¥0.002/次`
  }, [])

  // 格式化调用次数
  const formatUsageCount = useCallback((count: number): string => {
    if (count < 1000) return count.toString()
    if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
    return `${(count / 1000000).toFixed(1)}M`
  }, [])

  // 加载状态
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">{t.projectDetail.loading}</span>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error || !api) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t.projectDetail.loadFailed}</h2>
          <p className="text-muted-foreground mb-6">{error || t.projectDetail.apiNotFound}</p>
          <div className="space-x-4">
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.projectDetail.backButton}
            </Button>
            <Button onClick={() => window.location.reload()}>
              {t.projectDetail.retry}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Button 
          onClick={handleBack} 
          variant="ghost" 
          className="pl-0 hover:pl-2 transition-all"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.projectDetail.backButton}
        </Button>
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
        {/* 左侧主要内容 */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* API头部信息 */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {api.avatar_url && (
                    <Image
                      src={api.avatar_url}
                      alt={api.name}
                      width={64}
                      height={64}
                      className="rounded-lg"
                    />
                  )}
                  <div>
                    <CardTitle className="text-2xl">{api.name}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {api.short_description}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {api.rating && api.rating > 0 && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-warning text-warning" />
                      <span className="font-medium">{api.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <Badge variant="secondary" className="text-sm">
                    {api.category}
                  </Badge>
                </div>
              </div>

              {/* 标签 */}
              {api.tags && api.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4">
                  {api.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
          </Card>

          {/* 详细描述 */}
          {api.documentation_markdown && (
            <Card>
              <CardHeader>
                              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                {t.projectDetail.apiDescription}
              </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-muted-foreground leading-relaxed">
                    {api.documentation_markdown}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API测试 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="h-5 w-5 mr-2" />
                {t.projectDetail.apiTest}
              </CardTitle>
              <CardDescription>
                {t.projectDetail.apiTestDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* API密钥输入 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.projectDetail.apiKeyLabel}</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={t.projectDetail.apiKeyPlaceholder}
                    className="flex-1 min-w-0"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyApiKey}
                    className="sm:shrink-0 w-full sm:w-auto"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {t.projectDetail.copied}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        {t.projectDetail.copy}
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.projectDetail.apiKeyNote}
                </p>
              </div>

              {/* 测试按钮 */}
              <Button 
                onClick={handleTestAPI} 
                disabled={testLoading || !apiKey.trim()}
                className="w-full sm:w-auto"
              >
                {testLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t.projectDetail.testing}
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    {t.projectDetail.testButton}
                  </>
                )}
              </Button>

              {/* 测试结果 */}
              {testResult && (
                <Card className={`mt-4 ${testResult.success ? 'border-success' : 'border-destructive'}`}>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      {testResult.success ? (
                        <CheckCircle className="h-4 w-4 mr-2 text-success" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
                      )}
                      {t.projectDetail.testResult}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧边栏 */}
        <div className="space-y-4 lg:space-y-6">
          {/* 统计信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.projectDetail.statistics}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{t.projectDetail.price}</span>
                </div>
                <span className="font-medium">{formatPrice(api.total_calls)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{t.projectDetail.responseTime}</span>
                </div>
                <span className="font-medium">~200ms</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.projectDetail.totalCalls}</span>
                <span className="font-medium">{formatUsageCount(api.total_calls)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.projectDetail.totalRevenue}</span>
                <span className="font-medium">¥{api.total_revenue.toFixed(2)}</span>
              </div>

              {api.status === 'published' && (
                <div className="pt-2">
                  <Badge variant="secondary" className="w-full justify-center">
                    {t.projectDetail.serviceAvailable}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 相关链接 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.projectDetail.relatedLinks}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {api.documentation_url && (
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href={api.documentation_url} target="_blank">
                    <FileText className="h-4 w-4 mr-2" />
                    {t.projectDetail.viewDocs}
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Link>
                </Button>
              )}

              {api.website_url && (
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href={api.website_url} target="_blank">
                    <Globe className="h-4 w-4 mr-2" />
                    {t.projectDetail.officialWebsite}
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Link>
                </Button>
              )}

              {api.terms_url && (
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href={api.terms_url} target="_blank">
                    <FileText className="h-4 w-4 mr-2" />
                    {t.projectDetail.termsOfService}
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Link>
                </Button>
              )}

              {api.health_check_url && (
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link href={api.health_check_url} target="_blank">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {t.projectDetail.healthCheck}
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.projectDetail.basicInfo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.projectDetail.createdAt}</span>
                <span>{new Date(api.created_at).toLocaleDateString('zh-CN')}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.projectDetail.updatedAt}</span>
                <span>{new Date(api.updated_at).toLocaleDateString('zh-CN')}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.projectDetail.apiId}</span>
                <span className="font-mono text-xs">{api.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.projectDetail.accessPermission}</span>
                <span>{api.is_public ? t.projectDetail.publicAccess : t.projectDetail.privateAccess}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
