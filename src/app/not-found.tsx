'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Home } from 'lucide-react'
import { useTranslation } from '@/components/providers/LanguageProvider'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className='min-h-screen bg-background flex items-center justify-center px-4'>
      <Card className='w-full max-w-md'>
        <CardContent className='pt-6 text-center'>
          <div className='flex justify-center mb-6'>
            <div className='rounded-full bg-destructive/10 p-4'>
              <AlertTriangle className='h-12 w-12 text-destructive' />
            </div>
          </div>

          <h1 className='text-6xl font-bold text-foreground mb-2'>404</h1>
          <h2 className='text-xl font-semibold text-foreground mb-4'>{t('errors.pageNotFound')}</h2>

          <p className='text-muted-foreground mb-6'>{t('errors.pageNotFoundMessage')}</p>

          <div className='space-y-3'>
            <Button asChild className='w-full'>
              <Link href='/'>
                <Home className='h-4 w-4 mr-2' />
                {t('common.backToHome')}
              </Link>
            </Button>

            <Button asChild variant='outline' className='w-full'>
              <Link href='/pricing'>{t('common.exploreApis')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
