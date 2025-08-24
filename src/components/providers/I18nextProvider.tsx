'use client'

import i18n from '@/lib/i18n-config'
import { ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'

interface I18nextProviderWrapperProps {
  children: ReactNode
}

export function I18nextProviderWrapper({ children }: I18nextProviderWrapperProps) {
  const [, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated after mount
    setIsHydrated(true)

    // After hydration, check if we need to update language from localStorage
    const storedLang = localStorage.getItem('language')
    if (storedLang && (storedLang === 'en' || storedLang === 'zh')) {
      if (i18n.language !== storedLang) {
        i18n.changeLanguage(storedLang)
      }
    }
  }, [])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
