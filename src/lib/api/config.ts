export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.vola.fun',
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    ME: '/api/v1/users/me',
  },
  APIS: {
    LIST: '/api/v1/apis/',
    DETAIL: (id: string) => `/api/v1/apis/${id}`,
    CREATE: '/api/v1/apis/',
    UPDATE: (id: string) => `/api/v1/apis/${id}`,
    DELETE: (id: string) => `/api/v1/apis/${id}`,
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
