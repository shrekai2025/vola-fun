/**
 * 验证工具函数
 */

/**
 * 验证邮箱地址
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 验证密码强度
 */
export function isValidPassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * 验证API Slug格式
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

/**
 * 验证UUID格式
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * 验证端口号
 */
export function isValidPort(port: number): boolean {
  return Number.isInteger(port) && port >= 1 && port <= 65535
}

/**
 * 验证JSON字符串
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

/**
 * 验证响应时间范围
 */
export function isValidResponseTime(ms: number): boolean {
  return Number.isInteger(ms) && ms >= 1 && ms <= 600000 // 1ms to 10分钟
}

/**
 * 验证API名称
 */
export function isValidApiName(name: string): boolean {
  return name.length >= 1 && name.length <= 255 && name.trim().length > 0
}

/**
 * 验证短描述
 */
export function isValidShortDescription(description: string): boolean {
  return description.length >= 1 && description.length <= 100
}

/**
 * 验证标签
 */
export function isValidTag(tag: string): boolean {
  return tag.length >= 1 && tag.length <= 50 && /^[a-zA-Z0-9\-_]+$/.test(tag)
}

/**
 * 验证标签列表
 */
export function isValidTags(tags: string[]): boolean {
  if (tags.length > 10) return false // 最多10个标签
  return tags.every((tag) => isValidTag(tag))
}

/**
 * 验证价格
 */
export function isValidPrice(price: number): boolean {
  return Number.isFinite(price) && price >= 0 && price <= 999999
}

/**
 * 验证用户名
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
  return usernameRegex.test(username)
}

/**
 * 验证全名
 */
export function isValidFullName(name: string): boolean {
  return name.length >= 1 && name.length <= 100 && name.trim().length > 0
}

/**
 * 验证电话号码
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

/**
 * 验证文件类型
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

/**
 * 验证文件大小
 */
export function isValidFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}

/**
 * 通用必填字段验证
 */
export function isRequired(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return Boolean(value)
}

/**
 * 验证对象是否包含必填字段
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  obj: T,
  requiredFields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter((field) => !isRequired(obj[field])) as string[]

  return {
    isValid: missingFields.length === 0,
    missingFields,
  }
}
