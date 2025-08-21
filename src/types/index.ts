// 基础类型定义

export interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed?: string
  isActive: boolean
}

export interface User {
  id: string
  firebase_uid: string
  email: string
  username: string
  full_name: string
  avatar_url: string
  role: string
  is_active: boolean
  is_verified: boolean
  subscription_balance: number
  one_time_balance: number
  bio: string
  company: string
  website: string
  location: string
  plan?: string // 订阅计划：basic/BASIC 或空表示未订阅，其他值表示已订阅
  created_at: string
  updated_at: string
}



export interface ApiService {
  id: string
  projectName: string
  projectId: string
  description: string
  estimatedResponseTime: number
  categories: string[]
  providerEndpoint: string
  providerKey: string
  pricePerCall: number
  documentation: ApiDocumentation
  userEndpoint: string
  totalUsageCount: number
  rating: number
  reviews: ApiReview[]
}

export interface ApiDocumentation {
  requestParams: ApiParam[]
  responseParams: ApiParam[]
  statusCodes: StatusCode[]
  examples: {
    request: any
    response: any
  }
}

export interface ApiParam {
  name: string
  type: string
  required: boolean
  description: string
  example?: any
}

export interface StatusCode {
  code: number
  description: string
}

export interface ApiReview {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface ApiUsageLog {
  id: string
  userId: string
  apiServiceId: string
  projectName: string
  timestamp: string
  status: 'success' | 'failed'
  creditsUsed: number
  requestData?: any
  responseData?: any
}

export interface ApiCallRequest {
  apiId: string
  params: Record<string, any>
}

export interface ApiCallResponse {
  success: boolean
  data?: any
  error?: string
  creditsUsed: number
}
