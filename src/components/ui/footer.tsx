'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from '@/components/providers/LanguageProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Github, Twitter, Mail, MessageCircle, Moon, Sun } from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'

interface FooterProps {
  className?: string
}

interface FooterLink {
  name: string
  href: string
  icon?: React.ReactElement
  external?: boolean
  onClick?: () => void
  active?: boolean
}

export const Footer = ({ className = '' }: FooterProps) => {
  const { t, changeLanguage, language } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  const sections = [
    {
      title: t('footer.product.title'),
      links: [
        { name: t('footer.product.apiMarket'), href: '/#api-market-section' },
        { name: t('footer.product.documentation'), href: '#' },
        { name: t('footer.pricing'), href: '/pricing' },
      ],
    },
    {
      title: t('footer.connect.title'),
      links: [
        {
          name: t('footer.connect.twitter'),
          href: '#',
          icon: <Twitter className='size-4' />,
          external: true,
        },
        {
          name: 'Email',
          href: 'mailto:contact@vola.fun',
          icon: <Mail className='size-4' />,
          external: false,
        },
        {
          name: t('footer.connect.github'),
          href: '#',
          icon: <Github className='size-4' />,
          external: true,
        },
        {
          name: 'WeChat',
          href: '#',
          icon: <MessageCircle className='size-4' />,
          external: false,
        },
      ],
    },
    {
      title: 'Language',
      links: [
        {
          name: 'English',
          href: '#',
          onClick: () => changeLanguage('en'),
          active: language === 'en',
        },
        {
          name: '中文',
          href: '#',
          onClick: () => changeLanguage('zh'),
          active: language === 'zh',
        },
      ],
    },
  ]

  const legalLinks = [
    { name: 'Terms', href: '#' },
    { name: 'Privacy', href: '#' },
  ]

  return (
    <footer className={`border-t border-border/40 bg-background ${className}`}>
      <div className='container mx-auto px-4 py-16'>
        <div className='flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left'>
          {/* Logo and description section */}
          <div className='flex w-full flex-col justify-between gap-6 lg:items-start lg:max-w-sm'>
            {/* Logo */}
            <Link href='/' className='flex items-center gap-3'>
              <Image src='/volaicon.svg' alt='VOLA' width={32} height={32} className='h-8 w-8' />
              <span className='text-xl font-bold text-foreground'>VOLA</span>
            </Link>

            {/* Description */}
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {t('footer.built')} VOLA - {t('footer.poweredBy')} Next.js
            </p>

            {/* Theme Toggle */}
            <div className='flex items-center gap-2'>
              <Toggle
                variant='outline'
                size='sm'
                className='group data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted'
                pressed={theme === 'dark'}
                onPressedChange={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <Moon
                  size={14}
                  strokeWidth={2}
                  className='shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100'
                  aria-hidden='true'
                />
                <Sun
                  size={14}
                  strokeWidth={2}
                  className='absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0'
                  aria-hidden='true'
                />
              </Toggle>
            </div>
          </div>

          {/* Navigation sections */}
          <div className='grid w-full gap-8 md:grid-cols-3 lg:gap-12'>
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className='mb-4 text-sm font-semibold text-foreground'>{section.title}</h3>
                <ul className='space-y-3'>
                  {section.links.map((link: FooterLink, linkIdx: number) => (
                    <li key={linkIdx}>
                      {link.onClick ? (
                        // 语言切换按钮
                        <button
                          onClick={link.onClick}
                          className={`text-sm transition-colors duration-200 ${
                            link.active
                              ? 'text-primary font-medium'
                              : 'text-muted-foreground hover:text-primary'
                          }`}
                        >
                          {link.name}
                        </button>
                      ) : (
                        // 普通链接
                        <Link
                          href={link.href}
                          className='text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2'
                          target={
                            link.href.startsWith('mailto:')
                              ? undefined
                              : link.external
                                ? '_blank'
                                : undefined
                          }
                          rel={link.external ? 'noopener noreferrer' : undefined}
                        >
                          {link.icon}
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className='mt-12 flex flex-col justify-between gap-4 border-t border-border/40 pt-8 text-sm text-muted-foreground md:flex-row md:items-center'>
          <div className='flex items-center gap-1'>
            <span>© 2024 VOLA.</span>
            <span>{t('footer.copyright')}</span>
          </div>

          <div className='flex flex-col gap-2 md:flex-row md:gap-6'>
            {legalLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className='hover:text-primary transition-colors duration-200'
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
