/**
 * Hooks 统一导出
 * 重新组织后的hooks目录结构
 */

// 认证相关 Hooks
export * from './auth'

// 数据相关 Hooks
export * from './data'

// UI相关 Hooks
export * from './ui'

// 向后兼容：重新导出原来根目录的hooks
export { useAuth } from './auth/useAuth'
export { useUser, useAPIList, useAPIDetail, useUserAPIList } from './data/useUnifiedData'
export { useUserCache } from './data/useUserCache'
export { useI18n } from './ui/useI18n'
export { useGlobalCache } from './ui/useGlobalCache'
