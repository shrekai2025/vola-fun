/**
 * 标准化列表组件
 * 提供一致的列表布局、加载状态、错误处理和分页
 */

'use client'

import { forwardRef, type ForwardedRef, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import type {
  BaseListProps,
  PaginationProps,
  SortingProps,
  FilteringProps,
  SelectionProps,
} from '@/types/ui/base'
import { useTranslation } from '@/components/providers/LanguageProvider'

export interface StandardListProps<T>
  extends BaseListProps<T>,
    Partial<PaginationProps>,
    Partial<SortingProps>,
    Partial<FilteringProps>,
    Partial<SelectionProps<T, string>> {
  title?: string
  description?: string
  variant?: 'default' | 'card' | 'grid'
  itemsPerRow?: 1 | 2 | 3 | 4 | 6
  showHeader?: boolean
  showPagination?: boolean
  showRefresh?: boolean
  renderItem: (item: T, index: number, isSelected?: boolean) => ReactNode
  renderEmpty?: () => ReactNode
  renderSkeleton?: (index: number) => ReactNode
  skeletonCount?: number
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  headerActions?: ReactNode
  className?: string
  'data-testid'?: string
}

function StandardListComponent<T>(
  {
    title,
    description,
    variant = 'default',
    itemsPerRow = 1,
    showHeader = true,
    showPagination = true,
    showRefresh = true,
    items = [],
    loading = false,
    error = null,
    emptyStateText,
    emptyStateAction,
    onRefresh,
    onRetry,
    renderItem,
    renderEmpty,
    renderSkeleton,
    skeletonCount = 6,
    keyExtractor,
    // 分页相关
    page,
    totalCount,
    totalPages,
    hasNext,
    hasPrev,
    onPageChange,
    // 选择相关
    selected = [],
    onSelectionChange,
    selectionMode = 'none',
    isItemSelected,
    headerActions,
    className = '',
    'data-testid': dataTestId,
  }: StandardListProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const { t } = useTranslation()

  const getGridClass = () => {
    if (variant !== 'grid') return ''

    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    }

    return `grid ${gridCols[itemsPerRow]} gap-4`
  }

  const handleItemClick = (item: T, index: number) => {
    if (selectionMode === 'none' || !onSelectionChange) return

    const itemKey = keyExtractor?.(item, index) || index.toString()
    const isSelected = selected.includes(itemKey)

    if (selectionMode === 'single') {
      onSelectionChange(isSelected ? [] : [itemKey])
    } else if (selectionMode === 'multiple') {
      const newSelected = isSelected
        ? selected.filter((key) => key !== itemKey)
        : [...selected, itemKey]
      onSelectionChange(newSelected)
    }
  }

  const renderListContent = () => {
    // 加载状态
    if (loading && items.length === 0) {
      return (
        <div className={getGridClass()}>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index}>
              {renderSkeleton ? (
                renderSkeleton(index)
              ) : (
                <Card>
                  <CardContent className='p-4'>
                    <Skeleton className='h-4 w-full mb-2' />
                    <Skeleton className='h-3 w-3/4' />
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      )
    }

    // 错误状态
    if (error && !items.length) {
      return (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription className='flex items-center justify-between'>
            <span>{typeof error === 'string' ? error : error.message}</span>
            {(onRetry || onRefresh) && (
              <Button variant='ghost' size='sm' onClick={onRetry || onRefresh} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {t('common.retry')}
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )
    }

    // 空状态
    if (!items.length) {
      if (renderEmpty) {
        return renderEmpty()
      }

      return (
        <div className='text-center py-12'>
          <p className='text-muted-foreground mb-4'>
            {emptyStateText || t('common.noData', 'No data available')}
          </p>
          {emptyStateAction}
        </div>
      )
    }

    // 渲染列表项
    return (
      <div className={getGridClass()}>
        {items.map((item, index) => {
          const itemKey = keyExtractor?.(item, index) || index.toString()
          const isSelected = isItemSelected ? isItemSelected(item) : selected.includes(itemKey)

          return (
            <div
              key={itemKey}
              onClick={() => handleItemClick(item, index)}
              className={`
                ${selectionMode !== 'none' ? 'cursor-pointer' : ''}
                ${isSelected ? 'ring-2 ring-primary' : ''}
              `}
            >
              {renderItem(item, index, isSelected)}
            </div>
          )
        })}
      </div>
    )
  }

  const renderPagination = () => {
    if (!showPagination || !onPageChange || !totalPages || totalPages <= 1) {
      return null
    }

    return (
      <div className='flex items-center justify-between mt-6'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          {totalCount && (
            <span>{t('pagination.showing', `Showing ${items.length} of ${totalCount} items`)}</span>
          )}
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(1)}
            disabled={!hasPrev || loading}
          >
            <ChevronsLeft className='w-4 h-4' />
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => page && onPageChange(page - 1)}
            disabled={!hasPrev || loading}
          >
            <ChevronLeft className='w-4 h-4' />
          </Button>

          <span className='px-4 py-2 text-sm'>
            {page} / {totalPages}
          </span>

          <Button
            variant='outline'
            size='sm'
            onClick={() => page && onPageChange(page + 1)}
            disabled={!hasNext || loading}
          >
            <ChevronRight className='w-4 h-4' />
          </Button>

          <Button
            variant='outline'
            size='sm'
            onClick={() => totalPages && onPageChange(totalPages)}
            disabled={!hasNext || loading}
          >
            <ChevronsRight className='w-4 h-4' />
          </Button>
        </div>
      </div>
    )
  }

  const listContent = (
    <div ref={ref} className={className} data-testid={dataTestId}>
      {/* 头部 */}
      {showHeader && (title || description || headerActions || showRefresh) && (
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              {title && <h2 className='text-xl font-bold mb-1'>{title}</h2>}
              {description && <p className='text-muted-foreground'>{description}</p>}
            </div>

            <div className='flex items-center gap-2'>
              {headerActions}
              {showRefresh && onRefresh && (
                <Button variant='outline' size='sm' onClick={onRefresh} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 列表内容 */}
      <div className='relative'>
        {loading && items.length > 0 && (
          <div className='absolute inset-0 bg-background/50 flex items-center justify-center z-10'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        )}
        {renderListContent()}
      </div>

      {/* 分页 */}
      {renderPagination()}
    </div>
  )

  // 根据变体返回不同容器
  if (variant === 'card') {
    return (
      <Card>
        {showHeader && (title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{listContent}</CardContent>
      </Card>
    )
  }

  return listContent
}

export const StandardList = forwardRef(StandardListComponent) as <T>(
  props: StandardListProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof StandardListComponent>

export default StandardList
