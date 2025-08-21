'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserCache } from '@/hooks/useUserCache'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { Plus, Settings, Database } from 'lucide-react'
import CreateAPIForm from './components/CreateAPIForm'

export default function AdminPage() {
  const { user, isLoggedIn, loading } = useUserCache()
  const router = useRouter()
  const toast = useToast()
  const { t } = useTranslation()
  
  const [showCreateForm, setShowCreateForm] = useState(false)

  // 权限检查
  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn || !user) {
        // 未登录，返回404
        router.replace('/404')
        return
      }
      
      // 检查用户角色
      const userRole = user.role?.toUpperCase() || ''
      if (userRole !== 'ADMIN') {
        // 非管理员，返回404
        router.replace('/404')
        return
      }
    }
  }, [loading, isLoggedIn, user, router])

  // 加载状态
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  // 权限验证失败，不渲染内容（将被重定向）
  if (!isLoggedIn || !user || user.role?.toUpperCase() !== 'ADMIN') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面头部 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              System Administration
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage API services and system configuration
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            <Database className="h-4 w-4 mr-2" />
            Admin Panel
          </Badge>
        </div>

        {/* 功能卡片网格 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* API 管理卡片 */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                API Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Create and manage API services in the marketplace
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="w-full"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New API
              </Button>
            </CardContent>
          </Card>

          {/* 其他管理功能卡片可以后续添加 */}
          <Card className="hover:shadow-lg transition-shadow opacity-60">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Manage user accounts and permissions
              </p>
              <Button variant="outline" size="sm" disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow opacity-60">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5 text-muted-foreground" />
                System Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                View system performance and usage statistics
              </p>
              <Button variant="outline" size="sm" disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* API 创建表单模态框 */}
        {showCreateForm && (
          <CreateAPIForm 
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false)
              toast.success('API created successfully!')
            }}
          />
        )}
      </div>
    </div>
  )
}
