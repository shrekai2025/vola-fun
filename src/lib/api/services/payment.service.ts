import type {
  ApiResponse,
  CreateStripeCheckoutData,
  CreateStripeIntentData,
  HelTransaction,
  Payment,
  PaymentPlan,
  PaymentUserInfo,
  StripeCheckoutResponse,
  StripeIntentResponse,
} from '@/types/api'
import { apiClient } from '../client'
import { API_ENDPOINTS } from '../config'

export type {
  CreateStripeCheckoutData,
  CreateStripeIntentData,
  HelTransaction,
  Payment,
  PaymentPlan,
  PaymentUserInfo,
  StripeCheckoutResponse,
  StripeIntentResponse,
}

export class PaymentService {
  /**
   * 获取支付计划列表
   */
  static async getPlans(): Promise<ApiResponse<PaymentPlan[]>> {
    const response = await apiClient.get<PaymentPlan[]>(API_ENDPOINTS.PAYMENTS.PLANS)
    return response
  }

  /**
   * 获取用户支付信息
   */
  static async getPaymentInfo(): Promise<ApiResponse<PaymentUserInfo>> {
    const response = await apiClient.get<PaymentUserInfo>(API_ENDPOINTS.PAYMENTS.INFO)
    return response
  }

  /**
   * 获取支付详情
   */
  static async getPaymentDetail(paymentId: string): Promise<ApiResponse<Payment>> {
    const response = await apiClient.get<Payment>(API_ENDPOINTS.PAYMENTS.DETAIL(paymentId))
    return response
  }

  /**
   * 创建Stripe支付意向
   */
  static async createStripeIntent(
    data: CreateStripeIntentData
  ): Promise<ApiResponse<StripeIntentResponse>> {
    const response = await apiClient.post<StripeIntentResponse>(
      API_ENDPOINTS.PAYMENTS.STRIPE.CREATE_INTENT,
      {
        amount: data.amount,
        currency: data.currency || 'usd',
        description: data.description,
        metadata: data.metadata,
      }
    )
    return response
  }

  /**
   * 创建Stripe Checkout会话
   */
  static async createStripeCheckout(
    data: CreateStripeCheckoutData
  ): Promise<ApiResponse<StripeCheckoutResponse>> {
    const response = await apiClient.post<StripeCheckoutResponse>(
      API_ENDPOINTS.PAYMENTS.STRIPE.CREATE_CHECKOUT,
      data
    )
    return response
  }

  /**
   * 查询Hel支付交易
   */
  static async getHelTransaction(signature: string): Promise<ApiResponse<HelTransaction>> {
    const response = await apiClient.get<HelTransaction>(
      API_ENDPOINTS.PAYMENTS.HEL.TRANSACTION(signature)
    )
    return response
  }

  /**
   * 获取活跃支付计划
   */
  static async getActivePlans(): Promise<ApiResponse<PaymentPlan[]>> {
    const response = await this.getPlans()
    if (response.success) {
      // 可以添加过滤逻辑，比如只返回活跃的计划
      return response
    }
    return response
  }

  /**
   * 获取热门计划
   */
  static async getPopularPlan(): Promise<ApiResponse<PaymentPlan | null>> {
    const response = await this.getPlans()
    if (response.success) {
      const popularPlan = response.data.find((plan) => plan.is_popular)
      return {
        ...response,
        data: popularPlan || null,
      }
    }
    return {
      ...response,
      data: null,
    }
  }

  /**
   * 根据价格区间获取计划
   */
  static async getPlansByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<ApiResponse<PaymentPlan[]>> {
    const response = await this.getPlans()
    if (response.success) {
      const filteredPlans = response.data.filter(
        (plan) => plan.price >= minPrice && plan.price <= maxPrice
      )
      return {
        ...response,
        data: filteredPlans,
      }
    }
    return response
  }

  /**
   * 创建订阅支付（Stripe Checkout）
   */
  static async createSubscriptionPayment(
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<ApiResponse<StripeCheckoutResponse>> {
    return this.createStripeCheckout({
      plan_id: planId,
      success_url: successUrl,
      cancel_url: cancelUrl,
    })
  }

  /**
   * 创建一次性支付（Stripe Intent）
   */
  static async createOneTimePayment(
    amount: number,
    description: string,
    metadata?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  ): Promise<ApiResponse<StripeIntentResponse>> {
    return this.createStripeIntent({
      amount,
      description,
      metadata,
    })
  }
}

export default PaymentService
