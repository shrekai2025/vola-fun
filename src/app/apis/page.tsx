'use client'

import AuthRequired from '@/components/ui/auth-required'
import UserAPIListSection from '@/components/sections/UserAPIListSection'

export default function APIProviderPage() {
  return (
    <AuthRequired>
      <div className='min-h-screen bg-background'>
        <UserAPIListSection />
      </div>
    </AuthRequired>
  )
}
