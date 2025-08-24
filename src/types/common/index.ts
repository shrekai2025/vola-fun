/**
 * 通用类型定义
 */

// 基础实体
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

// 可选字段工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// 深度可选类型
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// 提取类型的键
export type KeyOf<T> = keyof T

// 提取对象值类型
export type ValueOf<T> = T[keyof T]

// 非空类型
export type NonNullable<T> = T extends null | undefined ? never : T

// 数组元素类型
export type ArrayElement<T> = T extends (infer U)[] ? U : never

// 函数参数类型
export type Parameters<T> = T extends (...args: infer P) => unknown ? P : never

// 函数返回值类型
export type ReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never

// Promise解包类型
export type Awaited<T> = T extends Promise<infer U> ? U : T

// 环境变量类型
export type Environment = 'development' | 'production' | 'test'

// 错误类型
export interface AppError {
  code: string
  message: string
  details?: Record<string, string | number | boolean>
  stack?: string
}

// 服务响应类型
export interface ServiceResponse<T = unknown> {
  success: boolean
  data?: T
  error?: AppError
}

// 异步状态
export interface AsyncState<T = unknown> {
  data: T | null
  loading: boolean
  error: AppError | null
}

// 分页数据
export interface PaginatedData<T = unknown> {
  items: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// 文件信息
export interface FileInfo {
  name: string
  size: number
  type: string
  lastModified: number
  url?: string
}

// 坐标
export interface Coordinate {
  x: number
  y: number
}

// 尺寸
export interface Dimension {
  width: number
  height: number
}

// 矩形区域
export interface Rectangle extends Coordinate, Dimension {}

// 颜色值
export type Color =
  | `#${string}`
  | `rgb(${string})`
  | `rgba(${string})`
  | `hsl(${string})`
  | `hsla(${string})`

// 时间戳
export type Timestamp = number | string | Date

// URL字符串
export type UrlString = string

// Email地址
export type EmailAddress = string

// 电话号码
export type PhoneNumber = string

// 唯一标识符
export type UUID = string

// JSON值类型
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray
export interface JsonObject {
  [key: string]: JsonValue
}
export type JsonArray = JsonValue[]

// 配置对象
export interface Config {
  [key: string]: string | number | boolean | Config
}

// 事件处理器
export type EventHandler<T = unknown> = (event: T) => void

// 回调函数
export type Callback<T = unknown, R = void> = (data: T) => R

// 取消函数
export type CancelFunction = () => void

// 清理函数
export type CleanupFunction = () => void
