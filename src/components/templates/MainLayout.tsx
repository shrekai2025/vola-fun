'use client'

import { Header } from '@/components/organisms/Header'
import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="mt-auto bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 vola.fun. All rights reserved.</p>
          <p className="text-sm mt-2">简化API管理，打造面向AI的API生态</p>
        </div>
      </footer>
    </div>
  )
}
