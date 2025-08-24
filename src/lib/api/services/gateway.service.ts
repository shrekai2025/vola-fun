import type {
  APIHealthStatus,
  ApiResponse,
  ProxyRequestOptions,
  ProxyResponse,
  RequestConfig,
} from '@/types/api'
import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'

export type { APIHealthStatus, ProxyRequestOptions, ProxyResponse }

export class GatewayService {
  /**
   * 代理API调用
   * 这个方法直接转发请求到目标API
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async proxyRequest<T = any>(
    path: string,
    options: ProxyRequestOptions = {}
  ): Promise<ProxyResponse<T>> {
    const { method = 'GET', headers = {}, body, timeout = 30000 } = options

    // 构建代理URL，去掉开头的斜杠避免双斜杠
    const proxyPath = path.startsWith('/') ? path.slice(1) : path
    const url = API_ENDPOINTS.GATEWAY.PROXY(proxyPath)

    try {
      // 根据请求方法选择合适的 apiClient 方法
      let response: ApiResponse<T>

      const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers,
      }

      const config: RequestConfig = { headers: requestHeaders, timeout }

      switch (method.toUpperCase()) {
        case 'GET':
          response = await apiClient.get<T>(url, config)
          break
        case 'POST':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response = await apiClient.post<T>(url, body as Record<string, any>, config)
          break
        case 'PUT':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response = await apiClient.put<T>(url, body as Record<string, any>, config)
          break
        case 'PATCH':
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response = await apiClient.patch<T>(url, body as Record<string, any>, config)
          break
        case 'DELETE':
          response = await apiClient.delete<T>(url, config)
          break
        default:
          throw new Error(`Unsupported HTTP method: ${method}`)
      }

      // 转换为 ProxyResponse 格式
      const proxyResponse: ProxyResponse<T> = {
        data: response.data,
        status: response.success ? 200 : 500,
        statusText: response.success ? response.message || 'OK' : response.message || 'Error',
        headers: {},
      }

      return proxyResponse
    } catch (error) {
      // 重新抛出错误，保持原始错误信息
      throw error
    }
  }

  /**
   * 检查API健康状态
   */
  static async checkAPIHealth(apiSlug: string): Promise<ApiResponse<APIHealthStatus>> {
    const response = await apiClient.get<APIHealthStatus>(API_ENDPOINTS.GATEWAY.HEALTH(apiSlug))
    return response
  }

  /**
   * GET请求代理
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async get<T = any>(
    path: string,
    headers?: Record<string, string>
  ): Promise<ProxyResponse<T>> {
    return this.proxyRequest(path, { method: 'GET', headers })
  }

  /**
   * POST请求代理
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async post<T = any>(
    path: string,
    body?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    headers?: Record<string, string>
  ): Promise<ProxyResponse<T>> {
    return this.proxyRequest(path, { method: 'POST', body, headers })
  }

  /**
   * PUT请求代理
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async put<T = any>(
    path: string,
    body?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    headers?: Record<string, string>
  ): Promise<ProxyResponse<T>> {
    return this.proxyRequest(path, { method: 'PUT', body, headers })
  }

  /**
   * PATCH请求代理
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async patch<T = any>(
    path: string,
    body?: any, // eslint-disable-line @typescript-eslint/no-explicit-any
    headers?: Record<string, string>
  ): Promise<ProxyResponse<T>> {
    return this.proxyRequest(path, { method: 'PATCH', body, headers })
  }

  /**
   * DELETE请求代理
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async delete<T = any>(
    path: string,
    headers?: Record<string, string>
  ): Promise<ProxyResponse<T>> {
    return this.proxyRequest(path, { method: 'DELETE', headers })
  }

  /**
   * 批量检查多个API的健康状态
   */
  static async checkMultipleAPIHealth(apiSlugs: string[]): Promise<ApiResponse<APIHealthStatus[]>> {
    const promises = apiSlugs.map((slug) => this.checkAPIHealth(slug))

    try {
      const results = await Promise.allSettled(promises)
      const healthStatuses: APIHealthStatus[] = []

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          healthStatuses.push(result.value.data)
        } else {
          // 如果检查失败，创建一个错误状态
          healthStatuses.push({
            api_slug: apiSlugs[index],
            status: 'unhealthy',
            response_time: 0,
            uptime_percentage: 0,
            last_check: new Date().toISOString(),
            error_message:
              result.status === 'rejected'
                ? result.reason?.message || 'Health check failed'
                : 'API health check returned error',
          })
        }
      })

      return {
        success: true,
        code: 'SUCCESS',
        message: 'Batch health check completed',
        data: healthStatuses,
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * 获取健康的API列表
   */
  static async getHealthyAPIs(apiSlugs: string[]): Promise<ApiResponse<string[]>> {
    const response = await this.checkMultipleAPIHealth(apiSlugs)

    if (response.success) {
      const healthyAPIs = response.data
        .filter((status) => status.status === 'healthy')
        .map((status) => status.api_slug)

      return {
        ...response,
        data: healthyAPIs,
      }
    }

    return {
      ...response,
      data: [],
    }
  }

  /**
   * 创建带有API Key认证的代理请求
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async proxyWithAPIKey<T = any>(
    path: string,
    apiKey: string,
    options: ProxyRequestOptions = {}
  ): Promise<ProxyResponse<T>> {
    const headers = {
      'X-API-Key': apiKey,
      ...options.headers,
    }

    return this.proxyRequest(path, {
      ...options,
      headers,
    })
  }

  /**
   * 创建带有Bearer Token认证的代理请求
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async proxyWithBearerToken<T = any>(
    path: string,
    token: string,
    options: ProxyRequestOptions = {}
  ): Promise<ProxyResponse<T>> {
    const headers = {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    }

    return this.proxyRequest(path, {
      ...options,
      headers,
    })
  }
}

export default GatewayService
