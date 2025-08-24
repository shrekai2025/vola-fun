/**
 * 标准化表单组件
 * 提供一致的表单布局、状态管理和错误处理
 */

'use client'

import { forwardRef, type ForwardedRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'
import type { BaseFormProps } from '@/types/ui/base'
import { useTranslation } from '@/components/providers/LanguageProvider'

export interface StandardFormProps<T = unknown> extends BaseFormProps<T> {
  title?: string
  description?: string
  children: React.ReactNode
  variant?: 'default' | 'card' | 'inline'
  showActions?: boolean
  actionsAlignment?: 'left' | 'center' | 'right'
  submitVariant?: 'default' | 'destructive'
  fullWidth?: boolean
  spacing?: 'compact' | 'normal' | 'relaxed'
  className?: string
  'data-testid'?: string
}

function StandardFormComponent<T = unknown>(
  {
    title,
    description,
    children,
    variant = 'default',
    showActions = true,
    actionsAlignment = 'right',
    submitVariant = 'default',
    fullWidth = false,
    spacing = 'normal',
    loading = false,
    disabled = false,
    error = null,
    success = false,
    isSubmitting = false,
    onSubmit,
    onReset,
    onCancel,
    onErrorDismiss,
    onRetry,
    submitText,
    resetText,
    cancelText,
    className = '',
    'data-testid': dataTestId,
    ...props
  }: StandardFormProps<T>,
  ref: ForwardedRef<HTMLFormElement>
) {
  const { t } = useTranslation()

  const isDisabled = disabled || loading || isSubmitting

  const getSpacingClass = () => {
    switch (spacing) {
      case 'compact':
        return 'space-y-3'
      case 'relaxed':
        return 'space-y-8'
      default:
        return 'space-y-6'
    }
  }

  const getActionsAlignment = () => {
    switch (actionsAlignment) {
      case 'left':
        return 'justify-start'
      case 'center':
        return 'justify-center'
      default:
        return 'justify-end'
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (onSubmit && !isDisabled) {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData) as T
      onSubmit(data)
    }
  }

  const formContent = (
    <form
      ref={ref}
      onSubmit={handleSubmit}
      className={`${getSpacingClass()} ${fullWidth ? 'w-full' : ''} ${className}`}
      data-testid={dataTestId}
      {...props}
    >
      {/* 错误状态显示 */}
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription className='flex items-center justify-between'>
            <span>{typeof error === 'string' ? error : error.message}</span>
            {(onErrorDismiss || onRetry) && (
              <div className='flex gap-2 ml-4'>
                {onRetry && (
                  <Button variant='ghost' size='sm' onClick={onRetry} disabled={isDisabled}>
                    {t('common.retry', 'Retry')}
                  </Button>
                )}
                {onErrorDismiss && (
                  <Button variant='ghost' size='sm' onClick={onErrorDismiss} disabled={isDisabled}>
                    {t('common.dismiss', 'Dismiss')}
                  </Button>
                )}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* 成功状态显示 */}
      {success && !error && (
        <Alert>
          <AlertDescription>
            {t('common.operationSuccess', 'Operation completed successfully')}
          </AlertDescription>
        </Alert>
      )}

      {/* 表单字段 */}
      <div className={getSpacingClass()}>{children}</div>

      {/* 操作按钮 */}
      {showActions && (
        <div className={`flex gap-3 pt-4 ${getActionsAlignment()}`}>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isDisabled}
              data-testid={`${dataTestId}-cancel`}
            >
              {cancelText || t('common.cancel')}
            </Button>
          )}

          {onReset && (
            <Button
              type='reset'
              variant='ghost'
              onClick={onReset}
              disabled={isDisabled}
              data-testid={`${dataTestId}-reset`}
            >
              {resetText || t('common.reset', 'Reset')}
            </Button>
          )}

          <Button
            type='submit'
            variant={submitVariant}
            disabled={isDisabled}
            data-testid={`${dataTestId}-submit`}
          >
            {isSubmitting && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            {submitText || t('common.submit', 'Submit')}
          </Button>
        </div>
      )}
    </form>
  )

  // 根据变体渲染不同的容器
  switch (variant) {
    case 'card':
      return (
        <Card className={fullWidth ? 'w-full' : ''}>
          {(title || description) && (
            <CardHeader>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent>{formContent}</CardContent>
        </Card>
      )

    case 'inline':
      return (
        <div className={`inline-block ${fullWidth ? 'w-full' : ''}`}>
          {(title || description) && (
            <div className='mb-6'>
              {title && <h3 className='text-lg font-semibold mb-2'>{title}</h3>}
              {description && <p className='text-sm text-muted-foreground'>{description}</p>}
            </div>
          )}
          {formContent}
        </div>
      )

    default:
      return (
        <div className={fullWidth ? 'w-full' : ''}>
          {(title || description) && (
            <div className='mb-6'>
              {title && <h2 className='text-xl font-bold mb-2'>{title}</h2>}
              {description && <p className='text-muted-foreground'>{description}</p>}
            </div>
          )}
          {formContent}
        </div>
      )
  }
}

export const StandardForm = forwardRef(StandardFormComponent) as <T = unknown>(
  props: StandardFormProps<T> & { ref?: ForwardedRef<HTMLFormElement> }
) => ReturnType<typeof StandardFormComponent>

export default StandardForm
