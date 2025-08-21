// Firebase 配置和初始化

import { initializeApp, getApps } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getAnalytics, Analytics } from 'firebase/analytics'

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyBKU7M3aZNtd0cjRF7-H86dhyP4w1_8oOY",
  authDomain: "vola-fun-f6ff8.firebaseapp.com",
  projectId: "vola-fun-f6ff8",
  storageBucket: "vola-fun-f6ff8.firebasestorage.app",
  messagingSenderId: "924230806239",
  appId: "1:924230806239:web:1cd3ac8b40b7d01b1d976a",
  measurementId: "G-PZLK1D0E0K"
}

// 初始化 Firebase（避免重复初始化）
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// 初始化 Firebase Auth
export const auth: Auth = getAuth(app)

// 初始化 Firebase Analytics（仅在客户端）
export let analytics: Analytics | null = null
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

export default app
