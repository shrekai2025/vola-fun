/**
 * Storage and token management type definitions
 */

export interface StoredTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export interface CachedStorageItem<T> {
  value: T
  expiry: number
}

export interface StorageManager {
  get<T>(key: string): T | null
  set<T>(key: string, value: T, ttl?: number): void
  remove(key: string): void
  clear(): void
  has(key: string): boolean
}
