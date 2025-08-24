'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/providers/ThemeProvider'

interface ThemeToggleProps {
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
}

export function ThemeToggle({ size = 'default', variant = 'outline' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className='relative'
      aria-label={`切换到${theme === 'light' ? '暗色' : '明亮'}主题`}
    >
      <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>切换主题</span>
    </Button>
  )
}

export function ThemeToggleWithLabel({ size = 'default', variant = 'outline' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  // 根据当前主题显示正确的图标和文本
  const getThemeDisplay = () => {
    if (theme === 'dark') {
      return {
        icon: <Moon className='h-4 w-4' />,
        text: '暗色模式',
      }
    } else {
      return {
        icon: <Sun className='h-4 w-4' />,
        text: '明亮模式',
      }
    }
  }

  const { icon, text } = getThemeDisplay()

  return (
    <Button variant={variant} size={size} onClick={toggleTheme}>
      {icon}
      <span>{text}</span>
    </Button>
  )
}
