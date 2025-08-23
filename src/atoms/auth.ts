// 认证相关状态管理 - Jotai Atoms

import { atom } from 'jotai'
import type { User, AuthModalState, StoredTokens } from '@/types/auth'
import { TokenManager } from '@/lib/cookie'

// 基础认证状态
export const userAtom = atom<User | null>(null)

// 登录状态（派生原子）
export const isLoggedInAtom = atom((get) => {
  const user = get(userAtom)
  const hasTokens = TokenManager.isLoggedIn()
  return user !== null && hasTokens
})

// 用户积分余额（派生原子）
export const userCreditsAtom = atom((get) => get(userAtom)?.credits ?? 0)

// 用户API密钥列表（派生原子）
export const userApiKeysAtom = atom((get) => get(userAtom)?.apiKeys ?? [])

// 主要API密钥（第一个激活的密钥）
export const primaryApiKeyAtom = atom(
  (get) => get(userApiKeysAtom).find((key) => key.isActive) ?? null
)

// 认证弹窗状态
export const authModalAtom = atom<AuthModalState>({
  isOpen: false,
  step: 'email',
})

// 欢迎弹窗状态
export const welcomeModalAtom = atom<boolean>(false)

// Token 状态（仅用于响应式更新）
export const tokensAtom = atom<StoredTokens | null>(null)

// 认证加载状态
export const authLoadingAtom = atom<boolean>(false)

// 认证错误状态
export const authErrorAtom = atom<string | null>(null)

// ===== 写入原子（Actions） =====

// 设置用户信息
export const setUserAtom = atom(null, (get, set, user: User | null) => {
  set(userAtom, user)
})

// 设置认证弹窗状态
export const setAuthModalAtom = atom(null, (get, set, modalState: Partial<AuthModalState>) => {
  const current = get(authModalAtom)
  set(authModalAtom, { ...current, ...modalState })
})

// 打开认证弹窗
export const openAuthModalAtom = atom(null, (get, set, step: AuthModalState['step'] = 'email') => {
  set(authModalAtom, { isOpen: true, step })
})

// 关闭认证弹窗
export const closeAuthModalAtom = atom(null, (get, set) => {
  set(authModalAtom, { isOpen: false, step: 'email' })
  set(authErrorAtom, null)
})

// 设置欢迎弹窗状态
export const setWelcomeModalAtom = atom(null, (get, set, show: boolean) => {
  set(welcomeModalAtom, show)
})

// 设置 Tokens
export const setTokensAtom = atom(null, (get, set, tokens: StoredTokens | null) => {
  set(tokensAtom, tokens)
  if (tokens) {
    TokenManager.setTokens(tokens)
  } else {
    TokenManager.clearTokens()
  }
})

// 设置认证加载状态
export const setAuthLoadingAtom = atom(null, (get, set, loading: boolean) => {
  set(authLoadingAtom, loading)
})

// 设置认证错误
export const setAuthErrorAtom = atom(null, (get, set, error: string | null) => {
  set(authErrorAtom, error)
})

// 初始化认证状态（从 Cookie 恢复）
export const initAuthAtom = atom(null, (get, set) => {
  try {
    const tokens = TokenManager.getTokens()
    if (tokens) {
      set(tokensAtom, tokens)
      // 这里可以添加从 token 中解析用户信息的逻辑
      // 或者调用 API 获取用户信息
    }
  } catch (error) {
    console.error('Failed to initialize auth state:', error)
    TokenManager.clearTokens()
  }
})

// 清除认证状态
export const clearAuthAtom = atom(null, (get, set) => {
  set(userAtom, null)
  set(tokensAtom, null)
  set(authErrorAtom, null)
  TokenManager.clearTokens()
})
