/**
 * 统一数据获取Hooks
 * 基于全局数据管理器，提供类型安全、缓存优化的数据访问
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { dataManager, type UseDataResult } from '@/lib/data-manager'
import type { User } from '@/types'
import type { API, APIListParams } from '@/lib/api'

// ======================== 用户信息Hook ========================

export function useUser(): UseDataResult<User> {
  const [data, setData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const userData = await dataManager.getCurrentUser(true)
      setData(userData)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Unknown error')
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
          setData(cached.data as User)
          setLoading(cached.loading)
          setError(cached.error)
        }

        // 订阅数据变化
        unsubscribe = dataManager.subscribe('user-info', (update: unknown) => {
          const updateData = update as { data?: User; loading?: boolean; error?: string | null }
          if (updateData.data !== undefined) {
            setData(updateData.data)
          }
          if (updateData.loading !== undefined) {
            setLoading(updateData.loading)
          }
          if (updateData.error !== undefined) {
            setError(updateData.error)
          }
        })

        // 获取最新数据
        const userData = await dataManager.getCurrentUser()
        setData(userData)
        setLoading(false)
        setError(null)
      } catch (error: unknown) {
        setData(null)
        setLoading(false)
        setError(error instanceof Error ? error.message : 'Unknown error')
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

export function useUserAPIList(
  params: APIListParams = {},
  pageLevelRefresh = false
): UseDataResult<API[]> {
  const [data, setData] = useState<API[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true)
        setError(null)
        const response = await dataManager.getUserAPIList(params, forceRefresh, false)
        setData(response.data || [])
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Unknown error')
        setData(null)
      } finally {
        setLoading(false)
      }
    },
    [params]
  )

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const loadAPIList = async () => {
      try {
        const key = `user-apis-${JSON.stringify(params)}`

        // 先检查缓存状态
        const cached = dataManager.getCacheState(key)
        if (cached.data && !pageLevelRefresh) {
          const cachedData = cached.data as { data?: API[] }
          setData(cachedData?.data || [])
          setLoading(cached.loading)
          setError(cached.error)
        }

        // 订阅数据变化
        unsubscribe = dataManager.subscribe(key, (update: unknown) => {
          const updateData = update as {
            data?: { data?: API[] } | API[]
            loading?: boolean
            error?: string | null
          }
          if (updateData.data !== undefined) {
            const apiData = updateData.data as { data?: API[] } | API[]
            setData(Array.isArray(apiData) ? apiData : apiData?.data || [])
          }
          if (updateData.loading !== undefined) {
            setLoading(updateData.loading)
          }
          if (updateData.error !== undefined) {
            setError(updateData.error)
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
      } catch (error: unknown) {
        setData(null)
        setLoading(false)
        setError(error instanceof Error ? error.message : 'Unknown error')
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

export function useAPIList(
  params: APIListParams = {},
  pageLevelRefresh = false
): UseDataResult<API[]> {
  return useMarketAPIList(params, pageLevelRefresh)
}

export function useMarketAPIList(
  params: APIListParams = {},
  pageLevelRefresh = false
): UseDataResult<API[]> {
  const [data, setData] = useState<API[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(
    async (forceRefresh = false) => {
      try {
        setLoading(true)
        setError(null)
        const response = await dataManager.getMarketAPIList(params, forceRefresh, false)
        setData(response.data || [])
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Unknown error')
        setData(null)
      } finally {
        setLoading(false)
      }
    },
    [params]
  )

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const loadAPIList = async () => {
      try {
        const key = `market-apis-${JSON.stringify(params)}`

        // 先检查缓存状态
        const cached = dataManager.getCacheState(key)
        if (cached.data && !pageLevelRefresh) {
          const cachedData = cached.data as { data?: API[] }
          setData(cachedData?.data || [])
          setLoading(cached.loading)
          setError(cached.error)
        }

        // 订阅数据变化
        unsubscribe = dataManager.subscribe(key, (update: unknown) => {
          const updateData = update as {
            data?: { data?: API[] } | API[]
            loading?: boolean
            error?: string | null
          }
          if (updateData.data !== undefined) {
            const apiData = updateData.data as { data?: API[] } | API[]
            setData(Array.isArray(apiData) ? apiData : apiData?.data || [])
          }
          if (updateData.loading !== undefined) {
            setLoading(updateData.loading)
          }
          if (updateData.error !== undefined) {
            setError(updateData.error)
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
      } catch (error: unknown) {
        setData(null)
        setLoading(false)
        setError(error instanceof Error ? error.message : 'Unknown error')
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

export function useAPIDetail(apiId: string, pageLevelRefresh = false): UseDataResult<API> {
  const [data, setData] = useState<API | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(
    async (forceRefresh = false) => {
      if (!apiId) return

      try {
        setLoading(true)
        setError(null)
        const response = await dataManager.getAPIDetail(apiId, forceRefresh, false)
        setData(response)
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Unknown error')
        setData(null)
      } finally {
        setLoading(false)
      }
    },
    [apiId]
  )

  useEffect(() => {
    if (!apiId) return

    let unsubscribe: (() => void) | null = null

    const loadAPIDetail = async () => {
      try {
        const key = `api-detail-${apiId}`

        // 先检查缓存状态
        const cached = dataManager.getCacheState(key)
        if (cached.data && !pageLevelRefresh) {
          const cachedData = cached.data as API
          setData(cachedData)
          setLoading(cached.loading)
          setError(cached.error)
        }

        // 订阅数据变化
        unsubscribe = dataManager.subscribe(key, (update: unknown) => {
          const updateData = update as { data?: API; loading?: boolean; error?: string | null }
          if (updateData.data !== undefined) {
            setData(updateData.data)
          }
          if (updateData.loading !== undefined) {
            setLoading(updateData.loading)
          }
          if (updateData.error !== undefined) {
            setError(updateData.error)
          }
        })

        // 页面级刷新 或 获取最新数据
        if (pageLevelRefresh) {
          setLoading(true)
          setError(null)
          const response = await dataManager.getAPIDetail(apiId, false, true)
          setData(response)
          setLoading(false)
        } else {
          const response = await dataManager.getAPIDetail(apiId)
          setData(response)
          setLoading(false)
          setError(null)
        }
      } catch (error: unknown) {
        setData(null)
        setLoading(false)
        setError(error instanceof Error ? error.message : 'Unknown error')
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
    },
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
