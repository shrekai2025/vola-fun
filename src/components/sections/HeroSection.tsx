'use client'

import { useTranslation } from '@/components/providers/LanguageProvider'
import { Button } from '@/components/ui/button'
import { FloatingUFO } from '@/components/ui/floating-ufo'
import { useUserCache } from '@/hooks/data'
import { motion } from 'framer-motion'
import { ArrowRight, Key, Zap } from 'lucide-react'

export function HeroSection() {
  const { user, isLoggedIn, loading } = useUserCache()
  const { t } = useTranslation()

  // 判断用户是否已订阅
  const isSubscribed = user?.plan && user.plan !== 'basic'

  // 处理"获得API Key"按钮点击
  const handleGetApiKey = () => {
    if (loading || !isLoggedIn || !isSubscribed) {
      // 用户信息加载中、未登录或未订阅用户跳转到pricing页
      window.location.href = '/pricing'
    } else {
      // 已登录已订阅用户跳转到profile页
      window.location.href = '/profile'
    }
  }

  // 处理"探索API市场"按钮点击 - 定位到API市场部分
  const handleExploreMarket = () => {
    const marketSection = document.getElementById('api-market-section')
    if (marketSection) {
      marketSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className='relative min-h-[80vh] flex items-center justify-center bg-background'>
      <FloatingUFO />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className='flex flex-col gap-4 items-center justify-center px-4 text-center max-w-4xl mx-auto'
      >
        <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight whitespace-pre-line z-10'>
          <span className='text-foreground'>{t('home.heroText').split('\n')[0]}</span>
          <br />
          <span className='bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent'>
            {t('home.heroText').split('\n')[1]}
          </span>
        </h1>
        <div className='flex flex-col sm:flex-row gap-4 justify-center z-10'>
          <Button
            size='lg'
            onClick={handleGetApiKey}
            className='bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg'
          >
            <Key className='mr-2 h-5 w-5' />
            {t('home.getApiKey')}
          </Button>
          <Button
            variant='outline'
            size='lg'
            onClick={handleExploreMarket}
            className='border-primary text-primary hover:bg-primary/10 backdrop-blur-sm'
          >
            <Zap className='mr-2 h-5 w-5' />
            {t('home.exploreMarket')}
            <ArrowRight className='ml-2 h-5 w-5' />
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
