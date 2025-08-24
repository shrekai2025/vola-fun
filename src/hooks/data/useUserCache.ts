/**
 * 用户数据缓存 Hook
 * 重构版本，使用新的类型定义
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { User } from '@/types/api'
import { AuthService } from '@/lib/api'
import { TokenManager } from '@/lib/cookie'

interface UseUserCacheReturn {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  error: string | null
  refreshUser: (forceRefresh?: boolean) => Promise<void>
  clearUser: () => void
}

// 全局缓存（包含用户信息、头像和主题）
export let globalUserCache: {
  user: User | null
  isLoggedIn: boolean
  timestamp: number
  avatar?: string
  theme?: 'light' | 'dark'
} = {
  user: null,
  isLoggedIn: false,
  timestamp: 0,
  avatar: undefined,
  theme: undefined,
}

// 防止并发请求的全局状态
let ongoingRequest: Promise<void> | null = null

// 缓存有效期（5分钟）
export const CACHE_EXPIRY_TIME = 5 * 60 * 1000

// 头像缓存有效期（30分钟）
const AVATAR_CACHE_EXPIRY_TIME = 30 * 60 * 1000

/**
 * 用户信息缓存 Hook
 * 管理用户登录状态和用户信息的获取、缓存、刷新
 * 优化头像加载策略，减少页面切换时的重新加载
 */
export const useUserCache = (): UseUserCacheReturn => {
  const [user, setUser] = useState<User | null>(globalUserCache.user)
  const [isLoggedIn, setIsLoggedIn] = useState(globalUserCache.isLoggedIn)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 刷新用户信息
  const refreshUser = useCallback(async (forceRefresh: boolean = false) => {
    const hasTokens = TokenManager.isLoggedIn()

    if (!hasTokens) {
      setUser(null)
      setIsLoggedIn(false)
      setError(null)
      globalUserCache = { user: null, isLoggedIn: false, timestamp: 0, avatar: undefined }
      return
    }

    // 检查缓存是否有效
    const now = Date.now()
    const cacheValid =
      globalUserCache.timestamp && now - globalUserCache.timestamp < CACHE_EXPIRY_TIME

    if (!forceRefresh && cacheValid && globalUserCache.user) {
      console.debug('📦 使用缓存的用户信息')
      setUser(globalUserCache.user)
      setIsLoggedIn(globalUserCache.isLoggedIn)
      setError(null)
      return
    }

    // 如果有正在进行的请求，等待它完成
    if (ongoingRequest) {
      console.debug('⏳ 等待正在进行的用户信息请求...')
      try {
        await ongoingRequest
        // 请求完成后，使用最新的缓存数据
        setUser(globalUserCache.user)
        setIsLoggedIn(globalUserCache.isLoggedIn)
        setError(null)
        return
      } catch {
        // 如果等待的请求失败了，继续执行新的请求
        console.debug('⚠️ 等待的请求失败，发起新请求')
      }
    }

    // 创建新的请求
    ongoingRequest = (async () => {
      try {
        setError(null)
        console.debug('🔄 刷新用户信息...')
        const response = await AuthService.getCurrentUser()

        if (!response.success || !response.data) {
          throw new Error('获取用户信息失败')
        }

        const userInfo = response.data

        // 保存头像缓存
        const existingAvatar = globalUserCache.avatar
        const shouldUseAvatarCache =
          existingAvatar &&
          globalUserCache.user?.avatar_url === userInfo.avatar_url &&
          now - globalUserCache.timestamp < AVATAR_CACHE_EXPIRY_TIME

        // 更新全局缓存
        globalUserCache = {
          user: userInfo,
          isLoggedIn: true,
          timestamp: now,
          avatar: shouldUseAvatarCache ? existingAvatar : userInfo.avatar_url,
        }

        // 如果使用头像缓存，临时替换头像URL
        if (shouldUseAvatarCache && userInfo.avatar_url) {
          userInfo.avatar_url = existingAvatar
        }

        setUser(userInfo)
        setIsLoggedIn(true)
        console.debug('✅ 用户信息刷新成功', shouldUseAvatarCache ? '(使用头像缓存)' : '')
      } catch (err: unknown) {
        console.error('❌ 获取用户信息失败:', err)

        // 如果是 401 错误，说明 token 已过期，清除本地状态
        const httpError = err as { response?: { status?: number } }
        if (httpError.response?.status === 401) {
          console.debug('🔑 Token 已过期，清除本地状态')
          TokenManager.clearTokens()
          setUser(null)
          setIsLoggedIn(false)
          setError('登录已过期，请重新登录')
          globalUserCache = { user: null, isLoggedIn: false, timestamp: 0, avatar: undefined }
        } else {
          setError((err as Error).message || '获取用户信息失败')
        }
        throw err // 重新抛出错误以便其他等待的组件知道请求失败
      } finally {
        ongoingRequest = null // 清除正在进行的请求状态
      }
    })()

    // 等待当前请求完成
    try {
      await ongoingRequest
    } catch {
      // 错误已经在上面处理过了
    }
  }, [])

  // 清除用户信息
  const clearUser = useCallback(() => {
    setUser(null)
    setIsLoggedIn(false)
    setError(null)
    TokenManager.clearTokens()
    globalUserCache = {
      user: null,
      isLoggedIn: false,
      timestamp: 0,
      avatar: undefined,
      theme: globalUserCache.theme,
    }
    ongoingRequest = null // 清除正在进行的请求
    console.debug('🗑️ 用户信息已清除')
  }, [])

  // 初始化和页面刷新时获取用户信息
  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true)
      // 第一次加载时，如果有有效缓存就不强制刷新
      const now = Date.now()
      const cacheValid =
        globalUserCache.timestamp && now - globalUserCache.timestamp < CACHE_EXPIRY_TIME

      await refreshUser(!cacheValid)
      setLoading(false)
    }

    initializeUser()
  }, [refreshUser])

  // 监听 storage 事件，处理多标签页同步
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // 如果其他标签页清除了 token，同步清除本地状态
      if (e.key === 'vola_access_token' && !e.newValue) {
        console.debug('🔄 检测到其他标签页登出，同步清除状态')
        setUser(null)
        setIsLoggedIn(false)
        setError(null)
        globalUserCache = {
          user: null,
          isLoggedIn: false,
          timestamp: 0,
          avatar: undefined,
          theme: globalUserCache.theme,
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return {
    user,
    isLoggedIn,
    loading,
    error,
    refreshUser,
    clearUser,
  }
}
