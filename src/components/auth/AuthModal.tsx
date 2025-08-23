'use client'

import { useAtom } from 'jotai'
import { authModalAtom, closeAuthModalAtom } from '@/atoms/auth'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmailStep } from './EmailStep'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

/**
 * 认证弹窗主框架
 */
export function AuthModal() {
  const [authModal] = useAtom(authModalAtom)
  const [, closeModal] = useAtom(closeAuthModalAtom)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeModal()
    }
  }

  const getModalTitle = () => {
    switch (authModal.step) {
      case 'email':
        return 'Welcome to VOLA'
      case 'login':
        return 'Welcome to VOLA'
      case 'signup':
        return 'Welcome to VOLA'
      default:
        return 'Welcome to VOLA'
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
