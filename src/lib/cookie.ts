/**
 * Cookie管理工具 (向后兼容)
 * 重新导出新的utils目录中的Cookie工具
 */

export { TokenManager, CookieUtils, type StoredTokens } from '@/utils/cookie'

// 向后兼容的默认导出
export { TokenManager as default } from '@/utils/cookie'
