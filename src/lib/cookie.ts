// Cookie 管理工具

import Cookies from 'js-cookie'
import type { StoredTokens } from '@/types/auth'

// Cookie 键名常量
const COOKIE_KEYS = {
  ACCESS_TOKEN: 'vola_access_token',
  REFRESH_TOKEN: 'vola_refresh_token',
  TOKEN_TYPE: 'vola_token_type',
} as const

// Cookie 配置
const COOKIE_OPTIONS = {
  expires: 7, // 7天过期
  secure: process.env.NODE_ENV === 'production', // 生产环境使用 HTTPS
  sameSite: 'strict' as const,
  path: '/',
}

/**
 * Token 管理类
 */
export class TokenManager {
  /**
   * 存储 tokens 到 Cookie
   */
  static setTokens(tokens: StoredTokens): void {
    try {
      Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, tokens.accessToken, COOKIE_OPTIONS)
      Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, tokens.refreshToken, COOKIE_OPTIONS)
      Cookies.set(COOKIE_KEYS.TOKEN_TYPE, tokens.tokenType, COOKIE_OPTIONS)
    } catch (error) {
      console.error('Failed to store tokens:', error)
      throw new Error('无法存储认证信息')
    }
  }

  /**
   * 从 Cookie 获取 tokens
   */
  static getTokens(): StoredTokens | null {
    try {
      const accessToken = Cookies.get(COOKIE_KEYS.ACCESS_TOKEN)
      const refreshToken = Cookies.get(COOKIE_KEYS.REFRESH_TOKEN)
      const tokenType = Cookies.get(COOKIE_KEYS.TOKEN_TYPE)

      if (!accessToken || !refreshToken || !tokenType) {
        return null
      }

      return {
        accessToken,
        refreshToken,
        tokenType,
      }
    } catch (error) {
      console.error('Failed to retrieve tokens:', error)
      return null
    }
  }

  /**
   * 获取访问令牌
   */
  static getAccessToken(): string | null {
    try {
      return Cookies.get(COOKIE_KEYS.ACCESS_TOKEN) || null
    } catch (error) {
      console.error('Failed to retrieve access token:', error)
      return null
    }
  }

  /**
   * 获取刷新令牌
   */
  static getRefreshToken(): string | null {
    try {
      return Cookies.get(COOKIE_KEYS.REFRESH_TOKEN) || null
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error)
      return null
    }
  }

  /**
   * 更新访问令牌（保持刷新令牌不变）
   */
  static updateAccessToken(accessToken: string): void {
    try {
      Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, COOKIE_OPTIONS)
    } catch (error) {
      console.error('Failed to update access token:', error)
      throw new Error('无法更新访问令牌')
    }
  }

  /**
   * 清除所有 tokens
   */
  static clearTokens(): void {
    try {
      Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN, { path: '/' })
      Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN, { path: '/' })
      Cookies.remove(COOKIE_KEYS.TOKEN_TYPE, { path: '/' })
    } catch (error) {
      console.error('Failed to clear tokens:', error)
    }
  }

  /**
   * 检查是否已登录（是否有有效的 tokens）
   */
  static isLoggedIn(): boolean {
    const tokens = this.getTokens()
    return tokens !== null
  }

  /**
   * 检查访问令牌是否存在
   */
  static hasAccessToken(): boolean {
    const accessToken = this.getAccessToken()
    return accessToken !== null && accessToken.length > 0
  }

  /**
   * 检查刷新令牌是否存在
   */
  static hasRefreshToken(): boolean {
    const refreshToken = this.getRefreshToken()
    return refreshToken !== null && refreshToken.length > 0
  }
}

// 导出便捷方法
export const {
  setTokens,
  getTokens,
  getAccessToken,
  getRefreshToken,
  updateAccessToken,
  clearTokens,
  isLoggedIn,
  hasAccessToken,
  hasRefreshToken,
} = TokenManager

// 默认导出
export default TokenManager
