/**
 * 标准化标签输入组件
 * 统一的标签管理、验证和交互体验
 */

'use client'

import { useState, useRef, forwardRef, type ForwardedRef } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Plus, AlertCircle } from 'lucide-react'
import type { TagInputProps } from '@/types/ui/base'
import { useTranslation } from '@/components/providers/LanguageProvider'

export interface StandardTagInputProps extends TagInputProps {
  label?: string
  helperText?: string
  error?: string | null
  variant?: 'default' | 'compact'
  showAddButton?: boolean
  showCount?: boolean
  addOnEnter?: boolean
  addOnBlur?: boolean
  addOnComma?: boolean
  trimWhitespace?: boolean
  caseSensitive?: boolean
  tagClassName?: string
  inputClassName?: string
}

function StandardTagInputComponent(
  {
    tags,
    onTagsChange,
    maxTags = 10,
    placeholder,
    disabled = false,
    allowDuplicates = false,
    tagValidator,
    label,
    helperText,
    error,
    variant = 'default',
    showAddButton = false,
    showCount = true,
    addOnEnter = true,
    addOnBlur = false,
    addOnComma = true,
    trimWhitespace = true,
    caseSensitive = false,
    tagClassName = '',
    inputClassName = '',
    className = '',
    'data-testid': dataTestId,
  }: StandardTagInputProps,
  _ref: ForwardedRef<HTMLInputElement>
) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processTag = (tag: string): string => {
    let processed = tag
    if (trimWhitespace) {
      processed = processed.trim()
    }
    if (!caseSensitive) {
      processed = processed.toLowerCase()
    }
    return processed
  }

  const canAddTag = (tag: string): { valid: boolean; reason?: string } => {
    const processed = processTag(tag)

    if (!processed) {
      return { valid: false, reason: t('tagInput.emptyTag', 'Tag cannot be empty') }
    }

    if (tags.length >= maxTags) {
      return {
        valid: false,
        reason: t('tagInput.maxTags', `Maximum ${maxTags} tags allowed`),
      }
    }

    if (!allowDuplicates) {
      const exists = tags.some((existingTag) =>
        caseSensitive
          ? existingTag === processed
          : existingTag.toLowerCase() === processed.toLowerCase()
      )
      if (exists) {
        return { valid: false, reason: t('tagInput.duplicate', 'Tag already exists') }
      }
    }

    if (tagValidator && !tagValidator(processed)) {
      return { valid: false, reason: t('tagInput.invalid', 'Invalid tag format') }
    }

    return { valid: true }
  }

  const addTag = (tag: string) => {
    const validation = canAddTag(tag)
    if (!validation.valid) {
      return false
    }

    const processed = processTag(tag)
    const newTags = [...tags, processed]
    onTagsChange(newTags)
    setInputValue('')
    return true
  }

  const removeTag = (indexToRemove: number) => {
    if (disabled) return

    const newTags = tags.filter((_, index) => index !== indexToRemove)
    onTagsChange(newTags)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // 处理逗号分隔
    if (addOnComma && value.includes(',')) {
      const parts = value.split(',')
      const tagsToAdd = parts.slice(0, -1).filter(Boolean)

      for (const tag of tagsToAdd) {
        if (!addTag(tag)) break
      }

      setInputValue(parts[parts.length - 1] || '')
      return
    }

    setInputValue(value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.key === 'Enter' && addOnEnter) {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    }

    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  const handleInputBlur = () => {
    setFocused(false)
    if (addOnBlur && inputValue.trim()) {
      addTag(inputValue)
    }
  }

  const handleAddClick = () => {
    if (inputValue.trim()) {
      addTag(inputValue)
    }
    inputRef.current?.focus()
  }

  const getContainerClass = () => {
    const baseClass = `
      relative border rounded-md transition-colors
      ${focused && !disabled ? 'border-ring ring-2 ring-ring/20' : 'border-input'}
      ${error ? 'border-destructive' : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
    `

    return variant === 'compact'
      ? `${baseClass} p-1 min-h-[2.5rem]`
      : `${baseClass} p-2 min-h-[2.75rem]`
  }

  const getTagsContainerClass = () => {
    return variant === 'compact' ? 'flex flex-wrap gap-1' : 'flex flex-wrap gap-1.5'
  }

  const handleContainerClick = () => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }

  return (
    <div className={`space-y-2 ${className}`} data-testid={dataTestId}>
      {/* 标签 */}
      {label && (
        <label className={`text-sm font-medium ${error ? 'text-destructive' : ''}`}>
          {label}
          {showCount && (
            <span className='ml-2 text-xs text-muted-foreground font-normal'>
              ({tags.length}/{maxTags})
            </span>
          )}
        </label>
      )}

      {/* 输入容器 */}
      <div className={getContainerClass()} onClick={handleContainerClick}>
        <div className={getTagsContainerClass()}>
          {/* 现有标签 */}
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant='secondary'
              className={`
                flex items-center gap-1 text-xs
                ${disabled ? 'opacity-70' : ''}
                ${tagClassName}
              `}
            >
              <span>{tag}</span>
              {!disabled && (
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation()
                    removeTag(index)
                  }}
                  className='ml-1 hover:bg-destructive/10 rounded-full p-0.5 transition-colors'
                  data-testid={`${dataTestId}-remove-${index}`}
                >
                  <X className='w-3 h-3' />
                </button>
              )}
            </Badge>
          ))}

          {/* 输入框 */}
          <div className='flex items-center gap-2 flex-1 min-w-[120px]'>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={handleInputBlur}
              placeholder={tags.length === 0 ? placeholder : ''}
              disabled={disabled || tags.length >= maxTags}
              className={`
                border-none shadow-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0
                ${inputClassName}
              `}
              data-testid={`${dataTestId}-input`}
            />

            {showAddButton && inputValue.trim() && (
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={handleAddClick}
                disabled={disabled || tags.length >= maxTags}
                className='h-6 w-6 p-0'
                data-testid={`${dataTestId}-add`}
              >
                <Plus className='w-3 h-3' />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 帮助文本和错误信息 */}
      {(helperText || error) && (
        <div className='flex items-start gap-2 text-xs'>
          {error && <AlertCircle className='w-3 h-3 text-destructive mt-0.5 flex-shrink-0' />}
          <span className={error ? 'text-destructive' : 'text-muted-foreground'}>
            {error || helperText}
          </span>
        </div>
      )}
    </div>
  )
}

export const StandardTagInput = forwardRef(StandardTagInputComponent)

export default StandardTagInput
