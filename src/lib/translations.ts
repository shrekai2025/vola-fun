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
  
  // Footer
  footer: {
    description: string
    product: {
      title: string
      apiMarket: string
      documentation: string
    }
    connect: {
      title: string
      twitter: string
      email: string
      github: string
      wechat: string
    }
    language: {
      title: string
      english: string
      chinese: string
    }
    pricing: string
    privacy: string
    terms: string
    copyright: string
    allRightsReserved: string
    theme: string
  }
  
  // 导航
  nav: {
    docs: string
    pricing: string
    getStarted: string
    profile: string
    logout: string
    apiProvider: string
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
    sorting: {
      popularity: string
      latest: string
    }
    viewDetails: string
    totalCount: string
    apiMarketIntro: string
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

  // API提供商页面
  apiProvider: {
    title: string
    description: string
    createNew: string
    createFirst: string
    loading: string
    noAPIs: string
    noAPIsDescription: string
    edit: {
      title: string
      backToList: string
      basicInfo: string
      technicalConfig: string
      relatedLinks: string
      tagsAndDocs: string
      saveChanges: string
      cancel: string
      saving: string
      // Form fields
      apiName: string
      apiSlug: string
      shortDescription: string
      longDescription: string
      category: string
      baseUrl: string
      healthCheckUrl: string
      websiteUrl: string
      documentationUrl: string
      termsUrl: string
      tags: string
      apiDocs: string
      // Validation messages
      nameRequired: string
      nameMaxLength: string
      slugRequired: string
      slugFormat: string
      shortDescRequired: string
      shortDescMaxLength: string
      validUrl: string
      // Form placeholders
      namePlaceholder: string
      slugPlaceholder: string
      slugHelper: string
      shortDescPlaceholder: string
      longDescPlaceholder: string
      baseUrlPlaceholder: string
      healthUrlPlaceholder: string
      websiteUrlPlaceholder: string
      docsUrlPlaceholder: string
      termsUrlPlaceholder: string
      tagsPlaceholder: string
      tagsMaxHelper: string
      docsPlaceholder: string
      // Status
      draft: string
      published: string
      editingNote: string
      // Loading states
      loadingAPI: string
      notFound: string
      noAccess: string
    }
    categories: {
      data: string
      ai_ml: string
      finance: string
      social: string
      tools: string
      communication: string
      entertainment: string
      business: string
      other: string
    }
  }

  // API端点管理页面
  endpoints: {
    title: string
    description: string
    createNew: string
    noEndpoints: string
    loading: string
    loadFailed: string
    retry: string
    
    // 端点信息
    endpointName: string
    path: string
    method: string
    endpointDescription: string
    type: string
    
    // 统计信息
    totalCalls: string
    successRate: string
    avgResponseTime: string
    pricePerCall: string
    
    // 操作按钮
    edit: string
    delete: string
    save: string
    cancel: string
    confirm: string
    
    // 表单字段
    nameLabel: string
    descriptionLabel: string
    pathLabel: string
    methodLabel: string
    typeLabel: string
    headersLabel: string
    queryParamsLabel: string
    bodyParamsLabel: string
    responseBodyLabel: string
    priceLabel: string
    
    // 状态和消息
    active: string
    inactive: string
    createSuccess: string
    updateSuccess: string
    deleteSuccess: string
    createFailed: string
    updateFailed: string
    deleteFailed: string
    
    // 确认对话框
    deleteConfirmTitle: string
    deleteConfirmMessage: string
    editConfirmTitle: string
    editConfirmMessage: string
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
  
  footer: {
    description: 'The intelligent API marketplace. Command a curated ecosystem of APIs with a universal key.',
    product: {
      title: 'Product',
      apiMarket: 'API Market',
      documentation: 'Documentation'
    },
    connect: {
      title: 'Connect',
      twitter: 'Twitter/X',
      email: 'Email',
      github: 'GitHub',
      wechat: 'WeChat'
    },
    language: {
      title: 'Language',
      english: 'English',
      chinese: '简体中文'
    },
    pricing: 'Pricing',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    copyright: '© 2025 VOLA.',
    allRightsReserved: 'All rights reserved.',
    theme: 'Theme'
  },
  
  nav: {
    docs: 'Docs',
    pricing: 'Pricing',
    getStarted: 'Get started',
    profile: 'Profile',
    logout: 'Logout',
    apiProvider: 'API Provider'
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
    },
    sorting: {
      popularity: 'Popular',
      latest: 'Latest'
    },
    viewDetails: 'View Details',
    totalCount: 'Showing all {count} API services',
    apiMarketIntro: 'Discover and integrate powerful APIs to accelerate your development'
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

  apiProvider: {
    title: 'API Provider',
    description: 'Manage and publish your API services to the Vola marketplace',
    createNew: 'Create New API',
    createFirst: 'Create Your First API',
    loading: 'Loading...',
    noAPIs: 'No APIs yet',
    noAPIsDescription: 'You haven\'t created any APIs yet. Start by creating your first API to share with the community.',
    edit: {
      title: 'Edit API',
      backToList: 'Back to List',
      basicInfo: 'Basic Information',
      technicalConfig: 'Technical Configuration',
      relatedLinks: 'Related Links',
      tagsAndDocs: 'Tags and Documentation',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      saving: 'Saving...',
      // Form fields
      apiName: 'API Name',
      apiSlug: 'API Slug',
      shortDescription: 'Short Description',
      longDescription: 'Detailed Description',
      category: 'API Category',
      baseUrl: 'Base URL',
      healthCheckUrl: 'Health Check URL',
      websiteUrl: 'Official Website',
      documentationUrl: 'Documentation Link',
      termsUrl: 'Terms of Service Link',
      tags: 'Tags (max 5)',
      apiDocs: 'API Documentation (Markdown)',
      // Validation messages
      nameRequired: 'API name cannot be empty',
      nameMaxLength: 'API name cannot exceed 255 characters',
      slugRequired: 'API slug cannot be empty',
      slugFormat: 'API slug can only contain lowercase letters, numbers and hyphens',
      shortDescRequired: 'Short description cannot be empty',
      shortDescMaxLength: 'Short description cannot exceed 100 characters',
      validUrl: 'Please enter a valid URL',
      // Form placeholders
      namePlaceholder: 'e.g., Weather Forecast API',
      slugPlaceholder: 'e.g., weather-forecast',
      slugHelper: 'Used to generate API access URL, only lowercase letters, numbers and hyphens allowed',
      shortDescPlaceholder: 'Briefly describe your API functionality...',
      longDescPlaceholder: 'Detailed introduction of your API functionality, use cases, etc...',
      baseUrlPlaceholder: 'https://api.example.com',
      healthUrlPlaceholder: 'https://api.example.com/health',
      websiteUrlPlaceholder: 'https://example.com',
      docsUrlPlaceholder: 'https://docs.example.com',
      termsUrlPlaceholder: 'https://example.com/terms',
      tagsPlaceholder: 'Enter tag...',
      tagsMaxHelper: 'Tags (max 5)',
      docsPlaceholder: `# API Documentation

## Overview
Describe your API functionality...

## Authentication
Describe authentication method...

## Endpoints
### GET /endpoint
Describe endpoint usage...`,
      // Status
      draft: 'Draft',
      published: 'Published',
      editingNote: 'Edit your API information. After saving, if the API is in draft status, it will remain in draft status.',
      // Loading states
      loadingAPI: 'Loading API information...',
      notFound: 'API not found or you do not have access',
      noAccess: 'Back to List'
    },
    categories: {
      data: 'Data',
      ai_ml: 'AI/ML',
      finance: 'Finance',
      social: 'Social',
      tools: 'Tools',
      communication: 'Communication',
      entertainment: 'Entertainment',
      business: 'Business',
      other: 'Other'
    }
  },

  endpoints: {
    title: 'API Endpoints',
    description: 'Manage endpoints for your API',
    createNew: 'Create New Endpoint',
    noEndpoints: 'No Endpoints',
    loading: 'Loading...',
    loadFailed: 'Load Failed',
    retry: 'Retry',
    
    // 端点信息
    endpointName: 'Endpoint Name',
    path: 'Path',
    method: 'Method',
    endpointDescription: 'Description',
    type: 'Type',
    
    // 统计信息
    totalCalls: 'Total Calls',
    successRate: 'Success Rate',
    avgResponseTime: 'Avg Response Time',
    pricePerCall: 'Price per Call',
    
    // 操作按钮
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    
    // 表单字段
    nameLabel: 'Name',
    descriptionLabel: 'Description', 
    pathLabel: 'Path',
    methodLabel: 'HTTP Method',
    typeLabel: 'Type',
    headersLabel: 'Headers',
    queryParamsLabel: 'Query Parameters',
    bodyParamsLabel: 'Body Parameters',
    responseBodyLabel: 'Response Body',
    priceLabel: 'Price per Call',
    
    // 状态和消息
    active: 'Active',
    inactive: 'Inactive',
    createSuccess: 'Endpoint created successfully',
    updateSuccess: 'Endpoint updated successfully',
    deleteSuccess: 'Endpoint deleted successfully',
    createFailed: 'Failed to create endpoint',
    updateFailed: 'Failed to update endpoint',
    deleteFailed: 'Failed to delete endpoint',
    
    // 确认对话框
    deleteConfirmTitle: 'Delete Endpoint',
    deleteConfirmMessage: 'Are you sure you want to delete this endpoint? This action cannot be undone.',
    editConfirmTitle: 'Save Changes',
    editConfirmMessage: 'Are you sure you want to save these changes?'
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
  
  footer: {
    description: '智能API市场。通过单一通用密钥，掌控精选的API生态系统。',
    product: {
      title: '产品',
      apiMarket: 'API市场',
      documentation: '文档'
    },
    connect: {
      title: '联系我们',
      twitter: 'Twitter/X',
      email: '邮箱',
      github: 'GitHub',
      wechat: '微信'
    },
    language: {
      title: '语言',
      english: 'English',
      chinese: '简体中文'
    },
    pricing: '定价',
    privacy: '隐私政策',
    terms: '服务条款',
    copyright: '© 2025 VOLA',
    allRightsReserved: '保留所有权利。',
    theme: '主题'
  },
  
  nav: {
    docs: '文档',
    pricing: '定价',
    getStarted: '开始使用',
    profile: '个人资料',
    logout: '退出登录',
    apiProvider: 'API 提供商'
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
    },
    sorting: {
      popularity: '热门度',
      latest: '最新'
    },
    viewDetails: '查看详情',
    totalCount: '已显示全部 {count} 个API服务',
    apiMarketIntro: '发现和集成强大的API，加速您的开发进程'
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

  apiProvider: {
    title: 'API 提供商',
    description: '管理并发布您的API服务到Vola市场',
    createNew: '创建新API',
    createFirst: '创建您的第一个API',
    loading: '加载中...',
    noAPIs: '暂无API',
    noAPIsDescription: '您还没有创建任何API。开始创建您的第一个API来与社区分享吧。',
    edit: {
      title: '编辑API',
      backToList: '返回列表',
      basicInfo: '基本信息',
      technicalConfig: '技术配置',
      relatedLinks: '相关链接',
      tagsAndDocs: '标签和文档',
      saveChanges: '保存更改',
      cancel: '取消',
      saving: '保存中...',
      // Form fields
      apiName: 'API 名称',
      apiSlug: 'API 标识 (slug)',
      shortDescription: '简短描述',
      longDescription: '详细描述',
      category: 'API 分类',
      baseUrl: '基础 URL',
      healthCheckUrl: '健康检查 URL',
      websiteUrl: '官方网站',
      documentationUrl: '文档链接',
      termsUrl: '服务条款链接',
      tags: '标签 (最多5个)',
      apiDocs: 'API 文档 (Markdown)',
      // Validation messages
      nameRequired: 'API名称不能为空',
      nameMaxLength: 'API名称不能超过255个字符',
      slugRequired: 'API标识不能为空',
      slugFormat: 'API标识只能包含小写字母、数字和连字符',
      shortDescRequired: '简短描述不能为空',
      shortDescMaxLength: '简短描述不能超过100个字符',
      validUrl: '请输入有效的URL',
      // Form placeholders
      namePlaceholder: '例如：天气预报API',
      slugPlaceholder: '例如：weather-forecast',
      slugHelper: '用于生成API访问URL，只能包含小写字母、数字和连字符',
      shortDescPlaceholder: '简要描述您的API功能...',
      longDescPlaceholder: '详细介绍您的API功能、使用场景等...',
      baseUrlPlaceholder: 'https://api.example.com',
      healthUrlPlaceholder: 'https://api.example.com/health',
      websiteUrlPlaceholder: 'https://example.com',
      docsUrlPlaceholder: 'https://docs.example.com',
      termsUrlPlaceholder: 'https://example.com/terms',
      tagsPlaceholder: '输入标签...',
      tagsMaxHelper: '标签 (最多5个)',
      docsPlaceholder: `# API 文档

## 概述
描述您的API功能...

## 认证
描述认证方式...

## 端点
### GET /endpoint
描述端点用法...`,
      // Status
      draft: '草稿',
      published: '已发布',
      editingNote: '编辑您的API信息。保存后，如果是草稿状态的API将继续保持草稿状态。',
      // Loading states
      loadingAPI: '加载API信息中...',
      notFound: 'API不存在或您没有访问权限',
      noAccess: '返回列表'
    },
    categories: {
      data: '数据',
      ai_ml: 'AI/机器学习',
      finance: '金融',
      social: '社交',
      tools: '工具',
      communication: '通信',
      entertainment: '娱乐',
      business: '商业',
      other: '其他'
    }
  },

  endpoints: {
    title: 'API 端点',
    description: '管理您的API端点',
    createNew: '创建新端点',
    noEndpoints: '暂无Endpoint',
    loading: '加载中...',
    loadFailed: '加载失败',
    retry: '重试',
    
    // 端点信息
    endpointName: '端点名称',
    path: '路径',
    method: '方法',
    endpointDescription: '描述',
    type: '类型',
    
    // 统计信息
    totalCalls: '总调用量',
    successRate: '成功率',
    avgResponseTime: '平均响应时间',
    pricePerCall: '每次调用价格',
    
    // 操作按钮
    edit: '编辑',
    delete: '删除',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    
    // 表单字段
    nameLabel: '名称',
    descriptionLabel: '描述',
    pathLabel: '路径',
    methodLabel: 'HTTP方法',
    typeLabel: '类型',
    headersLabel: '请求头',
    queryParamsLabel: '查询参数',
    bodyParamsLabel: '请求体参数',
    responseBodyLabel: '响应体',
    priceLabel: '每次调用价格',
    
    // 状态和消息
    active: '激活',
    inactive: '未激活',
    createSuccess: '端点创建成功',
    updateSuccess: '端点更新成功',
    deleteSuccess: '端点删除成功',
    createFailed: '端点创建失败',
    updateFailed: '端点更新失败',
    deleteFailed: '端点删除失败',
    
    // 确认对话框
    deleteConfirmTitle: '删除端点',
    deleteConfirmMessage: '确定要删除此端点吗？此操作不可撤销。',
    editConfirmTitle: '保存更改',
    editConfirmMessage: '确定要保存这些更改吗？'
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
