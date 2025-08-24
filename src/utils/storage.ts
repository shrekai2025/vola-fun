/**
 * 本地存储工具函数
 */

import { STORAGE_KEYS } from '@/constants'

/**
 * 安全的localStorage操作
 */
export const LocalStorage = {
  /**
   * 设置存储项
   */
  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error(`设置localStorage ${key} 失败:`, error)
    }
  },

  /**
   * 获取存储项
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return null
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`获取localStorage ${key} 失败:`, error)
      return null
    }
  },

  /**
   * 删除存储项
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`删除localStorage ${key} 失败:`, error)
    }
  },

  /**
   * 清除所有存储项
   */
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('清除localStorage失败:', error)
    }
  },

  /**
   * 检查是否支持localStorage
   */
  isSupported(): boolean {
    try {
      const testKey = '__localStorage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  },
}

/**
 * 安全的sessionStorage操作
 */
export const SessionStorage = {
  /**
   * 设置存储项
   */
  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value)
      sessionStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error(`设置sessionStorage ${key} 失败:`, error)
    }
  },

  /**
   * 获取存储项
   */
  get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key)
      if (item === null) return null
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`获取sessionStorage ${key} 失败:`, error)
      return null
    }
  },

  /**
   * 删除存储项
   */
  remove(key: string): void {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error(`删除sessionStorage ${key} 失败:`, error)
    }
  },

  /**
   * 清除所有存储项
   */
  clear(): void {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.error('清除sessionStorage失败:', error)
    }
  },

  /**
   * 检查是否支持sessionStorage
   */
  isSupported(): boolean {
    try {
      const testKey = '__sessionStorage_test__'
      sessionStorage.setItem(testKey, 'test')
      sessionStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  },
}

import type { CachedStorageItem } from '@/types/storage'

/**
 * 带过期时间的存储
 */
type CachedItem<T> = CachedStorageItem<T> & { timestamp: number }

export const CachedStorage = {
  /**
   * 设置带过期时间的存储项
   */
  set<T>(key: string, value: T, ttlInMs: number): void {
    const item: CachedItem<T> = {
      value,
      timestamp: Date.now(),
      expiry: Date.now() + ttlInMs,
    }
    LocalStorage.set(key, item)
  },

  /**
   * 获取存储项（检查过期时间）
   */
  get<T>(key: string): T | null {
    const item = LocalStorage.get<CachedItem<T>>(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      // 已过期，删除并返回null
      LocalStorage.remove(key)
      return null
    }

    return item.value
  },

  /**
   * 检查存储项是否存在且未过期
   */
  has(key: string): boolean {
    return this.get(key) !== null
  },

  /**
   * 删除存储项
   */
  remove(key: string): void {
    LocalStorage.remove(key)
  },
}

/**
 * 应用专用存储工具
 */
export const AppStorage = {
  /**
   * 主题相关
   */
  theme: {
    get: () => LocalStorage.get<string>(STORAGE_KEYS.THEME),
    set: (theme: string) => LocalStorage.set(STORAGE_KEYS.THEME, theme),
    remove: () => LocalStorage.remove(STORAGE_KEYS.THEME),
  },

  /**
   * 语言相关
   */
  language: {
    get: () => LocalStorage.get<string>(STORAGE_KEYS.LANGUAGE),
    set: (language: string) => LocalStorage.set(STORAGE_KEYS.LANGUAGE, language),
    remove: () => LocalStorage.remove(STORAGE_KEYS.LANGUAGE),
  },

  /**
   * 用户缓存
   */
  userCache: {
    get: <T>() => CachedStorage.get<T>(STORAGE_KEYS.USER_CACHE),
    set: <T>(data: T, ttl: number) => CachedStorage.set(STORAGE_KEYS.USER_CACHE, data, ttl),
    remove: () => CachedStorage.remove(STORAGE_KEYS.USER_CACHE),
  },

  /**
   * API缓存
   */
  apiCache: {
    get: <T>() => CachedStorage.get<T>(STORAGE_KEYS.API_CACHE),
    set: <T>(data: T, ttl: number) => CachedStorage.set(STORAGE_KEYS.API_CACHE, data, ttl),
    remove: () => CachedStorage.remove(STORAGE_KEYS.API_CACHE),
  },

  /**
   * 清除所有应用相关的存储
   */
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      LocalStorage.remove(key)
    })
  },
}
