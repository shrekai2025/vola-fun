/**
 * 统一数据获取Hooks
 * 基于全局数据管理器，提供类型安全、缓存优化的数据访问
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { dataManager, type UseDataResult } from '@/lib/data-manager'
import type { User } from '@/types'
import type { MarketAPI, GetMarketAPIsParams } from '@/services/market-api'
import type { GetUserAPIsParams } from '@/services/user-api'

// ======================== 用户信息Hook ========================

export function useUser(): UseDataResult<User> {
  const [data, setData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const userData = await dataManager.getUserInfo(true)
      setData(userData)
    } catch (error: any) {
      setError(error.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const initializeUser = async () => {
      try {
        // 先检查缓存状态
        const cached = dataManager.getCacheState('user-info')
        if (cached.data) {
          setData(cached.data)
          setLoading(cached.loading)
          setError(cached.error)
        }

        // 订阅数据变化
        unsubscribe = dataManager.subscribe('user-info', (update) => {
          if (update.data !== undefined) {
            setData(update.data)
          }
          if (update.loading !== undefined) {
            setLoading(update.loading)
          }
          if (update.error !== undefined) {
            setError(update.error)
          }
        })

        // 获取最新数据
        const userData = await dataManager.getUserInfo()
        setData(userData)
        setLoading(false)
        setError(null)
      } catch (error: any) {
        setData(null)
        setLoading(false)
        setError(error.message)
      }
    }

    initializeUser()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  return { data, loading, error, refresh }
}

// ======================== 用户API列表Hook ========================

export function useUserAPIList(params: GetUserAPIsParams = {}, pageLevelRefresh = false): UseDataResult<MarketAPI[]> {
  const [data, setData] = useState<MarketAPI[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      const response = await dataManager.getUserAPIList(params, forceRefresh, false)
      setData(response.data || [])
    } catch (error: any) {
      setError(error.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const loadAPIList = async () => {
      try {
        const key = `user-apis-${JSON.stringify(params)}`
        
        // 先检查缓存状态
        const cached = dataManager.getCacheState(key)
        if (cached.data && !pageLevelRefresh) {
          setData(cached.data.data || [])
          setLoading(cached.loading)
          setError(cached.error)
        }

        // 订阅数据变化
        unsubscribe = dataManager.subscribe(key, (update) => {
          if (update.data !== undefined) {
            setData(update.data?.data || update.data)
          }
          if (update.loading !== undefined) {
            setLoading(update.loading)
          }
          if (update.error !== undefined) {
            setError(update.error)
          }
        })

        // 页面级刷新 或 获取最新数据
        if (pageLevelRefresh) {
          setLoading(true)
          setError(null)
          const response = await dataManager.getUserAPIList(params, false, true)
          setData(response.data || [])
          setLoading(false)
        } else {
          const response = await dataManager.getUserAPIList(params)
          setData(response.data || [])
          setLoading(false)
          setError(null)
        }
      } catch (error: any) {
        setData(null)
        setLoading(false)
        setError(error.message)
      }
    }

    loadAPIList()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [params, pageLevelRefresh])

  return { data, loading, error, refresh }
}

// ======================== 市场API列表Hook ========================

export function useMarketAPIList(params: GetMarketAPIsParams = {}, pageLevelRefresh = false): UseDataResult<MarketAPI[]> {
  const [data, setData] = useState<MarketAPI[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      const response = await dataManager.getMarketAPIList(params, forceRefresh, false)
      setData(response.data || [])
    } catch (error: any) {
      setError(error.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const loadAPIList = async () => {
      try {
        const key = `market-apis-${JSON.stringify(params)}`
        
        // 先检查缓存状态
        const cached = dataManager.getCacheState(key)
        if (cached.data && !pageLevelRefresh) {
          setData(cached.data.data || [])
          setLoading(cached.loading)
          setError(cached.error)
        }

        // 订阅数据变化
        unsubscribe = dataManager.subscribe(key, (update) => {
          if (update.data !== undefined) {
            setData(update.data?.data || update.data)
          }
          if (update.loading !== undefined) {
            setLoading(update.loading)
          }
          if (update.error !== undefined) {
            setError(update.error)
          }
        })

        // 页面级刷新 或 获取最新数据
        if (pageLevelRefresh) {
          setLoading(true)
          setError(null)
          const response = await dataManager.getMarketAPIList(params, false, true)
          setData(response.data || [])
          setLoading(false)
        } else {
          const response = await dataManager.getMarketAPIList(params)
          setData(response.data || [])
          setLoading(false)
          setError(null)
        }
      } catch (error: any) {
        setData(null)
        setLoading(false)
        setError(error.message)
      }
    }

    loadAPIList()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [params, pageLevelRefresh])

  return { data, loading, error, refresh }
}

// ======================== API详情Hook ========================

export function useAPIDetail(apiId: string, pageLevelRefresh = false): UseDataResult<MarketAPI> {
  const [data, setData] = useState<MarketAPI | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (forceRefresh = false) => {
    if (!apiId) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await dataManager.getAPIDetail(apiId, forceRefresh, false)
      setData(response.data)
    } catch (error: any) {
      setError(error.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [apiId])

  useEffect(() => {
    if (!apiId) return

    let unsubscribe: (() => void) | null = null

    const loadAPIDetail = async () => {
      try {
        const key = `api-detail-${apiId}`
        
        // 先检查缓存状态
        const cached = dataManager.getCacheState(key)
        if (cached.data && !pageLevelRefresh) {
          setData(cached.data.data || cached.data)
          setLoading(cached.loading)
          setError(cached.error)
        }

        // 订阅数据变化
        unsubscribe = dataManager.subscribe(key, (update) => {
          if (update.data !== undefined) {
            setData(update.data?.data || update.data)
          }
          if (update.loading !== undefined) {
            setLoading(update.loading)
          }
          if (update.error !== undefined) {
            setError(update.error)
          }
        })

        // 页面级刷新 或 获取最新数据
        if (pageLevelRefresh) {
          setLoading(true)
          setError(null)
          const response = await dataManager.getAPIDetail(apiId, false, true)
          setData(response.data)
          setLoading(false)
        } else {
          const response = await dataManager.getAPIDetail(apiId)
          setData(response.data)
          setLoading(false)
          setError(null)
        }
      } catch (error: any) {
        setData(null)
        setLoading(false)
        setError(error.message)
      }
    }

    loadAPIDetail()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [apiId, pageLevelRefresh])

  return { data, loading, error, refresh }
}

// ======================== 便捷组合Hook ========================

/**
 * 组合用户状态Hook - 提供与useUserCache相似的接口以便迁移
 */
export function useUnifiedUserCache() {
  const { data: user, loading, error, refresh } = useUser()
  
  return {
    user,
    isLoggedIn: !!user && !error,
    loading,
    error,
    refreshUser: refresh,
    clearUser: () => {
      dataManager.secureCleanup()
    }
  }
}

/**
 * 全局数据清理Hook
 */
export function useDataCleanup() {
  return {
    clearAllCache: () => dataManager.clearCache(),
    clearUserCache: () => dataManager.clearCache('user-info'),
    secureCleanup: () => dataManager.secureCleanup(),
  }
}
