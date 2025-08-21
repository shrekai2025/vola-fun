import axios from 'axios'
import type { ApiService, ApiCallRequest, ApiCallResponse, User, ApiUsageLog } from '@/types'

// 创建axios实例
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 30000,
})

// 请求拦截器：添加认证token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vola_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：处理错误
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

export class ApiService {
  // 获取所有API服务
  static async getApiServices(): Promise<ApiService[]> {
    const response = await apiClient.get('/services')
    return response.data
  }

  // 获取API分类
  static async getCategories(): Promise<string[]> {
    const response = await apiClient.get('/categories')
    return response.data
  }

  // 获取特定API服务详情
  static async getApiService(id: string): Promise<ApiService> {
    const response = await apiClient.get(`/services/${id}`)
    return response.data
  }

  // 调用API服务
  static async callApi(request: ApiCallRequest): Promise<ApiCallResponse> {
    const response = await apiClient.post('/call', request)
    return response.data
  }

  // 获取用户信息
  static async getUserInfo(): Promise<User> {
    const response = await apiClient.get('/user')
    return response.data
  }

  // 获取用户使用记录
  static async getUserUsageLogs(): Promise<ApiUsageLog[]> {
    const response = await apiClient.get('/user/usage')
    return response.data
  }

  // 生成新的API密钥
  static async generateApiKey(name: string): Promise<string> {
    const response = await apiClient.post('/user/api-keys', { name })
    return response.data.key
  }

  // 充值积分
  static async purchaseCredits(amount: number): Promise<{ success: boolean }> {
    const response = await apiClient.post('/user/purchase', { amount })
    return response.data
  }

  // 订阅Pro计划
  static async subscribeToPro(): Promise<{ success: boolean; subscriptionId: string }> {
    const response = await apiClient.post('/user/subscribe')
    return response.data
  }
}

export default ApiService
