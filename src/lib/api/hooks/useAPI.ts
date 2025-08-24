import { useState, useEffect, useCallback } from 'react'
import { APIService, API, APIListParams } from '../services'
import { PaginatedResponse } from '../types'

export function useAPI(id?: string) {
  const [api, setAPI] = useState<API | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchAPI = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const response = await APIService.get(id)
      setAPI(response.data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch API'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchAPI()
    }
  }, [id, fetchAPI])

  return { api, loading, error, refetch: fetchAPI }
}

export function useAPIs(params?: APIListParams) {
  const [apis, setAPIs] = useState<PaginatedResponse<API> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchAPIs = useCallback(
    async (newParams?: APIListParams) => {
      setLoading(true)
      setError(null)

      try {
        const response = await APIService.list(newParams || params)
        setAPIs(response)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch APIs'))
      } finally {
        setLoading(false)
      }
    },
    [params]
  )

  useEffect(() => {
    fetchAPIs()
  }, [fetchAPIs])

  return { apis, loading, error, refetch: fetchAPIs }
}

export function useMarketAPIs(params?: APIListParams) {
  return useAPIs({
    ...params,
    status: 'published',
    is_public: true,
  })
}

export function useUserAPIs(userId?: string, params?: APIListParams) {
  return useAPIs({
    ...params,
    owner_id: userId,
  })
}
