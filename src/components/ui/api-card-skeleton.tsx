import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function APICardSkeleton() {
  return (
    <Card className="h-full border-border/50 dark:border-border/30 bg-card/50 dark:bg-card/30">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2 flex-1">
            <Skeleton className="h-6 w-6 rounded shrink-0" />
            <Skeleton className="h-5 w-32 max-w-[50%]" />
          </div>
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        <div className="space-y-2 mt-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardHeader>
    
      <CardContent className="pt-0">
        {/* 分类标签骨架 */}
        <div className="flex flex-wrap gap-1 mb-4">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* 统计信息骨架 */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
          <Skeleton className="h-3 w-28" />
        </div>

        {/* 操作按钮骨架 */}
        <div className="flex space-x-2">
          <Skeleton className="h-8 flex-1 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}

// 骨架屏网格组件
export function APICardSkeletonGrid({ count = 9 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out"
          style={{ 
            animationDelay: `${Math.min(index * 80, 800)}ms`,
            animationFillMode: 'both'
          }}
        >
          <APICardSkeleton />
        </div>
      ))}
    </div>
  )
}

// 加载更多骨架屏组件
export function LoadMoreSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={`loadmore-${index}`}
          className="animate-in fade-in slide-in-from-bottom-2 duration-400 ease-out"
          style={{ 
            animationDelay: `${index * 60}ms`,
            animationFillMode: 'both'
          }}
        >
          <APICardSkeleton />
        </div>
      ))}
    </>
  )
}
