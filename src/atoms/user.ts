import { atom } from 'jotai'
import type { User, ApiKey } from '@/types'

// 用户基础信息原子
export const userAtom = atom<User | null>(null)

// 用户登录状态
export const isLoggedInAtom = atom(
  (get) => get(userAtom) !== null
)

// 用户积分余额
export const userCreditsAtom = atom(
  (get) => get(userAtom)?.credits ?? 0
)

// 用户API密钥列表
export const userApiKeysAtom = atom(
  (get) => get(userAtom)?.apiKeys ?? []
)

// 主要API密钥（第一个激活的密钥）
export const primaryApiKeyAtom = atom(
  (get) => get(userApiKeysAtom).find(key => key.isActive) ?? null
)
