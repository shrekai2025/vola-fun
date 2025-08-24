'use client'

import { useTranslation } from '@/components/providers/LanguageProvider'
import { useParams } from 'next/navigation'
import AuthRequired from '@/components/ui/auth-required'
import APIEndpointsSection from '@/components/sections/APIEndpointsSection'

export default function EndpointsPage() {
  const { t } = useTranslation()
  const params = useParams()
  const apiId = params.apiId as string

  return (
    <AuthRequired loginPrompt={t('endpoints.loginPrompt')}>
      <div className='min-h-screen bg-background'>
        <APIEndpointsSection apiId={apiId} />
      </div>
    </AuthRequired>
  )
}
