// 支持的语言类型
export type SupportedLanguage = 'en' | 'zh'

// 语言配置
export const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  zh: { name: '中文', flag: '🇨🇳' }
} as const

// 检测浏览器语言
export function detectBrowserLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en'
  
  const browserLang = navigator.language.toLowerCase()
  
  // 中文和繁体中文都返回 zh
  if (browserLang.startsWith('zh')) {
    return 'zh'
  }
  
  // 其他所有语言都返回英文
  return 'en'
}

// 获取保存的语言偏好
export function getSavedLanguage(): SupportedLanguage | null {
  if (typeof window === 'undefined') return null
  
  const saved = localStorage.getItem('language') as SupportedLanguage | null
  if (saved && Object.keys(languages).includes(saved)) {
    return saved
  }
  
  return null
}

// 保存语言偏好
export function saveLanguagePreference(lang: SupportedLanguage) {
  if (typeof window === 'undefined') return
  localStorage.setItem('language', lang)
}

// 获取当前应该使用的语言
export function getCurrentLanguage(): SupportedLanguage {
  // 1. 优先使用手动保存的语言偏好
  const saved = getSavedLanguage()
  if (saved) return saved
  
  // 2. 否则跟随浏览器语言
  return detectBrowserLanguage()
}
