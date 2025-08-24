/**
 * User-related hook type definitions
 */

import type { User } from '@/types/api/user'

export interface UseUserCacheReturn {
  user: User | null
  isLoggedIn: boolean
  loading: boolean
  error: string | null
  refreshUser: (forceRefresh?: boolean) => Promise<void>
  clearUser: () => void
}

export interface GlobalUserCache {
  user: User | null
  isLoggedIn: boolean
  timestamp: number
  avatar?: string
  theme?: 'light' | 'dark'
}
