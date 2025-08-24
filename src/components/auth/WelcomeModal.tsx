'use client'

import { setWelcomeModalAtom, welcomeModalAtom } from '@/atoms/auth'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAtom } from 'jotai'

/**
 * 新用户欢迎弹窗组件
 */
export function WelcomeModal() {
  const [isOpen] = useAtom(welcomeModalAtom)
  const [, setWelcomeModal] = useAtom(setWelcomeModalAtom)
  const { t } = useTranslation()

  const handleClose = () => {
    setWelcomeModal(false)
    // 记录已显示过欢迎弹窗
    localStorage.setItem('vola_welcome_shown', 'true')
    // 刷新页面
    window.location.reload()
  }

  const handleGetStarted = () => {
    setWelcomeModal(false)
    // 记录已显示过欢迎弹窗
    localStorage.setItem('vola_welcome_shown', 'true')
    // 可以跳转到特定页面，这里刷新回到首页
    window.location.reload()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='sm:max-w-md text-center'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center mb-4'>
            {t('welcome.title')}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 px-2'>
          {/* 欢迎内容 */}
          <div className='space-y-4'>
            <div className='text-lg font-semibold text-gray-800'>{t('welcome.successMessage')}</div>

            <div className='text-gray-600 leading-relaxed'>{t('welcome.description')}</div>

            <div className='bg-gray-50 p-4 rounded-lg text-left space-y-2'>
              <div className='font-medium text-gray-800 mb-2'>{t('welcome.nextStepsTitle')}</div>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>{t('welcome.nextSteps.explore')}</li>
                <li>{t('welcome.nextSteps.getApiKey')}</li>
                <li>{t('welcome.nextSteps.integrate')}</li>
              </ul>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className='space-y-3'>
            <Button
              onClick={handleGetStarted}
              className='w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
            >
              {t('welcome.getStarted')}
            </Button>

            <Button
              variant='ghost'
              onClick={handleClose}
              className='w-full text-sm text-gray-500 hover:text-gray-700'
            >
              {t('welcome.later')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WelcomeModal
