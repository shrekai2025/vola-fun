import type {
  AccountBalance,
  ApiResponse,
  ExportParams,
  Invoice,
  InvoiceListParams,
  PaginatedResponse,
  Subscription,
  Transaction,
  TransactionListParams,
  UsageListParams,
  UsageRecord,
  UsageStats,
} from '@/types/api'
import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'

export type {
  AccountBalance,
  ExportParams,
  Invoice,
  InvoiceListParams,
  Subscription,
  Transaction,
  TransactionListParams,
  UsageListParams,
  UsageRecord,
  UsageStats,
}

export class BillingService {
  /**
   * 获取账户余额
   */
  static async getBalance(): Promise<ApiResponse<AccountBalance>> {
    const response = await apiClient.get<AccountBalance>(API_ENDPOINTS.BILLING.BALANCE)
    return response
  }

  /**
   * 获取交易记录
   */
  static async getTransactions(
    params?: TransactionListParams
  ): Promise<PaginatedResponse<Transaction>> {
    const response = (await apiClient.get<Transaction[]>(API_ENDPOINTS.BILLING.TRANSACTIONS, {
      params: {
        page: 1,
        page_size: 20,
        ...params,
      },
    })) as PaginatedResponse<Transaction>

    return response
  }

  /**
   * 获取使用记录
   */
  static async getUsageRecords(params?: UsageListParams): Promise<PaginatedResponse<UsageRecord>> {
    const response = (await apiClient.get<UsageRecord[]>(API_ENDPOINTS.BILLING.USAGE, {
      params: {
        page: 1,
        page_size: 50,
        ...params,
      },
    })) as PaginatedResponse<UsageRecord>

    return response
  }

  /**
   * 获取使用统计
   */
  static async getUsageStats(
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<UsageStats>> {
    const params: Record<string, string> = {}
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate

    const response = await apiClient.get<UsageStats>(API_ENDPOINTS.BILLING.STATS, {
      params,
    })
    return response
  }

  /**
   * 获取订阅信息
   */
  static async getSubscriptions(): Promise<ApiResponse<Subscription[]>> {
    const response = await apiClient.get<Subscription[]>(API_ENDPOINTS.BILLING.SUBSCRIPTIONS)
    return response
  }

  /**
   * 获取发票列表
   */
  static async getInvoices(params?: InvoiceListParams): Promise<PaginatedResponse<Invoice>> {
    const response = (await apiClient.get<Invoice[]>(API_ENDPOINTS.BILLING.INVOICES, {
      params: {
        page: 1,
        page_size: 20,
        ...params,
      },
    })) as PaginatedResponse<Invoice>

    return response
  }

  /**
   * 导出使用数据
   */
  static async exportUsageData(
    params: ExportParams
  ): Promise<ApiResponse<{ download_url: string }>> {
    const requestParams: Record<string, string> = {
      format: params.format,
    }
    if (params.start_date) requestParams.start_date = params.start_date
    if (params.end_date) requestParams.end_date = params.end_date
    if (params.api_id) requestParams.api_id = params.api_id

    const response = await apiClient.get<{ download_url: string }>(API_ENDPOINTS.BILLING.EXPORT, {
      params: requestParams,
    })
    return response
  }

  /**
   * 获取最近的交易记录
   */
  static async getRecentTransactions(limit: number = 10): Promise<PaginatedResponse<Transaction>> {
    return this.getTransactions({ page: 1, page_size: limit })
  }

  /**
   * 获取本月使用统计
   */
  static async getCurrentMonthStats(): Promise<ApiResponse<UsageStats>> {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

    return this.getUsageStats(startOfMonth, endOfMonth)
  }

  /**
   * 按API获取使用记录
   */
  static async getAPIUsage(
    apiId: string,
    params?: Omit<UsageListParams, 'api_id'>
  ): Promise<PaginatedResponse<UsageRecord>> {
    return this.getUsageRecords({
      ...params,
      api_id: apiId,
    })
  }
}

export default BillingService
