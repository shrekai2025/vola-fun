/**
 * 全局数据管理中心
 * 统一处理所有网络请求、缓存策略和状态管理
 * 确保无重复请求，快速加载，安全可靠
 */

import { AuthAPI } from '@/services/auth-api'
import { getMarketAPIs, type MarketAPI, type GetMarketAPIsParams } from '@/services/market-api'
import { getUserAPIs, getUserAPI, type GetUserAPIsParams } from '@/services/user-api'
import { TokenManager } from '@/lib/cookie'
import type { User } from '@/types'

// ======================== 类型定义 ========================

interface CacheEntry<T> {
  data: T
  timestamp: number
  loading: boolean
  error: string | null
}

interface PendingRequest<T> {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (error: any) => void
}

// ======================== 配置常量 ========================

const CACHE_CONFIG = {
  USER_INFO: 5 * 60 * 1000,        // 用户信息：5分钟
  USER_APIS: 30 * 60 * 1000,       // 用户API列表：30分钟 (页面级强制刷新)
  MARKET_APIS: 30 * 60 * 1000,     // 市场API列表：30分钟 (页面级强制刷新)
  API_DETAIL: 30 * 60 * 1000,      // API详情：30分钟 (页面级强制刷新)
} as const

// API数据刷新策略：页面级强制刷新
const API_DATA_TYPES = new Set(['user-apis', 'market-apis', 'api-detail'])

// ======================== 全局状态存储 ========================

class DataManager {
  private static instance: DataManager
  
  // 缓存存储
  private cache = new Map<string, CacheEntry<any>>()
  
  // 正在进行的请求（防重复）
  private pendingRequests = new Map<string, PendingRequest<any>>()
  
  // 订阅者管理
  private subscribers = new Map<string, Set<(data: any) => void>>()

