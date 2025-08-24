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
    ADMIN_VERIFY: (userId: string) => `/api/v1/users/admin/${userId}/verify`,
    ADMIN_SUSPEND: (userId: string) => `/api/v1/users/admin/${userId}/suspend`,
    ADMIN_ACTIVATE: (userId: string) => `/api/v1/users/admin/${userId}/activate`,
  },

  // API市场相关
  APIS: {
    LIST: '/api/v1/apis',
    DETAIL: (apiId: string) => `/api/v1/apis/${apiId}`,
    CREATE: '/api/v1/apis',
    UPDATE: (apiId: string) => `/api/v1/apis/${apiId}`,
    DELETE: (apiId: string) => `/api/v1/apis/${apiId}`,
    UPLOAD_AVATAR: (apiId: string) => `/api/v1/apis/${apiId}/avatar`,

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

    // 版本相关
    VERSIONS: {
      LIST: (apiId: string) => `/api/v1/apis/${apiId}/versions`,
      CREATE: (apiId: string) => `/api/v1/apis/${apiId}/versions`,
    },

    // 文档相关
    DOCUMENTATION: {
      GET: (apiId: string) => `/api/v1/apis/${apiId}/documentation`,
      UPDATE: (apiId: string) => `/api/v1/apis/${apiId}/documentation`,
    },
  },

  // API密钥管理
  KEYS: {
    LIST: '/api/v1/keys',
    DETAIL: (keyId: string) => `/api/v1/keys/${keyId}`,
    CREATE: '/api/v1/keys',
    UPDATE: (keyId: string) => `/api/v1/keys/${keyId}`,
    DELETE: (keyId: string) => `/api/v1/keys/${keyId}`,
    REGENERATE: (keyId: string) => `/api/v1/keys/${keyId}/regenerate`,
  },

  // 计费相关
  BILLING: {
    BALANCE: '/api/v1/billing/balance',
    TRANSACTIONS: '/api/v1/billing/transactions',
    USAGE: '/api/v1/billing/usage',
    STATS: '/api/v1/billing/stats',
    SUBSCRIPTIONS: '/api/v1/billing/subscriptions',
    INVOICES: '/api/v1/billing/invoices',
    EXPORT: '/api/v1/billing/export',
  },

  // 收藏相关
  FAVORITES: {
    LIST: '/api/v1/favorites',
    CREATE: '/api/v1/favorites',
    DELETE: (favoriteId: string) => `/api/v1/favorites/${favoriteId}`,
    APIS: '/api/v1/favorites/apis',
    NODES: '/api/v1/favorites/nodes',
    STATS: '/api/v1/favorites/stats',
    CHECK: '/api/v1/favorites/check',
  },

  // 节点相关
  NODES: {
    LIST: '/api/v1/nodes',
    DETAIL: (nodeId: string) => `/api/v1/nodes/${nodeId}`,
    CREATE: '/api/v1/nodes',
    UPDATE: (nodeId: string) => `/api/v1/nodes/${nodeId}`,
    DELETE: (nodeId: string) => `/api/v1/nodes/${nodeId}`,
    UPLOAD_AVATAR: (nodeId: string) => `/api/v1/nodes/${nodeId}/avatar`,
    PURCHASE: (nodeId: string) => `/api/v1/nodes/${nodeId}/purchase`,
    DOWNLOAD: (nodeId: string) => `/api/v1/nodes/${nodeId}/download`,
    MY_PURCHASES: '/api/v1/nodes/my-purchases',

    // 版本相关
    VERSIONS: {
      LIST: (nodeId: string) => `/api/v1/nodes/${nodeId}/versions`,
      CREATE: (nodeId: string) => `/api/v1/nodes/${nodeId}/versions`,
    },
  },

  // 支付相关
  PAYMENTS: {
    PLANS: '/api/v1/payments/plans',
    INFO: '/api/v1/payments/info',
    DETAIL: (paymentId: string) => `/api/v1/payments/${paymentId}`,

    // Stripe
    STRIPE: {
      CREATE_INTENT: '/api/v1/payments/stripe/create-intent',
      CREATE_CHECKOUT: '/api/v1/payments/stripe/create-checkout',
      WEBHOOK: '/api/v1/payments/stripe/webhook',
    },

    // Hel
    HEL: {
      TRANSACTION: (signature: string) => `/api/v1/payments/hel/transaction/${signature}`,
      WEBHOOK: '/api/v1/payments/hel/webhook',
    },
  },

  // 网关相关
  GATEWAY: {
    PROXY: (path: string) => `/api/v1/gateway/${path}`,
    HEALTH: (apiSlug: string) => `/api/v1/gateway/health/${apiSlug}`,
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
