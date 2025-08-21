// Toast 组件定义 - 基于 react-hot-toast

"use client"

import * as React from "react"
import { Toaster as HotToaster } from "react-hot-toast"
import { useTranslation } from "@/components/providers/LanguageProvider"

// Toast 配置
const toastConfig = {
  duration: 4000,
  position: 'top-center' as const,
  style: {
    background: '#363636',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '14px',
    padding: '12px 16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  success: {
    style: {
      background: '#10b981',
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  },
  error: {
    style: {
      background: '#ef4444',
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  },
  loading: {
    style: {
      background: '#6b7280',
      color: '#fff',
    },
  },
}

// Toaster 组件
export function Toaster() {
  return (
    <HotToaster
      position={toastConfig.position}
      toastOptions={toastConfig}
    />
  )
}

// Toast 工具类
import toast from 'react-hot-toast'

// 基础toast方法 (保持兼容性)
export class Toast {
  /**
   * 显示成功消息
   */
  static success(message: string) {
    return toast.success(message)
  }

  /**
   * 显示错误消息
   */
  static error(message: string) {
    return toast.error(message)
  }

  /**
   * 显示加载消息
   */
  static loading(message: string) {
    return toast.loading(message)
  }

  /**
   * 显示普通消息
   */
  static message(message: string) {
    return toast(message)
  }

  /**
   * 关闭指定 toast
   */
  static dismiss(toastId?: string) {
    return toast.dismiss(toastId)
  }

  /**
   * 关闭所有 toast
   */
  static dismissAll() {
    return toast.dismiss()
  }
}

// 翻译感知的toast hook
export function useToast() {
  const { t } = useTranslation()
  
  return {
    /**
     * 显示网络错误
     */
    networkError: (error?: string) => {
      const message = error || t.toast.networkError
      return toast.error(message)
    },

    /**
     * 显示认证错误
     */
    authError: (error?: string) => {
      const message = error || t.toast.authError
      return toast.error(message)
    },

    /**
     * 显示登录成功
     */
    loginSuccess: () => {
      return toast.success(t.toast.loginSuccess)
    },

    /**
     * 显示注册成功
     */
    signupSuccess: () => {
      return toast.success(t.toast.signupSuccess)
    },

    /**
     * 显示登出成功
     */
    logoutSuccess: () => {
      return toast.success(t.toast.logoutSuccess)
    },

    // 基础方法
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
    message: (message: string) => toast(message),
    dismiss: (toastId?: string) => toast.dismiss(toastId),
    dismissAll: () => toast.dismiss(),
  }
}

// 导出便捷方法
export const showToast = Toast
export { toast }
export default Toast
