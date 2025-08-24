'use client'

import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/ui/footer'
import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Header />
      <main className='flex-1 pt-[52px]'>{children}</main>
      <Footer />
    </div>
  )
}
