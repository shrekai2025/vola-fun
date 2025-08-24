/**
 * Cookie管理工具类
 */

import Cookies from 'js-cookie'
import { COOKIE_KEYS, COOKIE_OPTIONS } from '@/constants'
import type { StoredTokens } from '@/types/storage'

/**
 * Token管理类
 */
export class TokenManager {
  /**
   * 存储tokens到Cookie
   */
  static setTokens(tokens: StoredTokens): void {
    try {
      Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, tokens.accessToken, COOKIE_OPTIONS)
      Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, tokens.refreshToken, COOKIE_OPTIONS)
      Cookies.set(COOKIE_KEYS.TOKEN_TYPE, tokens.tokenType, COOKIE_OPTIONS)

      // 触发自定义事件，通知所有组件token已更新
      window.dispatchEvent(new CustomEvent('auth-tokens-updated', { detail: { tokens } }))
    } catch (error) {
      console.error('存储tokens失败:', error)
    }
  }

  /**
   * 从Cookie获取访问令牌
   */
  static getAccessToken(): string | null {
    try {
      return Cookies.get(COOKIE_KEYS.ACCESS_TOKEN) || null
    } catch (error) {
      console.error('获取访问令牌失败:', error)
      return null
    }
  }

  /**
   * 从Cookie获取刷新令牌
   */
  static getRefreshToken(): string | null {
    try {
      return Cookies.get(COOKIE_KEYS.REFRESH_TOKEN) || null
    } catch (error) {
      console.error('获取刷新令牌失败:', error)
      return null
    }
  }

  /**
   * 从Cookie获取令牌类型
   */
  static getTokenType(): string | null {
    try {
      return Cookies.get(COOKIE_KEYS.TOKEN_TYPE) || null
    } catch (error) {
      console.error('获取令牌类型失败:', error)
      return null
    }
  }

  /**
   * 获取所有tokens
   */
  static getTokens(): StoredTokens | null {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()
    const tokenType = this.getTokenType()

    if (!accessToken || !refreshToken || !tokenType) {
      return null
    }

    return {
      accessToken,
      refreshToken,
      tokenType,
    }
  }

  /**
   * 清除所有tokens
   */
  static clearTokens(): void {
    try {
      Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN)
      Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN)
      Cookies.remove(COOKIE_KEYS.TOKEN_TYPE)
      console.debug('🗑️ Tokens已清除')

      // 触发自定义事件，通知所有组件token已清除
      window.dispatchEvent(new CustomEvent('auth-tokens-cleared'))
    } catch (error) {
      console.error('清除tokens失败:', error)
    }
  }

  /**
   * 检查是否已登录
   */
  static isLoggedIn(): boolean {
    const accessToken = this.getAccessToken()
    return Boolean(accessToken)
  }

  /**
   * 检查token是否即将过期（提前5分钟）
   */
  static isTokenExpiringSoon(): boolean {
    // 这里可以解析JWT token的过期时间
    // 暂时返回false，实际实现需要JWT解析
    return false
  }
}

/**
 * 通用Cookie工具函数
 */
export const CookieUtils = {
  /**
   * 设置Cookie
   */
  set(key: string, value: string, options = COOKIE_OPTIONS) {
    try {
      Cookies.set(key, value, options)
    } catch (error) {
      console.error(`设置Cookie ${key} 失败:`, error)
    }
  },

  /**
   * 获取Cookie
   */
  get(key: string): string | null {
    try {
      return Cookies.get(key) || null
    } catch (error) {
      console.error(`获取Cookie ${key} 失败:`, error)
      return null
    }
  },

  /**
   * 删除Cookie
   */
  remove(key: string) {
    try {
      Cookies.remove(key)
    } catch (error) {
      console.error(`删除Cookie ${key} 失败:`, error)
    }
  },

  /**
   * 清除所有应用相关的Cookie
   */
  clearAll() {
    try {
      Object.values(COOKIE_KEYS).forEach((key) => {
        Cookies.remove(key)
      })
    } catch (error) {
      console.error('清除所有Cookie失败:', error)
    }
  },
}
