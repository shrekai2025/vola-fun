'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useGlobalCache } from '@/hooks/ui'

type Theme = 'light' | 'dark' | 'system'

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

export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  const { getCachedTheme, setCachedTheme } = useGlobalCache()

  // 服务端总是使用默认主题，避免hydration不匹配
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [, setMounted] = useState(false)

  // 更新主题的函数
  const updateTheme = (newTheme: Theme) => {
    setThemeState(newTheme)

    // 更新DOM
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      root.classList.remove('light', 'dark')

      if (newTheme === 'system') {
        // 系统主题根据用户设备偏好决定
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        root.classList.add(systemTheme)
      } else {
        root.classList.add(newTheme)
      }
    }

    // 保存到全局缓存
    setCachedTheme(newTheme)
  }

  const toggleTheme = () => {
    let newTheme: Theme
    if (theme === 'light') {
      newTheme = 'dark'
    } else if (theme === 'dark') {
      newTheme = 'system'
    } else {
      newTheme = 'light'
    }
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

      if (cachedTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        root.classList.add(systemTheme)
      } else {
        root.classList.add(cachedTheme)
      }
    } else if (!cachedTheme) {
      // 如果没有缓存，应用默认主题到DOM
      const root = document.documentElement
      root.classList.remove('light', 'dark')

      if (defaultTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        root.classList.add(systemTheme)
      } else {
        root.classList.add(defaultTheme)
      }
    }
  }, [defaultTheme, getCachedTheme])

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  }

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
