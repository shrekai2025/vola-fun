'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/api'
import { FirebaseAuthService } from '@/services/firebase-auth'
import { useUserCache } from '@/hooks/useUserCache'
import { User } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ThemeToggleWithLabel } from '@/components/ui/theme-toggle'
import { LanguageSelector } from '@/components/ui/language-selector'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { LogOut } from 'lucide-react'

// 模拟API调用记录数据
const mockCallLogs = [
  { date: '2025.08.21 13:55', apiName: 'Test 123', result: 'Success', cost: '1.0' },
  { date: '2025.08.21 13:55', apiName: 'Test 123', result: 'Failed', cost: '1.0' },
  { date: '2025.08.21 13:55', apiName: 'Test 123', result: 'Success', cost: '1.0' },
]

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const { t } = useTranslation()
  const router = useRouter()
  const { clearUser } = useUserCache()

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true)
        const userInfo = await AuthService.getCurrentUser()
        setUser(userInfo)
      } catch (err: unknown) {
        console.error('获取用户信息失败:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch user info')
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  // 登出功能
  const handleLogout = async () => {
    if (logoutLoading) return

    setLogoutLoading(true)
    try {
      // 1. 调用后端登出 API
      try {
        await AuthService.logout()
      } catch (error) {
        console.warn('Backend logout failed:', error)
        // 即使后端登出失败，我们也继续本地清理
      }

      // 2. Firebase 登出
      await FirebaseAuthService.signOut()

      // 3. 清除用户缓存状态（包含清除Token的逻辑）
      clearUser()

      // 4. 跳转到首页
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      // 即使出错也确保清理状态并跳转到首页
      clearUser()
      router.push('/')
    } finally {
      setLogoutLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='animate-pulse'>
            <div className='h-8 bg-muted rounded w-1/4 mb-6' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='h-64 bg-muted rounded' />
              <div className='h-64 bg-muted rounded' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <Card className='border-destructive'>
            <CardHeader>
              <CardTitle className='text-destructive'>{t('errors.userInfoFailed')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-foreground'>Profile</h1>
          <div className='flex items-center space-x-2'>
            <LanguageSelector variant='outline' size='sm' showLabel />
            <ThemeToggleWithLabel variant='outline' size='sm' />
            <Button
              variant='destructive'
              size='sm'
              onClick={handleLogout}
              disabled={logoutLoading}
              className='flex items-center gap-2'
            >
              <LogOut className='h-4 w-4' />
              {logoutLoading ? 'Logging out...' : 'Log out'}
            </Button>
          </div>
        </div>

        <div className='space-y-6'>
          {/* 用户信息卡片 */}
          <Card>
            <CardContent className='px-6'>
              <div className='flex items-center space-x-4'>
                <Avatar className='h-16 w-16'>
                  <AvatarImage src={user?.avatar_url} alt={user?.full_name || 'User'} />
                  <AvatarFallback className='bg-muted text-foreground text-lg font-semibold'>
                    {user?.full_name?.charAt(0) ||
                      user?.username?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      'U'}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 space-y-2'>
                  <h2 className='text-xl font-semibold text-foreground'>
                    {user?.full_name || user?.username || 'USERNAME'}
                  </h2>
                  <div className='space-y-1'>
                    <div className='flex items-center space-x-2 text-muted-foreground'>
                      <span className='text-sm'>Email</span>
                      <span className='text-foreground'>{user?.email || 'a2424234@gmail.com'}</span>
                    </div>
                    <div className='flex items-center space-x-2 text-muted-foreground'>
                      <span className='text-sm'>Plan</span>
                      <Badge variant='secondary' className='bg-muted text-foreground'>
                        {user?.plan === 'basic' ? 'Free' : user?.plan || 'Free'}
                      </Badge>
                      <Button variant='outline' size='sm' className='ml-2 h-6 px-2 text-xs'>
                        Manage Subscription
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 信用额度卡片 */}
          <Card>
            <CardContent className='px-6'>
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <p className='text-muted-foreground text-sm mb-1'>Remaining Credit</p>
                  <p className='text-2xl font-semibold text-foreground'>1,245</p>
                </div>
                <div>
                  <p className='text-muted-foreground text-sm mb-1'>Extra Credit</p>
                  <p className='text-2xl font-semibold text-foreground'>1,245</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call log卡片 */}
          <Card>
            <CardHeader>
              <CardTitle>Call log</CardTitle>
            </CardHeader>
            <CardContent className='py-4'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-border'>
                      <th className='text-left py-3 text-sm font-medium text-muted-foreground'>
                        Date
                      </th>
                      <th className='text-left py-3 text-sm font-medium text-muted-foreground'>
                        API Name
                      </th>
                      <th className='text-left py-3 text-sm font-medium text-muted-foreground'>
                        Result
                      </th>
                      <th className='text-left py-3 text-sm font-medium text-muted-foreground'>
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCallLogs.map((log, index) => (
                      <tr key={index} className='border-b border-border/50'>
                        <td className='py-3 text-sm text-muted-foreground'>{log.date}</td>
                        <td className='py-3 text-sm text-foreground'>{log.apiName}</td>
                        <td className='py-3 text-sm'>
                          <span
                            className={`${log.result === 'Success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                          >
                            {log.result}
                          </span>
                        </td>
                        <td className='py-3 text-sm text-muted-foreground'>{log.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
