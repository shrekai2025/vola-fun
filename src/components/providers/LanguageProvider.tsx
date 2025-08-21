'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { SupportedLanguage, getCurrentLanguage, saveLanguagePreference } from '@/lib/i18n'
import { translations, Translations } from '@/lib/translations'

interface LanguageContextType {
  language: SupportedLanguage
  t: Translations
  changeLanguage: (lang: SupportedLanguage) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<SupportedLanguage>('en')

  useEffect(() => {
    // 在客户端初始化时获取当前应该使用的语言
    const currentLang = getCurrentLanguage()
    setLanguage(currentLang)
  }, [])

  const changeLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang)
    saveLanguagePreference(lang)
  }

  const contextValue: LanguageContextType = {
    language,
    t: translations[language],
    changeLanguage
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}
