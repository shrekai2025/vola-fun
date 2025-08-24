/**
 * API类型定义统一导出
 */

// 通用类型
export type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  RequestConfig,
  HttpMethod,
  ParamType,
  ParamConfig,
  AppInfo,
  HealthStatus,
  DependencyStatus,
  HealthCheckData,
  SortConfig,
  PaginationConfig,
  BaseQueryParams,
} from './common'

// 用户相关类型
export type {
  UserRole,
  SubscriptionPlan,
  SubscriptionStatus,
  User,
  PublicUser,
  SubscriptionInfo,
  PaymentInfo,
  DetailedUser,
  UserStats,
  UserListParams,
  UpdateUserData,
  AdminUserParams,
} from './user'

// 认证相关类型
export type {
  LoginCredentials,
  TokenData,
  RefreshTokenRequest,
  LoginResponse,
  RefreshTokenResponse,
  SignupData,
  AuthState,
  FirebaseUser,
  AuthErrorCode,
} from './auth'

// API市场相关类型
export type {
  APIStatus,
  APICategory,
  EndpointType,
  API,
  CreateAPIData,
  UpdateAPIData,
  APIListParams,
  EndpointParamConfig,
  MediaTypeConfig,
  APIEndpoint,
  CreateEndpointData,
  UpdateEndpointData,
  EndpointListParams,
  APICallRequest,
  APICallResponse,
  APIStatistics,
} from './apis'
