/**
 * 应用程序常量定义
 */

// 应用信息常量
export const APP_INFO = {
  NAME: 'Vola Fun',
  DESCRIPTION: 'Build Faster with Powerful APIs',
  VERSION: '1.0.0',
  AUTHOR: 'Vola Team',
} as const

// Cookie键名常量
export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'vola_access_token',
  REFRESH_TOKEN: 'vola_refresh_token',
  TOKEN_TYPE: 'vola_token_type',
  LANGUAGE: 'vola_language',
  THEME: 'vola_theme',
} as const

// LocalStorage键名常量
export const STORAGE_KEYS = {
  THEME: 'vola_app_theme',
  LANGUAGE: 'language',
  USER_CACHE: 'vola_user_cache',
  API_CACHE: 'vola_api_cache',
} as const

// 缓存过期时间常量
export const CACHE_EXPIRY = {
  USER: 5 * 60 * 1000, // 5分钟
  AVATAR: 30 * 60 * 1000, // 30分钟
  THEME: 30 * 60 * 1000, // 30分钟
  API_LIST: 10 * 60 * 1000, // 10分钟
  API_DETAIL: 5 * 60 * 1000, // 5分钟
} as const

// Cookie配置常量
export const COOKIE_OPTIONS = {
  expires: 7, // 7天过期
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
} as const

// API类别常量
export const API_CATEGORIES = {
  DATA: 'data',
  AI_ML: 'ai_ml',
  FINANCE: 'finance',
  SOCIAL: 'social',
  TOOLS: 'tools',
  COMMUNICATION: 'communication',
  ENTERTAINMENT: 'entertainment',
  BUSINESS: 'business',
  OTHER: 'other',
} as const

// API状态常量
export const API_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  DEPRECATED: 'deprecated',
  SUSPENDED: 'suspended',
} as const

// 用户角色常量
export const USER_ROLES = {
  USER: 'USER',
  PROVIDER: 'PROVIDER',
  ADMIN: 'ADMIN',
} as const

// 订阅计划常量
export const SUBSCRIPTION_PLANS = {
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const

// 订阅状态常量
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const

// 端点类型常量
export const ENDPOINT_TYPES = {
  REST: 'rest',
  GRAPHQL: 'graphql',
} as const

// HTTP方法常量
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const

// 参数类型常量
export const PARAM_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  ARRAY: 'array',
} as const

// 分页常量
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

// 排序常量
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const

// 环境常量
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const
