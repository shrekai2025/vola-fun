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
  
  // API详情页
  projectDetail: {
    backButton: string
    loading: string
    loadFailed: string
    apiNotFound: string
    retry: string
    apiDescription: string
    apiTest: string
    apiTestDescription: string
    apiKeyLabel: string
    apiKeyPlaceholder: string
    apiKeyNote: string
    testButton: string
    testing: string
    testResult: string
    statistics: string
    price: string
    responseTime: string
    totalCalls: string
    totalRevenue: string
    serviceAvailable: string
    relatedLinks: string
    viewDocs: string
    officialWebsite: string
    termsOfService: string
    healthCheck: string
    basicInfo: string
    createdAt: string
    updatedAt: string
    apiId: string
    accessPermission: string
    publicAccess: string
    privateAccess: string
    testSuccess: string
    testFailed: string
    apiKeyCopied: string
    copyFailed: string
    testCompleted: string
    copy: string
    copied: string
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
    heroText: 'The intelligent API marketplace.\nCommand a curated ecosystem of APIs with an universal key.',
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
  
  projectDetail: {
    backButton: 'Back',
    loading: 'Loading...',
    loadFailed: 'Load Failed',
    apiNotFound: 'API details not found',
    retry: 'Retry',
    apiDescription: 'API Description',
    apiTest: 'API Test',
    apiTestDescription: 'Test this API service with your API key',
    apiKeyLabel: 'API Key',
    apiKeyPlaceholder: 'Please enter your API key',
    apiKeyNote: 'Currently using test key, please replace with your real API key for production',
    testButton: 'Test API',
    testing: 'Testing...',
    testResult: 'Test Result',
    statistics: 'Statistics',
    price: 'Price',
    responseTime: 'Response Time',
    totalCalls: 'Total Calls',
    totalRevenue: 'Total Revenue',
    serviceAvailable: '✅ Service Available',
    relatedLinks: 'Related Links',
    viewDocs: 'View Documentation',
    officialWebsite: 'Official Website',
    termsOfService: 'Terms of Service',
    healthCheck: 'Health Check',
    basicInfo: 'Basic Information',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    apiId: 'API ID',
    accessPermission: 'Access Permission',
    publicAccess: 'Public',
    privateAccess: 'Private',
    testSuccess: 'API test successful',
    testFailed: 'API test failed',
    apiKeyCopied: 'API key copied to clipboard',
    copyFailed: 'Copy failed, please select and copy text manually',
    testCompleted: 'API test completed',
    copy: 'Copy',
    copied: 'Copied'
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
  
  projectDetail: {
    backButton: '返回',
    loading: '加载中...',
    loadFailed: '加载失败',
    apiNotFound: 'API详情不存在',
    retry: '重试',
    apiDescription: 'API 描述',
    apiTest: 'API 测试',
    apiTestDescription: '使用您的API密钥测试此API服务',
    apiKeyLabel: 'API 密钥',
    apiKeyPlaceholder: '请输入您的API密钥',
    apiKeyNote: '当前使用测试密钥，正式使用请替换为您的真实API密钥',
    testButton: '测试 API',
    testing: '测试中...',
    testResult: '测试结果',
    statistics: '统计信息',
    price: '价格',
    responseTime: '响应时间',
    totalCalls: '总调用次数',
    totalRevenue: '总收入',
    serviceAvailable: '✅ 服务可用',
    relatedLinks: '相关链接',
    viewDocs: '查看文档',
    officialWebsite: '官方网站',
    termsOfService: '服务条款',
    healthCheck: '健康检查',
    basicInfo: '基本信息',
    createdAt: '创建时间',
    updatedAt: '更新时间',
    apiId: 'API ID',
    accessPermission: '访问权限',
    publicAccess: '公开',
    privateAccess: '私有',
    testSuccess: 'API测试成功',
    testFailed: 'API测试失败',
    apiKeyCopied: 'API密钥已复制到剪贴板',
    copyFailed: '复制失败，请手动选择文本复制',
    testCompleted: 'API测试完成',
    copy: '复制',
    copied: '已复制'
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
