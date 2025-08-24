import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import enCommon from '../../public/locales/en/common.json'
import zhCommon from '../../public/locales/zh/common.json'
import enPricing from '../../public/locales/en/pricing.json'
import zhPricing from '../../public/locales/zh/pricing.json'

// Supported languages
export type SupportedLanguage = 'en' | 'zh'

// Language configuration
export const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  zh: { name: '中文', flag: '🇨🇳' },
} as const

// Create resources from imported JSON files
const resources = {
  en: {
    common: enCommon,
    pricing: enPricing,
  },
  zh: {
    common: zhCommon,
    pricing: zhPricing,
  },
}

// Check if we're on the server
const isServer = typeof window === 'undefined'

// Get initial language - use English as default for consistency
const getInitialLanguage = (): SupportedLanguage => {
  // Always return 'en' during SSR to match client default
  if (isServer) {
    return 'en'
  }

  // On client, check localStorage first
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = window.localStorage.getItem('language')
    if (stored === 'en' || stored === 'zh') {
      return stored as SupportedLanguage
    }
  }

  // Default to English
  return 'en'
}

// Initialize i18next
if (!isServer) {
  // Only use LanguageDetector on client side
  i18n.use(LanguageDetector)
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(), // Set initial language explicitly
  fallbackLng: 'en', // Fallback to English
  debug: false, // Disable debug to reduce console noise

  // Default namespace
  defaultNS: 'common',
  ns: ['common', 'pricing'],

  detection: {
    order: ['localStorage', 'htmlTag', 'navigator'],
    lookupLocalStorage: 'language',
    caches: ['localStorage'],
  },

  interpolation: {
    escapeValue: false, // React already does escaping
  },

  react: {
    useSuspense: false, // Disable suspense for SSR compatibility
  },
})

export default i18n
