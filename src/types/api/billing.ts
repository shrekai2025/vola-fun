/**
 * 计费相关类型定义
 */

export interface AccountBalance {
  subscription_balance: number
  one_time_balance: number
  total_balance: number
  currency: string
}

export interface Transaction {
  id: string
  type: 'charge' | 'refund' | 'credit' | 'debit'
  amount: number
  currency: string
  description: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface UsageRecord {
  id: string
  api_id: string
  api_name: string
  endpoint_path: string
  method: string
  cost: number
  currency: string
  timestamp: string
  response_status: number
  response_time: number
}

export interface UsageStats {
  total_calls: number
  total_cost: number
  average_cost_per_call: number
  most_used_api: string
  period_start: string
  period_end: string
}

export interface Subscription {
  id: string
  plan_id: string
  plan_name: string
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  invoice_number: string
  amount: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  invoice_pdf?: string
  due_date: string
  created_at: string
  updated_at: string
}

export interface TransactionListParams {
  page?: number
  page_size?: number
  type?: 'charge' | 'refund' | 'credit' | 'debit'
  status?: 'pending' | 'completed' | 'failed' | 'cancelled'
  start_date?: string
  end_date?: string
}

export interface UsageListParams {
  page?: number
  page_size?: number
  api_id?: string
  start_date?: string
  end_date?: string
  method?: string
}

export interface InvoiceListParams {
  page?: number
  page_size?: number
  status?: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  start_date?: string
  end_date?: string
}

export interface ExportParams {
  format: 'csv' | 'json' | 'pdf'
  start_date?: string
  end_date?: string
  api_id?: string
}
