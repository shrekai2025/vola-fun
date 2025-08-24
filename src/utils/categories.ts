/**
 * Category utilities for API management
 */

import type { APICategory } from '@/types/api'

/**
 * Generate category options with i18n translations
 * @param t - i18n translation function
 * @returns Array of category options with value and label
 */
export function getCategoryOptions(t: (key: string) => string) {
  const categoryKeys: APICategory[] = [
    'data',
    'ai_ml',
    'finance',
    'social',
    'tools',
    'communication',
    'entertainment',
    'business',
    'other',
  ]

  return categoryKeys.map((value) => ({
    value,
    label: t(`apiProvider.categories.${value}`),
  }))
}

/**
 * Get category label by value with i18n
 * @param category - Category value
 * @param t - i18n translation function
 * @returns Translated category label
 */
export function getCategoryLabel(category: APICategory, t: (key: string) => string): string {
  return t(`apiProvider.categories.${category}`)
}
