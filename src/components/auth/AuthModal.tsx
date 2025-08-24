'use client'

import { authModalAtom, closeAuthModalAtom } from '@/atoms/auth'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAtom } from 'jotai'
import { EmailStep } from './EmailStep'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

/**
 * 认证弹窗主框架
 */
export function AuthModal() {
  const [authModal] = useAtom(authModalAtom)
  const [, closeModal] = useAtom(closeAuthModalAtom)
  const { t } = useTranslation()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal()
    }
  }

  const getModalTitle = () => {
    switch (authModal.step) {
      case 'email':
        return t('common.welcomeToVola')
      case 'login':
        return t('common.welcomeToVola')
      case 'signup':
        return t('common.welcomeToVola')
      default:
        return t('common.welcomeToVola')
    }
  }

  const renderModalContent = () => {
    switch (authModal.step) {
      case 'email':
        return <EmailStep />
      case 'login':
        return <LoginForm />
      case 'signup':
        return <SignupForm />
      default:
        return <EmailStep />
    }
  }

  return (
    <Dialog open={authModal.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-center'>
          <DialogTitle className='text-xl font-semibold'>{getModalTitle()}</DialogTitle>
        </DialogHeader>

        <div className='px-2'>{renderModalContent()}</div>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
