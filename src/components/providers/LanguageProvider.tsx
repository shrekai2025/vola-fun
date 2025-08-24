'use client'

import { ReactNode } from 'react'
import { useTranslation as useI18nextTranslation } from 'react-i18next'
import { SupportedLanguage } from '@/lib/i18n-config'

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  return <>{children}</>
}

// Legacy hook for backwards compatibility - redirects to useI18n
export function useTranslation(namespace: string = 'common') {
  const { t, i18n } = useI18nextTranslation(namespace)

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return {
    language: i18n.language as SupportedLanguage,
    t,
    changeLanguage,
  }
}
