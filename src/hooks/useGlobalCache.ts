'use client'

type Theme = 'light' | 'dark'

// 全局应用缓存，统一管理用户相关的缓存数据
let globalAppCache: {
  theme?: Theme
  themeTimestamp: number
  avatar?: string
  avatarTimestamp: number
} = {
  theme: undefined,
  themeTimestamp: 0,
  avatar: undefined,
  avatarTimestamp: 0,
}

const THEME_CACHE_KEY = 'vola_app_theme'
const CACHE_EXPIRY_TIME = 30 * 60 * 1000 // 30分钟

/**
 * 全局缓存管理 Hook
 * 统一管理主题、头像等用户界面相关的缓存
 */
export const useGlobalCache = () => {
  // 获取缓存的主题
  const getCachedTheme = (): Theme | null => {
    const now = Date.now()

    // 优先从内存缓存获取
    if (globalAppCache.theme && now - globalAppCache.themeTimestamp < CACHE_EXPIRY_TIME) {
      return globalAppCache.theme
    }

    // 从localStorage获取
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem(THEME_CACHE_KEY) as Theme | null
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          globalAppCache.theme = savedTheme
          globalAppCache.themeTimestamp = now
          return savedTheme
        }
      } catch (error) {
        console.warn('无法读取主题缓存:', error)
      }
    }

    return null
  }

  // 设置缓存的主题
  const setCachedTheme = (theme: Theme) => {
    const now = Date.now()
    globalAppCache.theme = theme
    globalAppCache.themeTimestamp = now

    // 保存到localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(THEME_CACHE_KEY, theme)
      } catch (error) {
        console.warn('无法保存主题缓存:', error)
      }
    }
  }

  // 获取缓存的头像
  const getCachedAvatar = (): string | null => {
    const now = Date.now()

    if (globalAppCache.avatar && now - globalAppCache.avatarTimestamp < CACHE_EXPIRY_TIME) {
      return globalAppCache.avatar
    }

    return null
  }

  // 设置缓存的头像
  const setCachedAvatar = (avatar: string) => {
    const now = Date.now()
    globalAppCache.avatar = avatar
    globalAppCache.avatarTimestamp = now
  }

  // 清除所有缓存
  const clearCache = () => {
    globalAppCache = {
      theme: undefined,
      themeTimestamp: 0,
      avatar: undefined,
      avatarTimestamp: 0,
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(THEME_CACHE_KEY)
      } catch (error) {
        console.warn('无法清除主题缓存:', error)
      }
    }
  }

  return {
    getCachedTheme,
    setCachedTheme,
    getCachedAvatar,
    setCachedAvatar,
    clearCache,
  }
}
