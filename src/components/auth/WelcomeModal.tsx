'use client'

import { useAtom } from 'jotai'
import { welcomeModalAtom, setWelcomeModalAtom } from '@/atoms/auth'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

/**
 * 新用户欢迎弹窗组件
 */
export function WelcomeModal() {
  const [isOpen] = useAtom(welcomeModalAtom)
  const [, setWelcomeModal] = useAtom(setWelcomeModalAtom)

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
            🎉 欢迎加入 vola.fun！
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6 px-2'>
          {/* 欢迎内容 */}
          <div className='space-y-4'>
            <div className='text-lg font-semibold text-gray-800'>注册成功！</div>

            <div className='text-gray-600 leading-relaxed'>
              感谢您选择 vola.fun！我们是专为 AI 应用设计的 API 市场平台， 致力于简化您的 API
              集成和管理流程。
            </div>

            <div className='bg-gray-50 p-4 rounded-lg text-left space-y-2'>
              <div className='font-medium text-gray-800 mb-2'>接下来您可以：</div>
              <ul className='text-sm text-gray-600 space-y-1'>
                <li>• 探索我们的 API 市场</li>
                <li>• 获取您的专属 API 密钥</li>
                <li>• 开始集成您需要的 API 服务</li>
              </ul>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className='space-y-3'>
            <Button
              onClick={handleGetStarted}
              className='w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
            >
              开始体验 vola.fun
            </Button>

            <Button
              variant='ghost'
              onClick={handleClose}
              className='w-full text-sm text-gray-500 hover:text-gray-700'
            >
              稍后再说
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default WelcomeModal
