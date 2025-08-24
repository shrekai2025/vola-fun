/**
 * UI相关常量定义
 */

// 主题常量
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const

// 语言常量
export const LANGUAGES = {
  EN: 'en',
  ZH: 'zh',
} as const

// 语言配置
export const LANGUAGE_CONFIG = {
  [LANGUAGES.EN]: { name: 'English', flag: '🇺🇸' },
  [LANGUAGES.ZH]: { name: '中文', flag: '🇨🇳' },
} as const

// 断点常量 (Tailwind CSS breakpoints)
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const

// 动画持续时间常量
export const ANIMATION_DURATION = {
  FAST: '0.15s',
  NORMAL: '0.3s',
  SLOW: '0.5s',
} as const

// Z-index常量
export const Z_INDEX = {
  DROPDOWN: 1000,
  MODAL: 2000,
  TOAST: 3000,
  TOOLTIP: 4000,
  OVERLAY: 5000,
} as const

// 按钮变体常量
export const BUTTON_VARIANTS = {
  DEFAULT: 'default',
  DESTRUCTIVE: 'destructive',
  OUTLINE: 'outline',
  SECONDARY: 'secondary',
  GHOST: 'ghost',
  LINK: 'link',
} as const

// 按钮尺寸常量
export const BUTTON_SIZES = {
  DEFAULT: 'default',
  SM: 'sm',
  LG: 'lg',
  ICON: 'icon',
} as const

// 输入框类型常量
export const INPUT_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  URL: 'url',
  TEL: 'tel',
  SEARCH: 'search',
} as const

// 通知类型常量
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

// 表格对齐常量
export const TABLE_ALIGN = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
} as const
