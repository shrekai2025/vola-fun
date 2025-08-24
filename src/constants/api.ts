/**
 * API相关常量定义
 */

// API配置常量
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.vola.fun',
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const

// API端点常量
export const API_ENDPOINTS = {
  // 根端点
  ROOT: '/',
  HEALTH: '/health',

  // 认证相关
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
  },

  // 用户相关
  USERS: {
    ME: '/api/v1/users/me',
    ME_DETAILED: '/api/v1/users/me/detailed',
    ME_STATS: '/api/v1/users/me/stats',
    DELETE_ME: '/api/v1/users/me',
    LIST: '/api/v1/users',
    DETAIL: (userId: string) => `/api/v1/users/${userId}`,
    ADMIN_DETAIL: (userId: string) => `/api/v1/users/admin/${userId}`,
    ADMIN_UPDATE: (userId: string) => `/api/v1/users/admin/${userId}`,
    ADMIN_ACTIVATE: (userId: string) => `/api/v1/users/admin/${userId}/activate`,
    ADMIN_DEACTIVATE: (userId: string) => `/api/v1/users/admin/${userId}/deactivate`,
  },

  // API市场相关
  APIS: {
    LIST: '/api/v1/apis/',
    DETAIL: (apiId: string) => `/api/v1/apis/${apiId}`,
    CREATE: '/api/v1/apis/',
    UPDATE: (apiId: string) => `/api/v1/apis/${apiId}`,
    DELETE: (apiId: string) => `/api/v1/apis/${apiId}`,

    // 端点相关
    ENDPOINTS: {
      LIST: (apiId: string) => `/api/v1/apis/${apiId}/endpoints`,
      DETAIL: (apiId: string, endpointId: string) =>
        `/api/v1/apis/${apiId}/endpoints/${endpointId}`,
      CREATE: (apiId: string) => `/api/v1/apis/${apiId}/endpoints`,
      UPDATE: (apiId: string, endpointId: string) =>
        `/api/v1/apis/${apiId}/endpoints/${endpointId}`,
      DELETE: (apiId: string, endpointId: string) =>
        `/api/v1/apis/${apiId}/endpoints/${endpointId}`,
    },
  },
} as const

// HTTP状态码常量
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  RATE_LIMIT_EXCEEDED: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const

// API错误代码常量
export const API_ERROR_CODES = {
  SUCCESS: 'SUCCESS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // 认证相关
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  TOKEN_REFRESH_SUCCESS: 'TOKEN_REFRESH_SUCCESS',
  ACCOUNT_DEACTIVATED: 'ACCOUNT_DEACTIVATED',
  USER_ACTIVATED: 'USER_ACTIVATED',

  // API相关
  API_CREATED: 'CREATED',
  API_UPDATED: 'UPDATED',
  API_DELETED: 'DELETED',
} as const
