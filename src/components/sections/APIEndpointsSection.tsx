'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  getAPIEndpoints, 
  publishAPIEndpoint, 
  updateAPIEndpoint, 
  deleteAPIEndpoint,
  type APIEndpoint,
  type PublishEndpointRequest,
  type UpdateEndpointRequest 
} from '@/services/api-endpoints'
import { getUserAPI } from '@/services/user-api'
import type { MarketAPI } from '@/services/market-api'
import { 
  ArrowLeft, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Trash2, 
  Save, 
  X 
} from 'lucide-react'

interface APIEndpointsSectionProps {
  apiId: string
}

export default function APIEndpointsSection({ apiId }: APIEndpointsSectionProps) {
  const [api, setApi] = useState<MarketAPI | null>(null)
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set())
  const [editingEndpoint, setEditingEndpoint] = useState<string | null>(null)
  const [creatingNew, setCreatingNew] = useState(false)
  const [deletingEndpoint, setDeletingEndpoint] = useState<string | null>(null)
  
  const { theme } = useTheme()
  const { t } = useTranslation()
  const toast = useToast()
  const router = useRouter()

  // 稳定化翻译对象
  const translations = useMemo(() => t.endpoints, [t.endpoints])

  // 获取HTTP方法的样式
  const getMethodStyle = useCallback((method: string) => {
    switch (method.toLowerCase()) {
      case 'get':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
      case 'post':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
      case 'put':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
      case 'patch':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
      case 'delete':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
    }
  }, [])

  // 格式化数字
  const formatNumber = useCallback((num: number | null | undefined) => {
    if (num == null) return '0'
    return num.toLocaleString()
  }, [])

  // 格式化百分比
  const formatPercentage = useCallback((num: number | null | undefined) => {
    if (num == null) return '0.0%'
    return `${num.toFixed(1)}%`
  }, [])

  // 格式化时间
  const formatTime = useCallback((seconds: number | null | undefined) => {
    if (seconds == null) return '0ms'
    if (seconds < 1000) {
      return `${Math.round(seconds)}ms`
    }
    return `${(seconds / 1000).toFixed(1)}s`
  }, [])

  // 加载API信息和端点列表
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      
      // 并行加载API信息和端点列表
      const [apiResponse, endpointsResponse] = await Promise.all([
        getUserAPI(apiId),
        getAPIEndpoints(apiId)
      ])
      
      setApi(apiResponse.data)
      setEndpoints(endpointsResponse.data || [])
      
    } catch (error: unknown) {
      console.error('加载数据失败:', error)
      const errorMessage = error instanceof Error ? error.message : '加载失败'
      toast.error(errorMessage)
      // 返回到API Provider页面
      router.push('/api-provider')
    } finally {
      setLoading(false)
    }
  }, [apiId]) // 移除toast和router依赖避免无限循环

  // 切换端点展开/收起状态
  const toggleEndpoint = useCallback((endpointId: string) => {
    setExpandedEndpoints(prev => {
      const newSet = new Set(prev)
      if (newSet.has(endpointId)) {
        newSet.delete(endpointId)
      } else {
        newSet.add(endpointId)
      }
      return newSet
    })
  }, [])

  // 开始编辑端点
  const startEditing = useCallback((endpointId: string) => {
    setEditingEndpoint(endpointId)
    setExpandedEndpoints(prev => new Set(prev).add(endpointId))
  }, [])

  // 取消编辑
  const cancelEditing = useCallback(() => {
    setEditingEndpoint(null)
    setCreatingNew(false)
  }, [])

  // 删除端点
  const handleDeleteEndpoint = useCallback(async (endpointId: string, endpointName: string) => {
    if (!confirm(`${translations.deleteConfirmMessage}\n端点: ${endpointName}`)) {
      return
    }

    try {
      setDeletingEndpoint(endpointId)
      await deleteAPIEndpoint(apiId, endpointId)
      
      // 从列表中移除已删除的端点
      setEndpoints(prev => prev.filter(ep => ep.id !== endpointId))
      setExpandedEndpoints(prev => {
        const newSet = new Set(prev)
        newSet.delete(endpointId)
        return newSet
      })
      
      toast.success(translations.deleteSuccess)
    } catch (error: unknown) {
      console.error('删除端点失败:', error)
      const errorMessage = error instanceof Error ? error.message : translations.deleteFailed
      toast.error(errorMessage)
    } finally {
      setDeletingEndpoint(null)
    }
  }, [apiId, translations]) // 移除toast依赖避免无限循环

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">{translations.loading}</p>
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* 页面标题和返回按钮 */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/api-provider" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {api.name} - {translations.title}
            </h1>
            <p className="text-muted-foreground">
              {translations.description}
            </p>
          </div>
          <Button 
            onClick={() => setCreatingNew(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {translations.createNew}
          </Button>
        </div>
      </div>

      {/* 端点列表 */}
      {endpoints.length === 0 && !creatingNew ? (
        /* 空状态 */
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-24 h-24 mb-6 flex items-center justify-center">
            <img 
              src={theme === 'dark' ? "/chipswhite.svg" : "/chipsblack.svg"} 
              alt="No endpoints" 
              className="w-full h-full object-contain"
            />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {translations.noEndpoints}
          </h3>
          <Button 
            onClick={() => setCreatingNew(true)}
            className="flex items-center gap-2 mt-4"
          >
            <Plus className="w-4 h-4" />
            {translations.createNew}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
                      {/* 发布新端点表单 */}
          {creatingNew && (
            <EndpointForm
              apiId={apiId}
              isCreating={true}
              onSave={async (data) => {
                try {
                  const response = await publishAPIEndpoint(apiId, data)
                  setEndpoints(prev => [...prev, response.data])
                  setCreatingNew(false)
                  toast.success(translations.createSuccess)
                } catch (error: unknown) {
                  const errorMessage = error instanceof Error ? error.message : translations.createFailed
                  toast.error(errorMessage)
                }
              }}
              onCancel={cancelEditing}
            />
          )}

          {/* 端点列表 */}
          {endpoints.map((endpoint) => (
            <EndpointItem
              key={endpoint.id}
              endpoint={endpoint}
              apiId={apiId}
              expanded={expandedEndpoints.has(endpoint.id)}
              editing={editingEndpoint === endpoint.id}
              deleting={deletingEndpoint === endpoint.id}
              onToggle={toggleEndpoint}
              onStartEdit={startEditing}
              onCancelEdit={cancelEditing}
              onSave={async (data) => {
                try {
                  const response = await updateAPIEndpoint(apiId, endpoint.id, data)
                  setEndpoints(prev => 
                    prev.map(ep => ep.id === endpoint.id ? response.data : ep)
                  )
                  setEditingEndpoint(null)
                  toast.success(translations.updateSuccess)
                } catch (error: unknown) {
                  const errorMessage = error instanceof Error ? error.message : translations.updateFailed
                  toast.error(errorMessage)
                }
              }}
              onDelete={handleDeleteEndpoint}
              getMethodStyle={getMethodStyle}
              formatNumber={formatNumber}
              formatPercentage={formatPercentage}
              formatTime={formatTime}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 端点项组件
interface EndpointItemProps {
  endpoint: APIEndpoint
  apiId: string
  expanded: boolean
  editing: boolean
  deleting: boolean
  onToggle: (id: string) => void
  onStartEdit: (id: string) => void
  onCancelEdit: () => void
  onSave: (data: UpdateEndpointRequest) => Promise<void>
  onDelete: (id: string, name: string) => Promise<void>
  getMethodStyle: (method: string) => string
  formatNumber: (num: number | null | undefined) => string
  formatPercentage: (num: number | null | undefined) => string
  formatTime: (seconds: number | null | undefined) => string
}

function EndpointItem({
  endpoint,
  apiId,
  expanded,
  editing,
  deleting,
  onToggle,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
  getMethodStyle,
  formatNumber,
  formatPercentage,
  formatTime
}: EndpointItemProps) {
  const { t } = useTranslation()
  const translations = useMemo(() => t.endpoints, [t.endpoints])

  if (editing) {
    return (
      <EndpointForm
        apiId={apiId}
        endpoint={endpoint}
        onSave={onSave}
        onCancel={onCancelEdit}
      />
    )
  }

  return (
    <Card className="transition-all duration-200">
      <CardHeader 
        className="cursor-pointer transition-colors"
        onClick={() => onToggle(endpoint.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            <Badge 
              variant="outline" 
              className={`${getMethodStyle(endpoint.method)} text-xs font-mono`}
            >
              {endpoint.method.toUpperCase()}
            </Badge>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {endpoint.path}
              </CardTitle>
              <p className="text-sm text-muted-foreground truncate">
                {endpoint.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground hidden sm:block">
              {formatNumber(endpoint.total_calls)} calls • {formatPercentage(endpoint.success_rate)}
            </div>
            <Badge variant={endpoint.is_active ? "default" : "secondary"} className="text-xs">
              {endpoint.is_active ? translations.active : translations.inactive}
            </Badge>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 border-t border-border/50 animate-in slide-in-from-top-2 duration-200">
          <div className="grid gap-6">
            {/* 基本信息 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">基本信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.endpointName}:</span>
                    <span>{endpoint.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.endpointDescription}:</span>
                    <span>{endpoint.description || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.type}:</span>
                    <Badge variant="outline" className="text-xs">
                      {endpoint.endpoint_type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.pricePerCall}:</span>
                    <span>${endpoint.price_per_call}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">统计信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.totalCalls}:</span>
                    <span>{formatNumber(endpoint.total_calls)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.successRate}:</span>
                    <span>{formatPercentage(endpoint.success_rate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{translations.avgResponseTime}:</span>
                    <span>{formatTime(endpoint.avg_response_time)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 请求参数 */}
            <div>
              <h4 className="font-medium mb-3">请求参数</h4>
              <div className="grid gap-4">
                {/* Headers */}
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground mb-2">{translations.headersLabel}</h5>
                  <div className="bg-muted/30 rounded-md p-3">
                    {Object.keys(endpoint.headers || {}).length === 0 ? (
                      <span className="text-sm text-muted-foreground">无</span>
                    ) : (
                      <pre className="text-xs overflow-auto max-h-32">
                        {JSON.stringify(endpoint.headers, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>

                {/* Query Parameters */}
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground mb-2">{translations.queryParamsLabel}</h5>
                  <div className="bg-muted/30 rounded-md p-3">
                    {Object.keys(endpoint.query_params || {}).length === 0 ? (
                      <span className="text-sm text-muted-foreground">无</span>
                    ) : (
                      <pre className="text-xs overflow-auto max-h-32">
                        {JSON.stringify(endpoint.query_params, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>

                {/* Body Parameters */}
                <div>
                  <h5 className="text-sm font-medium text-muted-foreground mb-2">{translations.bodyParamsLabel}</h5>
                  <div className="bg-muted/30 rounded-md p-3">
                    {Object.keys(endpoint.body_params || {}).length === 0 ? (
                      <span className="text-sm text-muted-foreground">无</span>
                    ) : (
                      <pre className="text-xs overflow-auto max-h-32">
                        {JSON.stringify(endpoint.body_params, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-2 pt-4 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStartEdit(endpoint.id)}
                className="flex items-center gap-2"
              >
                <Edit className="w-3 h-3" />
                {translations.edit}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(endpoint.id, endpoint.name)}
                disabled={deleting}
                className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3 h-3" />
                {deleting ? '删除中...' : translations.delete}
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

// 端点表单组件
interface EndpointFormProps {
  apiId: string
  endpoint?: APIEndpoint
  isCreating?: boolean
  onSave: (data: any) => Promise<void>  // 使用any以避免复杂的联合类型
  onCancel: () => void
}

function EndpointForm({ endpoint, isCreating = false, onSave, onCancel }: EndpointFormProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: endpoint?.name || '',
    description: endpoint?.description || '',
    path: endpoint?.path || '',
    method: endpoint?.method || 'GET',
    endpoint_type: endpoint?.endpoint_type || 'rest' as 'rest' | 'graphql',
    price_per_call: endpoint?.price_per_call || 0.01,
    headers: endpoint?.headers ? JSON.stringify(endpoint.headers, null, 2) : '',
    query_params: endpoint?.query_params ? JSON.stringify(endpoint.query_params, null, 2) : '',
    body_params: endpoint?.body_params ? JSON.stringify(endpoint.body_params, null, 2) : '',
    response_body: endpoint?.response_body ? JSON.stringify(endpoint.response_body, null, 2) : '',
  })

  const { t } = useTranslation()
  const translations = useMemo(() => t.endpoints, [t.endpoints])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      
      // 尝试解析JSON，失败时使用空对象，不提示错误
      const parseJsonSafely = (str: string) => {
        try {
          return JSON.parse(str || '{}')
        } catch {
          return {}
        }
      }
      
      const data = {
        ...formData,
        headers: parseJsonSafely(formData.headers),
        query_params: parseJsonSafely(formData.query_params),
        body_params: parseJsonSafely(formData.body_params),
        response_body: parseJsonSafely(formData.response_body),
      }
      
      await onSave(data)
      
    } catch (error: unknown) {
      console.error('保存失败:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="border-dashed border-2">
      <CardHeader>
        <CardTitle className="text-lg">
          {isCreating ? translations.createNew : `${translations.edit} - ${endpoint?.name}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.nameLabel} <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="端点名称"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.pathLabel} <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.path}
                onChange={(e) => handleChange('path', e.target.value)}
                placeholder="/example/path"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.methodLabel} <span className="text-destructive">*</span>
              </label>
              <select
                value={formData.method}
                onChange={(e) => handleChange('method', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.typeLabel}
              </label>
              <select
                value={formData.endpoint_type}
                onChange={(e) => handleChange('endpoint_type', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="rest">REST</option>
                <option value="graphql">GraphQL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.priceLabel}
              </label>
              <Input
                type="number"
                step="0.001"
                value={formData.price_per_call}
                onChange={(e) => handleChange('price_per_call', parseFloat(e.target.value))}
                placeholder="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {translations.descriptionLabel}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="端点描述..."
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.headersLabel}
              </label>
              <textarea
                value={formData.headers}
                onChange={(e) => handleChange('headers', e.target.value)}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder='{"Authorization": {"name": "Authorization", "type": "string"}}'
              />

            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.queryParamsLabel}
              </label>
              <textarea
                value={formData.query_params}
                onChange={(e) => handleChange('query_params', e.target.value)}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder='{"page": {"name": "page", "type": "number"}}'
              />

            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {translations.bodyParamsLabel}
              </label>
              <textarea
                value={formData.body_params}
                onChange={(e) => handleChange('body_params', e.target.value)}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                placeholder='{"data": {"name": "data", "type": "object"}}'
              />

            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {translations.responseBodyLabel}
            </label>
            <textarea
              value={formData.response_body}
              onChange={(e) => handleChange('response_body', e.target.value)}
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              placeholder='{"success": true, "data": {"id": "123", "name": "example"}}'
            />
            <p className="text-xs text-muted-foreground mt-1">请使用标准JSON格式，属性名需用双引号</p>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  {translations.save}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <X className="w-3 h-3" />
              {translations.cancel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
