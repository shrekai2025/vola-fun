'use client'

import AuthRequired from '@/components/ui/auth-required'
import UserAPICreateSection from '@/components/sections/UserAPICreateSection'

export default function CreateAPIPage() {
  return (
    <AuthRequired redirectTo='/apis'>
      <div className='min-h-screen bg-background'>
        <UserAPICreateSection />
      </div>
    </AuthRequired>
  )
}
