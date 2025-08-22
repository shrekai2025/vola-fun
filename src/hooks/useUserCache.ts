'use client'

import { useState, useEffect, useCallback } from 'react'
import { User } from '@/types'
import { AuthAPI } from '@/services/auth-api'
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
let globalUserCache: {
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
  theme: undefined
}

// 缓存有效期（5分钟）
const CACHE_EXPIRY_TIME = 5 * 60 * 1000

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
    const cacheValid = globalUserCache.timestamp && (now - globalUserCache.timestamp) < CACHE_EXPIRY_TIME
    
    if (!forceRefresh && cacheValid && globalUserCache.user) {
      console.log('📦 使用缓存的用户信息')
      setUser(globalUserCache.user)
      setIsLoggedIn(globalUserCache.isLoggedIn)
      setError(null)
      return
    }

    try {
      setError(null)
      console.log('🔄 刷新用户信息...')
      const userInfo = await AuthAPI.getUserInfo()
      
      // 保存头像缓存
      const existingAvatar = globalUserCache.avatar
      const shouldUseAvatarCache = existingAvatar && 
        globalUserCache.user?.avatar_url === userInfo.avatar_url &&
        (now - globalUserCache.timestamp) < AVATAR_CACHE_EXPIRY_TIME
      
      // 更新全局缓存
      globalUserCache = {
        user: userInfo,
        isLoggedIn: true,
        timestamp: now,
        avatar: shouldUseAvatarCache ? existingAvatar : userInfo.avatar
      }
      
      // 如果使用头像缓存，临时替换头像URL
      if (shouldUseAvatarCache && userInfo.avatar) {
        userInfo.avatar = existingAvatar
      }
      
      setUser(userInfo)
      setIsLoggedIn(true)
      console.log('✅ 用户信息刷新成功', shouldUseAvatarCache ? '(使用头像缓存)' : '')
    } catch (err: any) {
      console.error('❌ 获取用户信息失败:', err)
      
      // 如果是 401 错误，说明 token 已过期，清除本地状态
      if (err.response?.status === 401) {
        console.log('🔑 Token 已过期，清除本地状态')
        TokenManager.clearTokens()
        setUser(null)
        setIsLoggedIn(false)
        setError('登录已过期，请重新登录')
        globalUserCache = { user: null, isLoggedIn: false, timestamp: 0, avatar: undefined }
      } else {
        setError(err.message || '获取用户信息失败')
      }
    }
  }, [])

  // 清除用户信息
  const clearUser = useCallback(() => {
    setUser(null)
    setIsLoggedIn(false)
    setError(null)
    TokenManager.clearTokens()
    globalUserCache = { user: null, isLoggedIn: false, timestamp: 0, avatar: undefined, theme: globalUserCache.theme }
    console.log('🗑️ 用户信息已清除')
  }, [])

  // 初始化和页面刷新时获取用户信息
  useEffect(() => {
    const initializeUser = async () => {
      setLoading(true)
      // 第一次加载时，如果有有效缓存就不强制刷新
      const now = Date.now()
      const cacheValid = globalUserCache.timestamp && (now - globalUserCache.timestamp) < CACHE_EXPIRY_TIME
      
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
        console.log('🔄 检测到其他标签页登出，同步清除状态')
        setUser(null)
        setIsLoggedIn(false)
        setError(null)
        globalUserCache = { user: null, isLoggedIn: false, timestamp: 0, avatar: undefined, theme: globalUserCache.theme }
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
    clearUser
  }
}
