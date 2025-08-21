import type { SupportedLanguage } from './i18n'

// 翻译字典类型
export interface Translations {
  // 通用
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    confirm: string
    save: string
    edit: string
    delete: string
    close: string
  }
  
  // 导航
  nav: {
    docs: string
    pricing: string
    getStarted: string
    profile: string
    logout: string
  }
  
  // 主页
  home: {
    heroText: string
    getApiKey: string
    exploreMarket: string
    marketTitle: string
    marketSubtitle: string
    searchPlaceholder: string
    loadMore: string
    categories: {
      all: string
      ai: string
      data: string
      imageProcessing: string
      translation: string
      weather: string
      tools: string
      finance: string
      validation: string
    }
  }
  
  // Profile页面
  profile: {
    title: string
    basicInfo: string
    balanceInfo: string
    personalInfo: string
    timeInfo: string
    debugData: string
    debugDescription: string
    userId: string
    firebaseUid: string
    role: string
    status: string
    active: string
    inactive: string
    verified: string
    subscriptionBalance: string
    oneTimeBalance: string
    totalBalance: string
    bio: string
    company: string
    website: string
    location: string
    registrationTime: string
    lastUpdated: string
    language: string
    theme: string
    lightMode: string
    darkMode: string
  }
  
  // 错误信息
  errors: {
    userInfoFailed: string
    userNotFound: string
  }

  // Toast消息
  toast: {
    networkError: string
    authError: string
    loginSuccess: string
    signupSuccess: string
    logoutSuccess: string
  }
}

// 英文翻译
export const en: Translations = {
  common: {
    loading: 'Loading',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close'
  },
  
  nav: {
    docs: 'Docs',
    pricing: 'Pricing',
    getStarted: 'Get started',
    profile: 'Profile',
    logout: 'Logout'
  },
  
  home: {
    heroText: 'The intelligent API marketplace.\nCommand a curated ecosystem of APIs with a single, universal key.',
    getApiKey: 'Get API Key',
    exploreMarket: 'Explore API Market',
    marketTitle: 'API Market',
    marketSubtitle: 'Browse and discover quality API services for AI applications',
    searchPlaceholder: 'Search API services...',
    loadMore: 'Load More APIs',
    categories: {
      all: 'All',
      ai: 'AI',
      data: 'Data',
      imageProcessing: 'Image Processing',
      translation: 'Translation',
      weather: 'Weather',
      tools: 'Tools',
      finance: 'Finance',
      validation: 'Validation'
    }
  },
  
  profile: {
    title: 'User Profile',
    basicInfo: 'Basic Information',
    balanceInfo: 'Balance Information',
    personalInfo: 'Personal Information',
    timeInfo: 'Time Information',
    debugData: 'Debug Data',
    debugDescription: 'Complete API response data for development debugging',
    userId: 'User ID:',
    firebaseUid: 'Firebase UID:',
    role: 'Role:',
    status: 'Status:',
    active: 'Active',
    inactive: 'Inactive',
    verified: 'Verified',
    subscriptionBalance: 'Subscription Balance',
    oneTimeBalance: 'One-time Balance',
    totalBalance: 'Total Balance',
    bio: 'Bio:',
    company: 'Company',
    website: 'Website',
    location: 'Location',
    registrationTime: 'Registration Time:',
    lastUpdated: 'Last Updated:',
    language: 'Language',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode'
  },
  
  errors: {
    userInfoFailed: 'Failed to load user information:',
    userNotFound: 'User information not found'
  },

  toast: {
    networkError: 'Network connection failed, please check network settings',
    authError: 'Authentication failed, please log in again',
    loginSuccess: 'Login successful!',
    signupSuccess: 'Registration successful!',
    logoutSuccess: 'Safely logged out'
  }
}

// 中文翻译
export const zh: Translations = {
  common: {
    loading: '加载中',
    error: '错误',
    success: '成功',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    close: '关闭'
  },
  
  nav: {
    docs: '文档',
    pricing: '定价',
    getStarted: '开始使用',
    profile: '个人资料',
    logout: '退出登录'
  },
  
  home: {
    heroText: '智能API市场。\n通过单一通用密钥，掌控精选的API生态系统。',
    getApiKey: '获得API Key',
    exploreMarket: '探索API市场',
    marketTitle: 'API 市场',
    marketSubtitle: '浏览和发现面向AI应用的优质API服务',
    searchPlaceholder: '搜索API服务...',
    loadMore: '加载更多 API',
    categories: {
      all: '全部',
      ai: 'AI',
      data: '数据',
      imageProcessing: '图像处理',
      translation: '翻译',
      weather: '天气',
      tools: '工具',
      finance: '金融',
      validation: '验证'
    }
  },
  
  profile: {
    title: '用户资料',
    basicInfo: '基本信息',
    balanceInfo: '余额信息',
    personalInfo: '个人资料',
    timeInfo: '时间信息',
    debugData: '原始数据 (调试用)',
    debugDescription: '完整的 API 返回数据，用于开发调试',
    userId: '用户ID:',
    firebaseUid: 'Firebase UID:',
    role: '角色:',
    status: '状态:',
    active: '活跃',
    inactive: '非活跃',
    verified: '已验证',
    subscriptionBalance: '订阅余额',
    oneTimeBalance: '一次性余额',
    totalBalance: '总余额',
    bio: '简介:',
    company: '公司',
    website: '网站',
    location: '位置',
    registrationTime: '注册时间:',
    lastUpdated: '最后更新:',
    language: '语言',
    theme: '主题',
    lightMode: '明亮模式',
    darkMode: '暗色模式'
  },
  
  errors: {
    userInfoFailed: '加载用户信息时出错：',
    userNotFound: '未找到用户信息'
  },

  toast: {
    networkError: '网络连接失败，请检查网络设置',
    authError: '认证失败，请重新登录',
    loginSuccess: '登录成功！',
    signupSuccess: '注册成功！',
    logoutSuccess: '已安全退出'
  }
}

// 翻译字典
export const translations: Record<SupportedLanguage, Translations> = {
  en,
  zh
}
