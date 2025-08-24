/**
 * 统一数据获取Hooks
 * 基于全局数据管理器，提供类型安全、缓存优化的数据访问
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { dataManager, type UseDataResult } from '@/lib/data-manager'
import type { User, API, APIListParams } from '@/types/api'

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
    const loadUser = async () => {
      try {
        setLoading(true)
        setError(null)
        const userData = await dataManager.getCurrentUser()
        setData(userData)
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : String(error) || 'Unknown error')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  return { data, loading, error, refresh }
}

// ======================== API列表Hook ========================

export function useAPIList(
  params: APIListParams,
  enablePageLevelRefresh = false
): UseDataResult<API[]> {
  const [data, setData] = useState<API[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const apiData = await dataManager.getUserAPIList(params, false, enablePageLevelRefresh)
      setData(apiData?.data || [])
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Unknown error')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [params, enablePageLevelRefresh])

  useEffect(() => {
    const loadAPIList = async () => {
      try {
        setLoading(true)
        setError(null)
        const apiData = await dataManager.getUserAPIList(params, false, enablePageLevelRefresh)
        setData(apiData.data)
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : String(error) || 'Unknown error')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    loadAPIList()
  }, [params, enablePageLevelRefresh])

  return { data, loading, error, refresh }
}

// ======================== API详情Hook ========================

export function useAPIDetail(apiId: string): UseDataResult<API> {
  const [data, setData] = useState<API | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!apiId) return

    try {
      setLoading(true)
      setError(null)
      const apiData = await dataManager.getAPIDetail(apiId, true)
      setData(apiData)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Unknown error')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [apiId])

  useEffect(() => {
    if (!apiId) return

    const loadAPI = async () => {
      try {
        setLoading(true)
        setError(null)
        const apiData = await dataManager.getAPIDetail(apiId)
        setData(apiData)
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : String(error) || 'Unknown error')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    loadAPI()
  }, [apiId])

  return { data, loading, error, refresh }
}

// ======================== 用户API列表Hook ========================

export function useUserAPIList(): UseDataResult<API[]> {
  const [data, setData] = useState<API[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const apiData = await dataManager.getUserAPIList(undefined, true)
      setData(apiData?.data || [])
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Unknown error')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const loadUserAPIList = async () => {
      try {
        setLoading(true)
        setError(null)
        const apiData = await dataManager.getUserAPIList()
        setData(apiData?.data || [])
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : String(error) || 'Unknown error')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    loadUserAPIList()
  }, [])

  return { data, loading, error, refresh }
}
