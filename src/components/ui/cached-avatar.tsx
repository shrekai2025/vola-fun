'use client'

import { User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

interface CachedAvatarProps {
  src?: string
  alt?: string
  className?: string
  fallback?: React.ReactNode
  size?: number
}

// Avatar缓存管理
const avatarCache = new Map<
  string,
  {
    blob: string
    timestamp: number
  }
>()

const AVATAR_CACHE_EXPIRY = 30 * 60 * 1000 // 30分钟

// URL验证辅助函数
const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url)
    return ['http:', 'https:', 'data:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}

/**
 * 缓存头像组件
 * 避免页面切换时重新加载相同头像，提供更流畅的用户体验
 */
export function CachedAvatar({
  src,
  alt = 'Avatar',
  className,
  fallback,
  size = 32,
}: CachedAvatarProps) {
  const [cachedSrc, setCachedSrc] = useState<string | undefined>(src)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!src) {
      setCachedSrc(undefined)
      setHasError(false)
      return
    }

    // Reset error state when src changes
    setHasError(false)

    const cached = avatarCache.get(src)
    const now = Date.now()

    // 检查缓存是否有效
    if (cached && now - cached.timestamp < AVATAR_CACHE_EXPIRY) {
      setCachedSrc(cached.blob)
      return
    }

    // 如果缓存过期或不存在，重新获取
    const loadAndCacheAvatar = async () => {
      try {
        setIsLoading(true)

        // 验证URL格式
        if (!isValidUrl(src)) {
          console.warn('Invalid avatar URL:', src)
          setHasError(true)
          setCachedSrc(src) // 使用原始URL，让浏览器处理
          return
        }

        // 创建带超时的fetch请求
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时

        const response = await fetch(src, {
          method: 'GET',
          mode: 'cors',
          cache: 'default',
          signal: controller.signal,
          headers: {
            Accept: 'image/*',
          },
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.startsWith('image/')) {
            const blob = await response.blob()
            const blobUrl = URL.createObjectURL(blob)

            // 清理过期的缓存
            if (cached?.blob) {
              URL.revokeObjectURL(cached.blob)
            }

            // 更新缓存
            avatarCache.set(src, {
              blob: blobUrl,
              timestamp: now,
            })

            setCachedSrc(blobUrl)
            console.debug('✅ Avatar cached successfully:', src)
          } else {
            console.warn('Response is not an image:', contentType)
            setCachedSrc(src)
          }
        } else {
          console.warn('Avatar fetch failed with status:', response.status, response.statusText)
          setCachedSrc(src)
        }
      } catch (error) {
        // 详细的错误处理
        const errorName = (error as Error)?.name
        const errorMessage = (error as Error)?.message

        if (errorName === 'AbortError') {
          console.warn('Avatar fetch timed out:', src)
        } else if (errorName === 'TypeError' && errorMessage?.includes('Failed to fetch')) {
          console.warn('Network error or CORS issue for avatar:', src, errorMessage)
        } else {
          console.warn('Failed to cache avatar:', src, error)
        }

        // 无论什么错误，都使用原始URL作为后备
        // 不设置 hasError=true，因为我们有后备方案
        setCachedSrc(src)
      } finally {
        setIsLoading(false)
      }
    }

    loadAndCacheAvatar()
  }, [src])

  // 清理函数
  useEffect(() => {
    return () => {
      // 组件卸载时不立即清理缓存，让其他组件能够使用
    }
  }, [])

  return (
    <Avatar className={className} style={{ width: size, height: size }}>
      {cachedSrc && !hasError ? (
        <AvatarImage
          src={cachedSrc}
          alt={alt}
          onError={() => {
            console.warn('Avatar image failed to load:', cachedSrc)
            setHasError(true)
          }}
          style={{
            opacity: isLoading ? 0.7 : 1,
            transition: 'opacity 0.2s ease-in-out',
          }}
        />
      ) : null}
      <AvatarFallback>{fallback || <User className='h-4 w-4' />}</AvatarFallback>
    </Avatar>
  )
}

// 清理缓存的工具函数
export const clearAvatarCache = () => {
  avatarCache.forEach(({ blob }) => {
    URL.revokeObjectURL(blob)
  })
  avatarCache.clear()
  console.debug('🗑️ Avatar cache cleared')
}

// 获取缓存统计信息
export const getAvatarCacheStats = () => {
  const now = Date.now()
  const validEntries = Array.from(avatarCache.entries()).filter(
    ([_, { timestamp }]) => now - timestamp < AVATAR_CACHE_EXPIRY
  )

  return {
    total: avatarCache.size,
    valid: validEntries.length,
    expired: avatarCache.size - validEntries.length,
  }
}
