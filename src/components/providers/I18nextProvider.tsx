'use client'

import { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/lib/i18n-config'

interface I18nextProviderWrapperProps {
  children: ReactNode
}

export function I18nextProviderWrapper({ children }: I18nextProviderWrapperProps) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
