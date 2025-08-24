/**
 * 标准化组件基础接口定义
 * 用于确保整个应用中组件Props的一致性和可重用性
 */

import type { ReactNode } from 'react'

// ===== 基础组件接口 =====

/**
 * 所有组件的基础Props接口
 */
export interface BaseComponentProps {
  className?: string
  children?: ReactNode
  'data-testid'?: string
}

/**
 * 加载状态接口
 */
export interface LoadingState {
  loading?: boolean
  disabled?: boolean
}

/**
 * 错误状态接口
 */
export interface ErrorState {
  error?: string | Error | null
  onErrorDismiss?: () => void
}

/**
 * 异步操作状态接口
 */
export interface AsyncState extends LoadingState, ErrorState {
  success?: boolean
  onRetry?: () => void
}

// ===== 事件处理器标准化 =====

/**
 * 标准化事件处理器签名
 */
export type StandardClickHandler = (event: React.MouseEvent<HTMLElement>) => void
export type StandardChangeHandler<T> = (value: T) => void
export type StandardSubmitHandler<T> = (data: T) => void | Promise<void>
export type StandardErrorHandler = (error: Error) => void

/**
 * 异步操作处理器
 */
export interface AsyncOperationHandlers<T = any> {
  onSuccess?: (result: T) => void
  onError?: StandardErrorHandler
  onComplete?: () => void
}

// ===== 表单组件接口 =====

/**
 * 基础表单Props接口
 */
export interface BaseFormProps<T = any> extends AsyncState {
  onSubmit?: StandardSubmitHandler<T>
  onReset?: () => void
  onCancel?: () => void
  submitText?: string
  resetText?: string
  cancelText?: string
  isSubmitting?: boolean
  defaultValues?: Partial<T>
}

/**
 * 表单字段Props接口
 */
export interface BaseFieldProps extends BaseComponentProps {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string | null
  helperText?: string
}

/**
 * 表单验证接口
 */
export interface ValidationProps {
  rules?: Record<string, (value: any) => string | boolean>
  validate?: (value: any) => string | boolean
  onValidate?: (isValid: boolean) => void
}

// ===== 列表组件接口 =====

/**
 * 基础列表Props接口
 */
export interface BaseListProps<T> extends AsyncState {
  items?: T[]
  emptyStateText?: string
  emptyStateAction?: ReactNode
  onRefresh?: () => void
  keyExtractor?: (item: T, index: number) => string
}

/**
 * 分页接口
 */
export interface PaginationProps {
  page?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
  hasNext?: boolean
  hasPrev?: boolean
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

/**
 * 排序接口
 */
export interface SortingProps<T = string> {
  sortBy?: T
  sortOrder?: 'asc' | 'desc'
  onSortChange?: (sortBy: T, sortOrder: 'asc' | 'desc') => void
}

/**
 * 筛选接口
 */
export interface FilteringProps<T = Record<string, any>> {
  filters?: T
  onFiltersChange?: (filters: T) => void
  onFilterReset?: () => void
}

/**
 * 选择接口
 */
export interface SelectionProps<TItem = any, TKey = string> {
  selected?: TKey[]
  onSelectionChange?: (selected: TKey[]) => void
  selectionMode?: 'single' | 'multiple' | 'none'
  isItemSelected?: (item: TItem) => boolean
}

// ===== 模态框组件接口 =====

/**
 * 基础模态框Props接口
 */
export interface BaseModalProps extends BaseComponentProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

/**
 * 确认对话框接口
 */
export interface ConfirmDialogProps extends Omit<BaseModalProps, 'children'> {
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

// ===== 卡片组件接口 =====

/**
 * 基础卡片Props接口
 */
export interface BaseCardProps extends BaseComponentProps {
  title?: string
  description?: string
  variant?: 'default' | 'outline' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  header?: ReactNode
  footer?: ReactNode
}

/**
 * 交互式卡片接口
 */
export interface InteractiveCardProps extends BaseCardProps {
  clickable?: boolean
  hoverable?: boolean
  selected?: boolean
  onClick?: StandardClickHandler
  onDoubleClick?: StandardClickHandler
  onSelect?: (selected: boolean) => void
}

// ===== 数据展示组件接口 =====

/**
 * 头像组件接口
 */
export interface BaseAvatarProps extends BaseComponentProps {
  src?: string | null
  alt?: string
  size?: number | 'sm' | 'md' | 'lg'
  fallback?: ReactNode
  loading?: boolean
  error?: boolean
  onLoad?: () => void
  onError?: () => void
}

/**
 * 状态徽章接口
 */
export interface BaseStatusProps extends BaseComponentProps {
  status: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
}

// ===== 导航组件接口 =====

/**
 * 导航项接口
 */
export interface NavItemProps {
  key: string
  label: string
  href?: string
  icon?: ReactNode
  badge?: string | number
  active?: boolean
  disabled?: boolean
  external?: boolean
  onClick?: StandardClickHandler
  children?: NavItemProps[]
}

/**
 * 面包屑导航接口
 */
export interface BreadcrumbItemProps {
  label: string
  href?: string
  icon?: ReactNode
  active?: boolean
  onClick?: StandardClickHandler
}

// ===== 数据输入组件接口 =====

/**
 * 标签输入组件接口
 */
export interface TagInputProps extends BaseComponentProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  maxTags?: number
  placeholder?: string
  disabled?: boolean
  allowDuplicates?: boolean
  tagValidator?: (tag: string) => boolean
}

/**
 * 文件上传组件接口
 */
export interface FileUploadProps extends AsyncState {
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  onFileChange: (files: File[]) => void
  onUpload?: (files: File[]) => Promise<void>
  uploadText?: string
  dragText?: string
}

// ===== 布局组件接口 =====

/**
 * 响应式布局Props
 */
export interface ResponsiveProps {
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  cols?: number | { [key: string]: number }
  gap?: number | string
}

/**
 * 容器Props接口
 */
export interface ContainerProps extends BaseComponentProps, ResponsiveProps {
  fluid?: boolean
  centered?: boolean
  padding?: boolean
}
