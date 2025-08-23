// Firebase 认证服务

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { auth } from '@/config/firebase'
import type { AuthService, FirebaseAuthError } from '@/types/auth'

/**
 * Firebase 认证服务实现
 */
export class FirebaseAuthService implements AuthService {
  /**
   * Google 登录 - 使用弹窗模式（优先）
   */
  static async signInWithGoogle(): Promise<string> {
    try {
      const provider = new GoogleAuthProvider()
      // 在开发环境中优先尝试弹窗，失败则使用重定向
      const result = await signInWithPopup(auth, provider)
      const idToken = await result.user.getIdToken()
      return idToken
    } catch (error) {
      console.error('Google popup sign in failed, trying redirect:', error)
      // 如果弹窗失败，使用重定向模式
      throw error
    }
  }

  /**
   * Google 登录 - 使用重定向模式
   */
  static async signInWithGoogleRedirect(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithRedirect(auth, provider)
    } catch (error) {
      console.error('Google redirect sign in error:', error)
      throw error
    }
  }

  /**
   * 处理 Google 重定向结果
   */
  static async handleGoogleRedirectResult(): Promise<string | null> {
    try {
      const result = await getRedirectResult(auth)
      if (result) {
        const idToken = await result.user.getIdToken()
        return idToken
      }
      return null
    } catch (error) {
      console.error('Handle redirect result error:', error)
      throw error
    }
  }

  /**
   * 邮箱登录
   */
  static async signInWithEmail(email: string, password: string): Promise<string> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await result.user.getIdToken()
      return idToken
    } catch (error) {
      console.error('Email sign in error:', error)
      throw error
    }
  }

  /**
   * 邮箱注册
   */
  static async signUpWithEmail(email: string, password: string): Promise<string> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const idToken = await result.user.getIdToken()
      return idToken
    } catch (error) {
      console.error('Email sign up error:', error)
      throw error
    }
  }

  /**
   * 检查用户是否存在（通过尝试登录）
   */
  static async checkUserExists(email: string): Promise<'exists' | 'not-found'> {
    try {
      // 使用假密码尝试登录来检测用户是否存在
      await signInWithEmailAndPassword(auth, email, '123456789')
      // 如果没有抛出错误，说明密码正确（不太可能，但理论上可能）
      return 'exists'
    } catch (error) {
      const firebaseError = error as FirebaseAuthError

      if (firebaseError.code === 'auth/user-not-found') {
        return 'not-found'
      } else if (firebaseError.code === 'auth/wrong-password') {
        return 'exists'
      } else {
        // 其他错误，抛出让上层处理
        throw error
      }
    }
  }

  /**
   * 登出
   */
  static async signOut(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    }
  }

  /**
   * 监听认证状态变化
   */
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback)
  }

  /**
   * 获取当前用户的 ID Token
   */
  static async getCurrentUserIdToken(): Promise<string | null> {
    try {
      const user = auth.currentUser
      if (user) {
        return await user.getIdToken()
      }
      return null
    } catch (error) {
      console.error('Get current user ID token error:', error)
      return null
    }
  }

  /**
   * 获取当前用户
   */
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser
  }

  // 实现接口方法
  async signInWithGoogle(): Promise<string> {
    return FirebaseAuthService.signInWithGoogle()
  }

  async signInWithEmail(email: string, password: string): Promise<string> {
    return FirebaseAuthService.signInWithEmail(email, password)
  }

  async signUpWithEmail(email: string, password: string): Promise<string> {
    return FirebaseAuthService.signUpWithEmail(email, password)
  }

  async checkUserExists(email: string): Promise<'exists' | 'not-found'> {
    return FirebaseAuthService.checkUserExists(email)
  }

  async signOut(): Promise<void> {
    return FirebaseAuthService.signOut()
  }
}

export default FirebaseAuthService
