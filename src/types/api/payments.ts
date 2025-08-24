/**
 * 支付相关类型定义
 */

export interface PaymentPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  is_popular: boolean
  stripe_price_id?: string
}

export interface PaymentInfo {
  user_id: string
  stripe_customer_id?: string
  default_payment_method?: string
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due'
  current_plan?: PaymentPlan
  next_billing_date?: string
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  payment_method: 'stripe' | 'hel'
  payment_intent_id?: string
  transaction_id?: string
  description: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface CreateStripeIntentData {
  amount: number
  currency?: string
  description?: string
  metadata?: Record<string, unknown>
}

export interface StripeIntentResponse {
  client_secret: string
  payment_intent_id: string
}

export interface CreateStripeCheckoutData {
  plan_id: string
  success_url: string
  cancel_url: string
  metadata?: Record<string, unknown>
}

export interface StripeCheckoutResponse {
  checkout_url: string
  session_id: string
}

export interface HelTransaction {
  signature: string
  status: 'pending' | 'confirmed' | 'failed'
  amount: number
  currency: string
  from_address: string
  to_address: string
  block_hash?: string
  transaction_hash: string
  confirmations: number
  created_at: string
  updated_at: string
}
