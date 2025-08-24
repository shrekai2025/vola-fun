'use client'

import { useParams } from 'next/navigation'
import { useTranslation } from '@/components/providers/LanguageProvider'
import AuthRequired from '@/components/ui/auth-required'
import UserAPIEditSection from '@/components/sections/UserAPIEditSection'

export default function EditAPIPage() {
  const { t } = useTranslation()
  const params = useParams()
  const apiId = params.id as string

  return (
    <AuthRequired loginPrompt={t('apiProvider.edit.loadingAPI')}>
      <div className='min-h-screen bg-background'>
        <UserAPIEditSection apiId={apiId} />
      </div>
    </AuthRequired>
  )
}
