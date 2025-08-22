'use client'

import { Button } from '@/components/ui/button'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { languages, SupportedLanguage } from '@/lib/i18n'
import { Globe } from 'lucide-react'

interface LanguageSelectorProps {
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  showLabel?: boolean
}

export function LanguageSelector({ 
  size = 'sm', 
  variant = 'outline',
  showLabel = true 
}: LanguageSelectorProps) {
  const { language, changeLanguage, t } = useTranslation()

  const toggleLanguage = () => {
    const newLang: SupportedLanguage = language === 'en' ? 'zh' : 'en'
    changeLanguage(newLang)
  }

  const currentLangConfig = languages[language]

  if (showLabel) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={toggleLanguage}
        className="flex items-center space-x-2"
      >
        <Globe className="h-4 w-4" />
        <span>{currentLangConfig.flag}</span>
        <span>{currentLangConfig.name}</span>
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleLanguage}
      className="flex items-center space-x-1"
      aria-label={`Switch to ${language === 'en' ? 'Chinese' : 'English'}`}
    >
      <Globe className="h-4 w-4" />
      <span>{currentLangConfig.flag}</span>
    </Button>
  )
}
