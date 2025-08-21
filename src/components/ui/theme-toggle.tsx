'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/providers/ThemeProvider'

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
}

export function ThemeToggle({ size = 'md', variant = 'outline' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className="relative"
      aria-label={`切换到${theme === 'light' ? '暗色' : '明亮'}主题`}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">切换主题</span>
    </Button>
  )
}

export function ThemeToggleWithLabel({ size = 'md', variant = 'outline' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className="flex items-center space-x-2"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="ml-2">
        {theme === 'light' ? '暗色模式' : '明亮模式'}
      </span>
    </Button>
  )
}
