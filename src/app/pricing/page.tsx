'use client'

import { useTranslation } from '@/components/providers/LanguageProvider'
import { MainLayout } from '@/components/templates/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Code, CreditCard, Globe, Shield, Zap } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const { t } = useTranslation('pricing')

  return (
    <MainLayout>
      {/* 页面标题 */}
      <section className='text-center py-20'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold mb-6'>{t('title')}</h1>
          <p className='text-xl text-gray-600 mb-8 leading-relaxed'>{t('subtitle')}</p>
        </div>
      </section>

      {/* 核心价值主张 */}
      <section className='py-16'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>{t('whyChoose')}</h2>
          <div className='grid md:grid-cols-3 gap-8'>
            <Card className='text-center'>
              <CardHeader>
                <Zap className='h-12 w-12 mx-auto mb-4 text-purple-600' />
                <CardTitle>{t('features.apiManagement.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t('features.apiManagement.description')}</CardDescription>
              </CardContent>
            </Card>

            <Card className='text-center'>
              <CardHeader>
                <CreditCard className='h-12 w-12 mx-auto mb-4 text-blue-600' />
                <CardTitle>{t('features.centralizedPayment.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t('features.centralizedPayment.description')}</CardDescription>
              </CardContent>
            </Card>

            <Card className='text-center'>
              <CardHeader>
                <Shield className='h-12 w-12 mx-auto mb-4 text-green-600' />
                <CardTitle>{t('features.aiOptimized.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t('features.aiOptimized.description')}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 使用场景 */}
      <section className='py-16 bg-white rounded-lg'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>{t('useCases.title')}</h2>
          <div className='grid md:grid-cols-2 gap-8'>
            <div className='flex items-start space-x-4'>
              <Code className='h-8 w-8 text-purple-600 mt-1 flex-shrink-0' />
              <div>
                <h3 className='text-xl font-semibold mb-2'>
                  {t('useCases.independentDeveloper.title')}
                </h3>
                <p className='text-gray-600'>{t('useCases.independentDeveloper.description')}</p>
              </div>
            </div>

            <div className='flex items-start space-x-4'>
              <Globe className='h-8 w-8 text-blue-600 mt-1 flex-shrink-0' />
              <div>
                <h3 className='text-xl font-semibold mb-2'>{t('useCases.aiDeveloper.title')}</h3>
                <p className='text-gray-600'>{t('useCases.aiDeveloper.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 定价计划占位 */}
      <section className='py-16'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-center mb-12'>{t('pricingPlans.title')}</h2>
          <div className='text-center py-12 bg-gray-50 rounded-lg'>
            <p className='text-lg text-gray-600 mb-4'>{t('pricingPlans.comingSoon')}</p>
            <p className='text-gray-500'>{t('pricingPlans.stayTuned')}</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 text-center'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-3xl font-bold mb-6'>{t('cta.title')}</h2>
          <p className='text-lg text-gray-600 mb-8'>{t('cta.subtitle')}</p>
          <Button size='lg' asChild>
            <Link href='/#api-market'>
              {t('cta.browseMarket')}
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  )
}
