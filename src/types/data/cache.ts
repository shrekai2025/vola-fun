/**
 * Data caching and management type definitions
 */

export interface CacheEntry<T> {
  data: T
  timestamp: number
  loading: boolean
  error: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PendingRequest<T = any> {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (error: Error) => void
}

export interface UseDataResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refresh: (forceRefresh?: boolean) => Promise<void>
}

export interface CachedDataItem<T> {
  value: T
  expiry: number
}

export interface CacheOptions {
  ttl?: number
  key?: string
  storage?: 'memory' | 'localStorage' | 'sessionStorage'
}
