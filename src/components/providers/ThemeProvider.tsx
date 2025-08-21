'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useGlobalCache } from '@/hooks/useGlobalCache'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

// 获取初始主题，避免闪烁（使用全局缓存）
function getInitialTheme(defaultTheme: Theme = 'dark'): Theme {
  if (typeof window === 'undefined') return defaultTheme
  
  try {
    const savedTheme = localStorage.getItem('vola_app_theme') as Theme | null
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme
    }
  } catch (error) {
    console.warn('无法读取主题设置:', error)
  }
  
  return defaultTheme
}

export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  const { getCachedTheme, setCachedTheme } = useGlobalCache()
  
  // 服务端总是使用默认主题，避免hydration不匹配
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  // 更新主题的函数
  const updateTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    
    // 更新DOM
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)
    }
    
    // 保存到全局缓存
    setCachedTheme(newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    updateTheme(newTheme)
  }

  const setTheme = (newTheme: Theme) => {
    updateTheme(newTheme)
  }

  // 只在客户端挂载时读取缓存主题
  useEffect(() => {
    setMounted(true)
    
    // 读取缓存的主题，如果存在就更新
    const cachedTheme = getCachedTheme()
    if (cachedTheme && cachedTheme !== defaultTheme) {
      setThemeState(cachedTheme)
      
      // 更新DOM以匹配缓存的主题
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(cachedTheme)
    } else if (!cachedTheme) {
      // 如果没有缓存，应用默认主题到DOM
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(defaultTheme)
    }
  }, [])

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
