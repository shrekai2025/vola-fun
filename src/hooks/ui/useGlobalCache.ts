/**
 * 全局缓存管理 Hook
 * 统一管理主题、头像等用户界面相关的缓存
 */

'use client'

import type { Theme } from '@/types/ui'

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
    if (
      globalAppCache.theme &&
      globalAppCache.themeTimestamp &&
      now - globalAppCache.themeTimestamp < CACHE_EXPIRY_TIME
    ) {
      return globalAppCache.theme
    }

    // 从localStorage获取
    try {
      const cachedTheme = localStorage.getItem(THEME_CACHE_KEY)
      if (
        cachedTheme &&
        (cachedTheme === 'light' || cachedTheme === 'dark' || cachedTheme === 'system')
      ) {
        // 更新内存缓存
        globalAppCache.theme = cachedTheme as Theme
        globalAppCache.themeTimestamp = now
        return cachedTheme as Theme
      }
    } catch (error) {
      console.warn('无法从localStorage获取主题:', error)
    }

    return null
  }

  // 设置缓存的主题
  const setCachedTheme = (theme: Theme): void => {
    const now = Date.now()

    // 更新内存缓存
    globalAppCache.theme = theme
    globalAppCache.themeTimestamp = now

    // 更新localStorage
    try {
      localStorage.setItem(THEME_CACHE_KEY, theme)
    } catch (error) {
      console.warn('无法保存主题到localStorage:', error)
    }
  }

  // 获取缓存的头像
  const getCachedAvatar = (url?: string): string | null => {
    const now = Date.now()

    if (
      url &&
      globalAppCache.avatar === url &&
      globalAppCache.avatarTimestamp &&
      now - globalAppCache.avatarTimestamp < CACHE_EXPIRY_TIME
    ) {
      return globalAppCache.avatar
    }

    return null
  }

  // 设置缓存的头像
  const setCachedAvatar = (url: string): void => {
    const now = Date.now()
    globalAppCache.avatar = url
    globalAppCache.avatarTimestamp = now
  }

  // 清除所有缓存
  const clearCache = (): void => {
    globalAppCache = {
      theme: undefined,
      themeTimestamp: 0,
      avatar: undefined,
      avatarTimestamp: 0,
    }

    try {
      localStorage.removeItem(THEME_CACHE_KEY)
    } catch (error) {
      console.warn('无法清除localStorage主题缓存:', error)
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
