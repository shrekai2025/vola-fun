import { atom } from 'jotai'
import type { ApiService, ApiUsageLog } from '@/types'

// API服务列表
export const apiServicesAtom = atom<ApiService[]>([])

// 选中的API服务
export const selectedApiAtom = atom<ApiService | null>(null)

// API分类列表
export const apiCategoriesAtom = atom<string[]>([])

// 搜索关键词
export const searchQueryAtom = atom<string>('')

// 选中的分类筛选
export const selectedCategoriesAtom = atom<string[]>([])

// 排序方式
export const sortByAtom = atom<'usage' | 'price' | 'rating'>('usage')

// 过滤后的API列表
export const filteredApiServicesAtom = atom(
  (get) => {
    const services = get(apiServicesAtom)
    const searchQuery = get(searchQueryAtom).toLowerCase()
    const selectedCategories = get(selectedCategoriesAtom)
    const sortBy = get(sortByAtom)

    let filtered = services

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(service => 
        service.projectName.toLowerCase().includes(searchQuery) ||
        service.description.toLowerCase().includes(searchQuery)
      )
    }

    // 分类过滤
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(service =>
        service.categories.some(cat => selectedCategories.includes(cat))
      )
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return b.totalUsageCount - a.totalUsageCount
        case 'price':
          return a.pricePerCall - b.pricePerCall
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

    return filtered
  }
)

// 用户使用记录
export const usageLogsAtom = atom<ApiUsageLog[]>([])

// 本月使用的积分总数
export const monthlyCreditsUsedAtom = atom(
  (get) => {
    const logs = get(usageLogsAtom)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    return logs
      .filter(log => {
        const logDate = new Date(log.timestamp)
        return logDate.getMonth() === currentMonth && 
               logDate.getFullYear() === currentYear
      })
      .reduce((total, log) => total + log.creditsUsed, 0)
  }
)
