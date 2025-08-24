/**
 * 标准化模态框组件
 * 提供一致的模态框行为、样式和生命周期管理
 */

'use client'

import { forwardRef, type ForwardedRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { X, AlertCircle, Loader2 } from 'lucide-react'
import type { BaseModalProps, ConfirmDialogProps, AsyncState } from '@/types/ui/base'
import { useTranslation } from '@/components/providers/LanguageProvider'

export interface StandardModalProps extends BaseModalProps, Partial<AsyncState> {
  variant?: 'default' | 'destructive' | 'success'
  showFooter?: boolean
  footerActions?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  hideCloseButton?: boolean
  preventOutsideClick?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full'
}

function StandardModalComponent(
  {
    open,
    onOpenChange,
    title,
    description,
    children,
    variant = 'default',
    size = 'md',
    showCloseButton = true,
    hideCloseButton = false,
    closeOnBackdrop = true,
    closeOnEscape = true,
    preventOutsideClick = false,
    showFooter = false,
    footerActions,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    loading = false,
    disabled = false,
    error = null,
    success = false,
    onErrorDismiss,
    onRetry,
    maxWidth,
    className = '',
    'data-testid': dataTestId,
  }: StandardModalProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const { t } = useTranslation()

  const isDisabled = disabled || loading

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!closeOnEscape) return

      if (event.key === 'Escape' && open) {
        event.preventDefault()
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, closeOnEscape, onOpenChange])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && (preventOutsideClick || isDisabled)) return
    onOpenChange(newOpen)
  }

  const handleConfirm = async () => {
    if (!onConfirm || isDisabled) return

    try {
      await onConfirm()
      if (!loading) {
        onOpenChange(false)
      }
    } catch (err) {
      // Error handling is managed by parent component
      console.error('Modal confirm error:', err)
    }
  }

  const handleCancel = () => {
    if (isDisabled) return

    if (onCancel) {
      onCancel()
    } else {
      onOpenChange(false)
    }
  }

  const getMaxWidthClass = () => {
    const width = maxWidth || size
    const widthMap = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '4xl': 'max-w-4xl',
      full: 'max-w-full',
    }
    return widthMap[width] || widthMap.md
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          headerClass: 'border-b border-destructive/20',
          titleClass: 'text-destructive',
        }
      case 'success':
        return {
          headerClass: 'border-b border-green-200',
          titleClass: 'text-green-700',
        }
      default:
        return {
          headerClass: '',
          titleClass: '',
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        ref={ref}
        className={`${getMaxWidthClass()} ${className}`}
        data-testid={dataTestId}
        onPointerDownOutside={(e) => {
          if (!closeOnBackdrop || preventOutsideClick || isDisabled) {
            e.preventDefault()
          }
        }}
        onEscapeKeyDown={(e) => {
          if (!closeOnEscape || isDisabled) {
            e.preventDefault()
          }
        }}
      >
        {/* 自定义关闭按钮 */}
        {showCloseButton && !hideCloseButton && (
          <button
            onClick={() => handleCancel()}
            disabled={isDisabled}
            className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'
            data-testid={`${dataTestId}-close`}
          >
            <X className='h-4 w-4' />
            <span className='sr-only'>{t('common.close')}</span>
          </button>
        )}

        {/* 头部 */}
        {(title || description) && (
          <DialogHeader className={styles.headerClass}>
            {title && (
              <DialogTitle className={`${styles.titleClass} pr-8`}>
                {loading && <Loader2 className='w-4 h-4 mr-2 animate-spin inline' />}
                {title}
              </DialogTitle>
            )}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        {/* 错误状态 */}
        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='flex items-center justify-between'>
              <span>{typeof error === 'string' ? error : error.message}</span>
              {(onErrorDismiss || onRetry) && (
                <div className='flex gap-2 ml-4'>
                  {onRetry && (
                    <Button variant='ghost' size='sm' onClick={onRetry} disabled={isDisabled}>
                      {t('common.retry')}
                    </Button>
                  )}
                  {onErrorDismiss && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={onErrorDismiss}
                      disabled={isDisabled}
                    >
                      {t('common.dismiss', 'Dismiss')}
                    </Button>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* 成功状态 */}
        {success && !error && (
          <Alert className='mb-4'>
            <AlertDescription>
              {t('common.operationSuccess', 'Operation completed successfully')}
            </AlertDescription>
          </Alert>
        )}

        {/* 内容 */}
        <div className={loading ? 'opacity-50 pointer-events-none' : ''}>{children}</div>

        {/* 底部操作 */}
        {(showFooter || footerActions || onConfirm || onCancel) && (
          <DialogFooter className='flex justify-end gap-3'>
            {footerActions}

            {(onCancel || onConfirm) && (
              <>
                {onCancel && (
                  <Button
                    variant='outline'
                    onClick={handleCancel}
                    disabled={isDisabled}
                    data-testid={`${dataTestId}-cancel`}
                  >
                    {cancelText || t('common.cancel')}
                  </Button>
                )}

                {onConfirm && (
                  <Button
                    variant={variant === 'destructive' ? 'destructive' : 'default'}
                    onClick={handleConfirm}
                    disabled={isDisabled}
                    data-testid={`${dataTestId}-confirm`}
                  >
                    {loading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                    {confirmText || t('common.confirm')}
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// 确认对话框组件
export function ConfirmDialog({
  message,
  confirmText,
  cancelText,
  variant = 'default',
  onConfirm,
  onCancel,
  ...props
}: ConfirmDialogProps) {
  return (
    <StandardModal
      {...props}
      variant={variant}
      showFooter={true}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p className='text-sm text-muted-foreground'>{message}</p>
    </StandardModal>
  )
}

export const StandardModal = forwardRef(StandardModalComponent)

export default StandardModal
