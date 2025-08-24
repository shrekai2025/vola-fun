import { useTranslation } from '@/components/providers/LanguageProvider'
import { cn } from '@/lib/utils'
import { Skeleton } from './skeleton'

interface LoadingProps {
  /**
   * 加载样式类型
   * - 'spinner': 旋转器样式
   * - 'skeleton': 骨架屏样式
   * - 'pulse': 简单脉冲效果
   * - 'dots': 跳跃小点样式
   */
  variant?: 'spinner' | 'skeleton' | 'pulse' | 'dots'

  /**
   * 加载提示文字，不传则使用默认文字
   */
  text?: string

  /**
   * 是否显示文字
   */
  showText?: boolean

  /**
   * 组件大小
   */
  size?: 'sm' | 'md' | 'lg'

  /**
   * 容器类名
   */
  className?: string

  /**
   * 最小高度
   */
  minHeight?: string

  /**
   * 骨架屏配置（仅在variant为skeleton时生效）
   */
  skeleton?: {
    rows?: number
    cols?: number
    showTitle?: boolean
  }
}

export function Loading({
  variant = 'spinner',
  text,
  showText = true,
  size = 'md',
  className,
  minHeight = 'min-h-[200px]',
  skeleton = { rows: 2, cols: 1, showTitle: true },
}: LoadingProps) {
  const { t } = useTranslation()

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn('animate-pulse space-y-4', className)}>
        {skeleton.showTitle && <Skeleton className='h-8 w-1/4' />}
        <div
          className={cn(
            'grid gap-6',
            skeleton.cols && skeleton.cols > 1 ? `grid-cols-1 md:grid-cols-${skeleton.cols}` : ''
          )}
        >
          {Array.from({ length: skeleton.rows || 2 }).map((_, index) => (
            <Skeleton key={index} className='h-64' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', minHeight, className)}>
      {/* 加载指示器 */}
      <div className='flex items-center justify-center mb-4'>
        {variant === 'spinner' && (
          <div
            className={cn(
              'border-2 border-primary border-t-transparent rounded-full animate-spin',
              sizeClasses[size]
            )}
          />
        )}

        {variant === 'pulse' && (
          <div className={cn('bg-primary rounded-full animate-pulse', sizeClasses[size])} />
        )}

        {variant === 'dots' && (
          <div className='flex space-x-1'>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={cn(
                  'bg-primary rounded-full animate-bounce',
                  size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
                )}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 加载文字 */}
      {showText && (
        <p className={cn('text-muted-foreground', textSizeClasses[size])}>
          {text || t('common.loading')}...
        </p>
      )}
    </div>
  )
}

// 页面级别的Loading组件
interface PageLoadingProps {
  text?: string
  variant?: LoadingProps['variant']
}

export function PageLoading({ text, variant = 'spinner' }: PageLoadingProps) {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <Loading variant={variant} text={text} minHeight='min-h-[400px]' />
      </div>
    </div>
  )
}

// 内联Loading组件
interface InlineLoadingProps {
  text?: string
  size?: LoadingProps['size']
}

export function InlineLoading({ text, size = 'sm' }: InlineLoadingProps) {
  const { t } = useTranslation()

  return (
    <div className='flex items-center space-x-2'>
      <div
        className={cn(
          'border-2 border-primary border-t-transparent rounded-full animate-spin',
          size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
        )}
      />
      {text && (
        <span className='text-muted-foreground text-sm'>{text || t('common.loading')}...</span>
      )}
    </div>
  )
}