  private constructor() {
    // 监听登出事件，清理缓存
    this.setupCleanupListeners()
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager()
    }
    return DataManager.instance
  }

  // ======================== 核心缓存方法 ========================

  /**
   * 检查是否为API数据类型，需要页面级强制刷新
   */
  private isAPIDataType(key: string): boolean {
    return Array.from(API_DATA_TYPES).some(type => key.startsWith(type))
  }

  /**
   * 页面级强制刷新：清除API数据缓存
   */
  public clearAPIDataCache(): void {
    for (const [key] of this.cache) {
      if (this.isAPIDataType(key)) {
        this.cache.delete(key)
        console.log(`🗑️ [DataManager] 页面级清除API缓存: ${key}`)
      }
    }
  }

  /**
   * 通用数据获取方法
   */
  private async getData<T>(
    key: string,
    fetcher: () => Promise<T>,
    cacheTime: number,
    forceRefresh = false,
    pageLevelRefresh = false
  ): Promise<T> {
    const now = Date.now()
    const cached = this.cache.get(key)

    // 页面级刷新：对API数据类型强制忽略缓存
    const shouldIgnoreCache = forceRefresh || (pageLevelRefresh && this.isAPIDataType(key))

    // 检查缓存是否有效
    if (!shouldIgnoreCache && cached && (now - cached.timestamp) < cacheTime && !cached.error) {
      console.log(`📦 [DataManager] 缓存命中: ${key}`)
      return cached.data
    }

    // 页面级刷新日志
    if (pageLevelRefresh && this.isAPIDataType(key)) {
      console.log(`🔄 [DataManager] 页面级强制刷新: ${key}`)
    }

    // 检查是否有正在进行的请求
    const pending = this.pendingRequests.get(key)
    if (pending) {
      console.log(`⏳ [DataManager] 等待进行中的请求: ${key}`)
      return pending.promise
    }

    // 创建新请求
    console.log(`🔄 [DataManager] 发起新请求: ${key}`)
    
    let resolvePromise: (value: T) => void
    let rejectPromise: (error: any) => void
    
    const promise = new Promise<T>((resolve, reject) => {
      resolvePromise = resolve
      rejectPromise = reject
    })
    
    // 存储请求信息
    this.pendingRequests.set(key, { promise, resolve: resolvePromise!, reject: rejectPromise! })
    
    // 设置加载状态
    this.updateCache(key, null, now, true, null)
    this.notifySubscribers(key, { loading: true })

    // 执行请求
    fetcher()
      .then((data) => {
        this.updateCache(key, data, now, false, null)
        this.notifySubscribers(key, { data, loading: false, error: null })
        resolvePromise!(data)
      })
      .catch((error) => {
        console.error(`❌ [DataManager] 请求失败: ${key}`, error)
        this.updateCache(key, null, now, false, error.message)
        this.notifySubscribers(key, { data: null, loading: false, error: error.message })
        rejectPromise!(error)
      })
      .finally(() => {
        this.pendingRequests.delete(key)
      })

    return promise
  }

  /**
   * 更新缓存
   */
  private updateCache<T>(
    key: string, 
    data: T | null, 
    timestamp: number, 
    loading: boolean, 
    error: string | null
  ) {
    this.cache.set(key, { data, timestamp, loading, error })
  }

  /**
   * 通知订阅者
   */
  private notifySubscribers(key: string, update: any) {
    const subs = this.subscribers.get(key)
    if (subs) {
      subs.forEach(callback => callback(update))
    }
  }

  // ======================== 具体数据获取方法 ========================

  /**
   * 获取用户信息
   */
  async getUserInfo(forceRefresh = false): Promise<User> {
    const hasTokens = TokenManager.isLoggedIn()
    if (!hasTokens) {
      throw new Error('用户未登录')
    }

    return this.getData(
      'user-info',
      () => AuthAPI.getUserInfo(),
      CACHE_CONFIG.USER_INFO,
      forceRefresh
    )
  }

  /**
   * 获取用户API列表
   */
  async getUserAPIList(params: GetUserAPIsParams = {}, forceRefresh = false, pageLevelRefresh = false): Promise<any> {
    // 先获取用户信息以获得用户ID
    const user = await this.getUserInfo()
    const finalParams = { ...params, owner_id: user.id }
    
    const key = `user-apis-${JSON.stringify(finalParams)}`
    
    return this.getData(
      key,
      () => getUserAPIs(finalParams),
      CACHE_CONFIG.USER_APIS,
      forceRefresh,
      pageLevelRefresh
    )
  }

  /**
   * 获取市场API列表
   */
  async getMarketAPIList(params: GetMarketAPIsParams = {}, forceRefresh = false, pageLevelRefresh = false): Promise<any> {
    const key = `market-apis-${JSON.stringify(params)}`
    
    return this.getData(
      key,
      () => getMarketAPIs(params),
      CACHE_CONFIG.MARKET_APIS,
      forceRefresh,
      pageLevelRefresh
    )
  }

  /**
   * 获取API详情
   */
  async getAPIDetail(apiId: string, forceRefresh = false, pageLevelRefresh = false): Promise<any> {
    const key = `api-detail-${apiId}`
    
    return this.getData(
      key,
      () => getUserAPI(apiId),
      CACHE_CONFIG.API_DETAIL,
      forceRefresh,
      pageLevelRefresh
    )
  }

  // ======================== 订阅和缓存管理 ========================

  /**
   * 订阅数据变化
   */
  subscribe(key: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    this.subscribers.get(key)!.add(callback)

    // 返回取消订阅函数
    return () => {
      const subs = this.subscribers.get(key)
      if (subs) {
        subs.delete(callback)
        if (subs.size === 0) {
          this.subscribers.delete(key)
        }
      }
    }
  }

  /**
   * 获取缓存状态
   */
  getCacheState(key: string) {
    const cached = this.cache.get(key)
    return cached || { data: null, timestamp: 0, loading: false, error: null }
  }

  /**
   * 清除特定缓存
   */
  clearCache(key?: string) {
    if (key) {
      this.cache.delete(key)
      console.log(`🗑️ [DataManager] 清除缓存: ${key}`)
    } else {
      this.cache.clear()
      console.log(`🗑️ [DataManager] 清除全部缓存`)
    }
  }

  /**
   * 强制刷新数据
   */
  async refreshData(key: string) {
    this.clearCache(key)
    // 根据key类型决定如何重新获取数据
    // 这里可以根据实际需要扩展
  }

  // ======================== 清理和安全机制 ========================

  /**
   * 设置清理监听器
   */
  private setupCleanupListeners() {
    // 监听token变化
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'vola_access_token' && !e.newValue) {
          this.clearCache()
          console.log('🧹 [DataManager] 检测到登出，清除所有缓存')
        }
      })
    }
  }

  /**
   * 安全清理（登出时调用）
   */
  secureCleanup() {
    this.cache.clear()
    this.pendingRequests.clear()
    this.subscribers.clear()
    console.log('🔒 [DataManager] 安全清理完成')
  }
}

// ======================== 导出单例 ========================

export const dataManager = DataManager.getInstance()

// ======================== 便捷Hook接口 ========================

export interface UseDataResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

/**
 * React Hook 接口
 */
export function useDataManager() {
  return {
    getUserInfo: (forceRefresh?: boolean) => dataManager.getUserInfo(forceRefresh),
    getUserAPIList: (params?: GetUserAPIsParams, forceRefresh?: boolean, pageLevelRefresh?: boolean) => 
      dataManager.getUserAPIList(params, forceRefresh, pageLevelRefresh),
    getMarketAPIList: (params?: GetMarketAPIsParams, forceRefresh?: boolean, pageLevelRefresh?: boolean) => 
      dataManager.getMarketAPIList(params, forceRefresh, pageLevelRefresh),
    getAPIDetail: (apiId: string, forceRefresh?: boolean, pageLevelRefresh?: boolean) => 
      dataManager.getAPIDetail(apiId, forceRefresh, pageLevelRefresh),
    clearCache: (key?: string) => dataManager.clearCache(key),
    clearAPIDataCache: () => dataManager.clearAPIDataCache(),
    secureCleanup: () => dataManager.secureCleanup(),
  }
}
