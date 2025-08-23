'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CachedAvatar } from '@/components/ui/cached-avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { useUnifiedUserCache } from '@/hooks/useUnifiedData'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useTranslation } from '@/components/providers/LanguageProvider'

export function Header() {
  const { showAuthModal, authLoading } = useAuth()
  const { user, isLoggedIn, loading, clearUser } = useUnifiedUserCache()
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
    <header className="fixed top-0 left-0 right-0 w-full h-[52px] bg-card/90 backdrop-blur-md border-b border-border/50 shadow-sm flex items-center justify-between px-8 z-50">
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
      <nav className="flex items-center gap-6">
        {/* API Market - 第一位 */}
        <Link 
          href="/#api-market-section" 
          className="text-foreground/80 hover:text-foreground font-medium text-sm transition-colors duration-200 hover:underline underline-offset-4"
        >
          API Market
        </Link>
        
        {/* DOCs - 第二位 */}
        <Link 
          href="#" 
          className="text-foreground/80 hover:text-foreground font-medium text-sm transition-colors duration-200 hover:underline underline-offset-4"
        >
          DOCs
        </Link>
        
        <Link 
          href="/pricing" 
          className="text-foreground/80 hover:text-foreground font-medium text-sm transition-colors duration-200 hover:underline underline-offset-4"
        >
          {t.nav.pricing}
        </Link>
        
        {/* Admin Link - Only for Admins */}
        {isLoggedIn && user && user.role?.toUpperCase() === 'ADMIN' && (
          <Link 
            href="/admin2025" 
            className="text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200 hover:underline underline-offset-4"
          >
            Admin
          </Link>
        )}
        
        {/* User Area */}
        {loading ? (
          <div className="w-7 h-7 bg-muted rounded-full animate-pulse"></div>
        ) : isLoggedIn && user ? (
          <div className="flex items-center gap-3">
            {/* Publish an API Button */}
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium shadow-sm border-0"
            >
              <Link href="/api-provider">
                Publish an API
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full">
                  <CachedAvatar 
                    src={user.avatar_url} 
                    alt={user.full_name || 'User Avatar'}
                    className="cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200"
                    size={29}
                    fallback={
                      <div className="bg-muted text-foreground text-sm font-medium w-full h-full flex items-center justify-center">
                        {user.full_name?.charAt(0) || user.username?.charAt(0) || user.email?.charAt(0)}
                      </div>
                    }
                  />
                </button>
              </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/api-provider" className="cursor-pointer">
                  {t.nav.apiProvider}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  {t.nav.profile}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                {t.nav.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
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
