import { useTranslation } from 'react-i18next'
import { SupportedLanguage } from '@/lib/i18n-config'

export function useI18n() {
  const { t, i18n } = useTranslation('common')

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang)
  }

  return {
    language: i18n.language as SupportedLanguage,
    t,
    changeLanguage,
  }
}
