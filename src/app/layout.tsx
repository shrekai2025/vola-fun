import AuthModal from '@/components/auth/AuthModal'
import WelcomeModal from '@/components/auth/WelcomeModal'
import { I18nextProviderWrapper } from '@/components/providers/I18nextProvider'
import { JotaiProvider } from '@/components/providers/JotaiProvider'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from '@/components/ui/toast'
import type { Metadata } from 'next'
import { MainLayout } from '../components/templates/MainLayout'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'vola.fun - 面向AI的API市场',
  description: '简化API管理，统一身份验证，集中化支付。专为AI应用场景设计的API生态平台。',
  keywords: ['API', 'AI', '开发者工具', 'API市场', '人工智能'],
  icons: {
    icon: '/icons/volaicon.svg',
    shortcut: '/icons/volaicon.svg',
    apple: '/icons/volaicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='zh-CN' className='dark' suppressHydrationWarning>
      <body className='antialiased font-sans' suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('vola_app_theme') || 'dark';
                  var root = document.documentElement;
                  
                  // 清除现有的主题类
                  root.classList.remove('light', 'dark');
                  
                  // 应用正确的主题
                  if (theme === 'light') {
                    root.classList.add('light');
                  } else {
                    root.classList.add('dark');
                  }
                } catch {
                  // 出错时确保有dark主题
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <ThemeProvider defaultTheme='dark'>
          <I18nextProviderWrapper>
            <LanguageProvider>
              <JotaiProvider>
                <MainLayout>{children}</MainLayout>
                <Toaster />
                {/* 认证相关弹窗 */}
                <AuthModal />
                <WelcomeModal />
              </JotaiProvider>
            </LanguageProvider>
          </I18nextProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
