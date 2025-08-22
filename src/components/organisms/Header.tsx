'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CachedAvatar } from '@/components/ui/cached-avatar'
import { useAuth } from '@/hooks/useAuth'
import { useUserCache } from '@/hooks/useUserCache'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useTranslation } from '@/components/providers/LanguageProvider'

export function Header() {
  const { showAuthModal, authLoading } = useAuth()
  const { user, isLoggedIn, loading, clearUser } = useUserCache()
  const { theme } = useTheme()
  const { t } = useTranslation()

  const handleLogout = async () => {
    try {
      clearUser()
      // 刷新页面
      window.location.reload()
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-[60px] bg-card/90 backdrop-blur-md border-b border-border/50 shadow-sm flex items-center justify-between px-8 z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <div className="w-[88px] h-[23px] relative">
          <Image
            src={theme === 'dark' ? "/volalogo.svg" : "/volalogol.svg"}
            alt="Vola Logo"
            width={88}
            height={23}
            className="object-contain"
          />
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-4">
        {/* 
        <Link 
          href="/docs" 
          className="text-foreground/80 hover:text-foreground font-medium text-sm transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-accent/10"
        >
          {t.nav.docs}
        </Link>
        */}
        <Link 
          href="/pricing" 
          className="text-foreground/80 hover:text-foreground font-medium text-sm transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-accent/10"
        >
          {t.nav.pricing}
        </Link>
        
        {/* Admin Link - Only for Admins */}
        {isLoggedIn && user && user.role?.toUpperCase() === 'ADMIN' && (
          <Link 
            href="/admin2025" 
            className="text-foreground/80 hover:text-foreground font-medium text-sm transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-accent/10 border border-primary/20 bg-primary/5"
          >
            Admin
          </Link>
        )}
        
        {/* User Area */}
        {loading ? (
          <div className="w-7 h-7 bg-muted rounded-full animate-pulse"></div>
        ) : isLoggedIn && user ? (
          <Link href="/profile">
            <CachedAvatar 
              src={user.avatar_url} 
              alt={user.full_name || 'User Avatar'}
              className="cursor-pointer ring-2 ring-transparent hover:ring-primary/20"
              size={29}
              fallback={
                <div className="bg-muted text-foreground text-sm font-medium w-full h-full flex items-center justify-center">
                  {user.full_name?.charAt(0) || user.username?.charAt(0) || user.email?.charAt(0)}
                </div>
              }
            />
          </Link>
        ) : (
                    <Button
            onClick={() => showAuthModal('email')}
            disabled={authLoading}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm"
          >
            {t.nav.getStarted}
          </Button>
        )}
      </nav>
    </header>
  )
}
