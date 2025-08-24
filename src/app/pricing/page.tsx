'use client'

import { useTranslation } from '@/components/providers/LanguageProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Code, CreditCard, Globe, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const { t } = useTranslation('pricing')

  return (
    <>
      {/* 页面标题 */}
      <section className='text-center py-20'>
        <div className='max-w-4xl mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-6 text-foreground'>{t('title')}</h1>
          <p className='text-xl text-muted-foreground mb-8 leading-relaxed'>{t('subtitle')}</p>
        </div>
      </section>

      {/* 核心价值主张 */}
      <section className='py-16'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12 text-foreground'>{t('whyChoose')}</h2>
          <div className='grid md:grid-cols-3 gap-8'>
            <Card className='text-center border-border hover:shadow-lg transition-shadow duration-300'>
              <CardHeader>
                <Zap className='h-12 w-12 mx-auto mb-4 text-purple-500 dark:text-purple-400' />
                <CardTitle className='text-foreground'>
                  {t('features.apiManagement.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-muted-foreground'>
                  {t('features.apiManagement.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className='text-center border-border hover:shadow-lg transition-shadow duration-300'>
              <CardHeader>
                <CreditCard className='h-12 w-12 mx-auto mb-4 text-blue-500 dark:text-blue-400' />
                <CardTitle className='text-foreground'>
                  {t('features.centralizedPayment.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-muted-foreground'>
                  {t('features.centralizedPayment.description')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className='text-center border-border hover:shadow-lg transition-shadow duration-300'>
              <CardHeader>
                <Shield className='h-12 w-12 mx-auto mb-4 text-green-500 dark:text-green-400' />
                <CardTitle className='text-foreground'>{t('features.aiOptimized.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='text-muted-foreground'>
                  {t('features.aiOptimized.description')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 使用场景 */}
      <section className='py-16 bg-muted/30 rounded-lg mx-4'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12 text-foreground'>
            {t('useCases.title')}
          </h2>
          <div className='grid md:grid-cols-2 gap-8'>
            <div className='flex items-start space-x-4'>
              <Code className='h-8 w-8 text-purple-500 dark:text-purple-400 mt-1 flex-shrink-0' />
              <div>
                <h3 className='text-xl font-semibold mb-2 text-foreground'>
                  {t('useCases.independentDeveloper.title')}
                </h3>
                <p className='text-muted-foreground'>
                  {t('useCases.independentDeveloper.description')}
                </p>
              </div>
            </div>

            <div className='flex items-start space-x-4'>
              <Globe className='h-8 w-8 text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0' />
              <div>
                <h3 className='text-xl font-semibold mb-2 text-foreground'>
                  {t('useCases.aiDeveloper.title')}
                </h3>
                <p className='text-muted-foreground'>{t('useCases.aiDeveloper.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 定价计划占位 */}
      <section className='py-16'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-12 text-foreground'>
            {t('pricingPlans.title')}
          </h2>
          <div className='text-center py-12 bg-muted/20 border border-border rounded-lg'>
            <p className='text-lg text-foreground mb-4'>{t('pricingPlans.comingSoon')}</p>
            <p className='text-muted-foreground'>{t('pricingPlans.stayTuned')}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 text-center'>
        <div className='max-w-4xl mx-auto px-4'>
          <h2 className='text-3xl font-bold mb-6 text-foreground'>{t('cta.title')}</h2>
          <p className='text-lg text-muted-foreground mb-8'>{t('cta.subtitle')}</p>
          <Button
            size='lg'
            asChild
            className='bg-primary hover:bg-primary/90 text-primary-foreground'
          >
            <Link href='/#api-market' className='inline-flex items-center'>
              {t('cta.browseMarket')}
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
