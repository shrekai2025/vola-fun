/**
 * UI组件相关类型定义
 */

import type { ReactNode } from 'react'

// 重新导出标准化的基础接口
export * from './base'

// 通用组件Props (保持向后兼容性)
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
}

// 按钮变体
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'

// 按钮大小
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

// 输入框类型
export type InputType = 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'search'

// 卡片变体
export type CardVariant = 'default' | 'outline'

// 对话框状态
export interface DialogState {
  open: boolean
  title?: string
  description?: string
  onOpenChange?: (open: boolean) => void
}

// 表单字段状态
export interface FieldState {
  value: string
  error?: string
  touched?: boolean
  disabled?: boolean
}

// 加载状态
export interface LoadingState {
  loading: boolean
  error?: string | null
}

// 分页状态
export interface PaginationState {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// 排序状态
export interface SortState {
  field: string
  direction: 'asc' | 'desc'
}

// 筛选状态
export interface FilterState {
  [key: string]: string | number | boolean | string[] | undefined
}

// 搜索状态
export interface SearchState {
  query: string
  suggestions?: string[]
  loading?: boolean
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system'

// 语言类型
export type Language = 'en' | 'zh'

// 通知类型
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

// 通知消息
export interface NotificationMessage {
  id: string
  type: NotificationType
  title?: string
  description: string
  duration?: number
}

// 模态框Props
export interface ModalProps extends BaseComponentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

// 表格列定义
export interface TableColumn<T = any> {
  key: string
  title: string
  dataIndex?: keyof T
  render?: (value: any, record: T, index: number) => ReactNode
  sortable?: boolean
  width?: number | string
  align?: 'left' | 'center' | 'right'
}

// 菜单项
export interface MenuItem {
  key: string
  label: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
  disabled?: boolean
  children?: MenuItem[]
}

// 导航项
export interface NavItem {
  title: string
  href: string
  icon?: ReactNode
  badge?: string | number
  external?: boolean
}

// 面包屑项
export interface BreadcrumbItem {
  title: string
  href?: string
  icon?: ReactNode
}
