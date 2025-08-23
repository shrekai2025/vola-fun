import type { SupportedLanguage } from './i18n'

// 翻译字典类型
export interface Translations {
  // 通用
  common: {
    loading: string
    verifying: string
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
    usageCount: string
    noApiServices: string
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
    // 新增字段
    overview: string
    status: string
    serviceStatus: string
    activeService: string
    inactiveService: string
    deprecatedService: string
    testApiModal: string
    testApiDescription: string
    startTest: string
    testKey: string
    testKeyNote: string
    testSuccessful: string
    testResultTitle: string
    description: string
    endpoints: string
    noDescription: string
    noEndpoints: string
    loadingEndpoints: string
    endpointDescription: string
    queryParams: string
    bodyParams: string
    responseExample: string
    avgResponseTime: string
    successRate: string
    endpointStatus: string
    active: string
    inactive: string
    calls: string
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
    noDescription: string
    // Actions and labels
    totalCalls: string
    createdAt: string
    editProject: string
    viewEndpoints: string
    deleteAPI: string
    deleting: string
    // Create page
    create: {
      title: string
      description: string
      basicInfo: string
      technicalConfig: string
      relatedLinks: string
      tagsAndDocs: string
      cancel: string
      publishing: string
      publishAPI: string
      // Form labels
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
      estimatedResponseTime: string
      // Validation messages
      nameRequired: string
      nameMaxLength: string
      slugRequired: string
      slugFormat: string
      shortDescRequired: string
      shortDescMaxLength: string
      validUrl: string
      responseTimeRequired: string
      responseTimeRange: string
      // Placeholders
      slugHelper: string
      responseTimeHelper: string
      tagsHelper: string
      // Auth messages
      loginPrompt: string
      // API文档模板
      apiDocsPlaceholder: string
    }
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
    status: {
      draft: string
      published: string
      deprecated: string
      suspended: string
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
    loginPrompt: string
    
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
    // API不存在相关
    apiNotFound: string
    backToList: string
    // 错误状态相关
    generalLoadFailed: string
    endpointLoadFailed: string
    retryEndpoints: string
    refreshAndRetry: string
    firstEndpoint: string
    refreshSuccess: string
    // 基本信息和统计信息标题
    basicInfo: string
    statisticsInfo: string
    requestParams: string
    none: string
    deleting: string
    // 表单占位符
    endpointNamePlaceholder: string
    endpointPathPlaceholder: string
    endpointDescPlaceholder: string
    jsonFormatNote: string
    saving: string
    // 验证错误消息
    dataFormatError: string
  }

  // 表单验证消息
  validation: {
    required: string
    emailInvalid: string
    passwordMinLength: string
    passwordMismatch: string
    urlInvalid: string
    apiNameRequired: string
    apiNameMaxLength: string
    apiSlugRequired: string
    apiSlugFormat: string
    shortDescRequired: string
    shortDescMaxLength: string
    responseTimeRequired: string
    responseTimeRange: string
  }

  // Toast消息
  toast: {
    networkError: string
    authError: string
    loginSuccess: string
    signupSuccess: string
    logoutSuccess: string
    // API相关
    apiDeleteSuccess: string
    apiCreateSuccess: string
    apiCreateSuccessDraft: string
    apiApprovalSuccess: string
    apiSetToPublic: string
    apiSetToPrivate: string
    apiUpdateFailed: string
    // API状态切换提示
    clickToSetPrivate: string
    clickToSetPublic: string
    // 认证相关
    emailAlreadyExists: string
    passwordWeak: string
    passwordIncorrect: string
    userNotExists: string
    accountDisabled: string
    tooManyAttempts: string
    checkEmailError: string
    logoutError: string
  }

  // 确认对话框
  confirmDialog: {
    deleteAPI: string
    deleteAPIMessage: string
  }

  // Admin相关
  admin: {
    title: string
    createAPI: string
    reviewAPIs: string
    loading: string
    loadingAPIs: string
    noAPIsToReview: string
    loadFailed: string
    retry: string
    approve: string
    approving: string
    createSuccess: string
    approvalSuccess: string
    // 表单相关
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
    isPublic: string
    gatewayKey: string
    documentation: string
    tags: string
    estimatedResponseTime: string
    // Placeholder
    apiNamePlaceholder: string
    apiSlugPlaceholder: string
    shortDescPlaceholder: string
    longDescPlaceholder: string
    baseUrlPlaceholder: string
    healthUrlPlaceholder: string
    websiteUrlPlaceholder: string
    docsUrlPlaceholder: string
    termsUrlPlaceholder: string
    gatewayKeyPlaceholder: string
    tagsPlaceholder: string
    estimatedResponseTimePlaceholder: string
    addTag: string
    removeTag: string
    save: string
    cancel: string
    close: string
  }

  // 错误信息
  errors: {
    userInfoFailed: string
    userNotFound: string
    loadAPIsFailed: string
    deleteAPIFailed: string
    logoutFailed: string
  }
}

// 英文翻译
export const en: Translations = {
  common: {
    loading: 'Loading',
    verifying: 'Verifying identity...',
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
    apiMarketIntro: 'Discover and integrate powerful APIs to accelerate your development',
    usageCount: 'Called {count} times',
    noApiServices: 'No API services available'
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
    copied: 'Copied',
    // 新增字段
    overview: 'Overview',
    status: 'Status',
    serviceStatus: 'Service Status',
    activeService: 'Active',
    inactiveService: 'Inactive',
    deprecatedService: 'Deprecated',
    testApiModal: 'Test {name}',
    testApiDescription: 'Enter your API key to test this API',
    startTest: 'Start Test',
    testKey: 'API Key',
    testKeyNote: 'Your API key will be used for testing and will not be stored',
    testSuccessful: 'Test Successful',
    testResultTitle: 'Test Result',
    description: 'Description',
    endpoints: 'Endpoints',
    noDescription: 'No detailed description available',
    noEndpoints: 'No API endpoints available',
    loadingEndpoints: 'Loading endpoints...',
    endpointDescription: 'Description',
    queryParams: 'Query Parameters',
    bodyParams: 'Request Body Parameters',
    responseExample: 'Response Example',
    avgResponseTime: 'Average Response Time',
    successRate: 'Success Rate',
    endpointStatus: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    calls: 'calls'
  },

  apiProvider: {
    title: 'API Provider',
    description: 'Publish your API service and start earning service fees right away',
    createNew: 'Publish API',
    createFirst: 'Publish Your First API',
    loading: 'Loading...',
    noAPIs: 'No APIs yet',
    noAPIsDescription: 'You haven\'t published any APIs yet. Start by publishing your first API to share with the community.',
    noDescription: 'No description available',
    // Actions and labels
    totalCalls: 'Total Calls',
    createdAt: 'Created At',
    editProject: 'Edit Project',
    viewEndpoints: 'View Endpoints',
    deleteAPI: 'Delete API',
    deleting: 'Deleting...',
    // Create page
    create: {
      title: 'Publish New API',
      description: 'Publish your API to the Vola marketplace. Your API will first be saved as a draft, and you can edit and refine it at any time.',
      basicInfo: 'Basic Information',
      technicalConfig: 'Technical Configuration',
      relatedLinks: 'Related Links',
      tagsAndDocs: 'Tags and Documentation',
      cancel: 'Cancel',
      publishing: 'Publishing...',
      publishAPI: 'Publish API',
      // Form labels
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
      estimatedResponseTime: 'Estimated Response Time (ms)',
      // Validation messages
      nameRequired: 'API name cannot be empty',
      nameMaxLength: 'API name cannot exceed 255 characters',
      slugRequired: 'API slug cannot be empty',
      slugFormat: 'API slug can only contain lowercase letters, numbers and hyphens',
      shortDescRequired: 'Short description cannot be empty',
      shortDescMaxLength: 'Short description cannot exceed 100 characters',
      validUrl: 'Please enter a valid URL',
      responseTimeRequired: 'Estimated response time must be greater than 0',
      responseTimeRange: 'Estimated response time cannot exceed 10 minutes',
      // Placeholders
      slugHelper: 'Used to generate API access URL, only lowercase letters, numbers and hyphens allowed',
      responseTimeHelper: 'Expected API response time in milliseconds (optional)',
      tagsHelper: 'Tags (max 5)',
      // Auth messages
      loginPrompt: 'Please log in first to publish API',
      // API文档模板
      apiDocsPlaceholder: `# API Documentation

## Overview
Describe your API functionality...

## Authentication
Describe authentication method...

## Endpoints
### GET /endpoint
Describe endpoint usage...`
    },
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
    },
    status: {
      draft: 'Draft',
      published: 'Published',
      deprecated: 'Deprecated',
      suspended: 'Suspended'
    }
  },

  endpoints: {
    title: 'API Endpoints',
    description: 'Manage endpoints for your API',
    createNew: 'Publish New Endpoint',
    noEndpoints: 'No Endpoints',
    loading: 'Loading...',
    loadFailed: 'Load Failed',
    retry: 'Retry',
    loginPrompt: 'Please log in first to manage API endpoints',
    
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
    createSuccess: 'Endpoint published successfully',
    updateSuccess: 'Endpoint updated successfully',
    deleteSuccess: 'Endpoint deleted successfully',
    createFailed: 'Failed to publish endpoint',
    updateFailed: 'Failed to update endpoint',
    deleteFailed: 'Failed to delete endpoint',
    
    // 确认对话框
    deleteConfirmTitle: 'Delete Endpoint',
    deleteConfirmMessage: 'Are you sure you want to delete this endpoint? This action cannot be undone.',
    editConfirmTitle: 'Save Changes',
    editConfirmMessage: 'Are you sure you want to save these changes?',
    // API不存在相关
    apiNotFound: 'API not found or you do not have access',
    backToList: 'Back to List',
    // 错误状态相关
    generalLoadFailed: 'Load Failed',
    endpointLoadFailed: 'Endpoint loading failed',
    retryEndpoints: 'Retry loading endpoints',
    refreshAndRetry: 'Refresh and retry',
    firstEndpoint: 'Start creating your first API endpoint',
    refreshSuccess: 'Endpoint list refreshed',
    // 基本信息和统计信息标题
    basicInfo: 'Basic Information',
    statisticsInfo: 'Statistics',
    requestParams: 'Request Parameters',
    none: 'None',
    deleting: 'Deleting...',
    // 表单占位符
    endpointNamePlaceholder: 'Endpoint name',
    endpointPathPlaceholder: '/example/path',
    endpointDescPlaceholder: 'Endpoint description...',
    jsonFormatNote: 'Please use standard JSON format with property names in double quotes',
    saving: 'Saving...',
    // 验证错误消息
    dataFormatError: 'Endpoint data format is abnormal, this may be caused by backend data incompatibility. Please contact the administrator to check data integrity.'
  },

  validation: {
    required: 'This field is required',
    emailInvalid: 'Please enter a valid email address',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match',
    urlInvalid: 'Please enter a valid URL',
    apiNameRequired: 'API name cannot be empty',
    apiNameMaxLength: 'API name cannot exceed 255 characters',
    apiSlugRequired: 'API slug cannot be empty',
    apiSlugFormat: 'API slug can only contain lowercase letters, numbers and hyphens',
    shortDescRequired: 'Short description cannot be empty',
    shortDescMaxLength: 'Short description cannot exceed 100 characters',
    responseTimeRequired: 'Estimated response time must be greater than 0',
    responseTimeRange: 'Estimated response time cannot exceed 10 minutes'
  },

  toast: {
    networkError: 'Network connection failed, please check network settings',
    authError: 'Authentication failed, please log in again',
    loginSuccess: 'Login successful!',
    signupSuccess: 'Registration successful!',
    logoutSuccess: 'Safely logged out',
    // API related
    apiDeleteSuccess: 'API deleted successfully',
    apiCreateSuccess: 'API published successfully!',
    apiCreateSuccessDraft: 'API created successfully! API is in draft status, can be further edited.',
    apiApprovalSuccess: 'API approved successfully!',
    apiSetToPublic: 'API set to public',
    apiSetToPrivate: 'API set to private',
    apiUpdateFailed: 'Failed to update API status',
    // API状态切换提示
    clickToSetPrivate: 'Click to set as private',
    clickToSetPublic: 'Click to set as public',
    // Auth related
    emailAlreadyExists: 'This email is already registered, please use another email or try logging in',
    passwordWeak: 'Password is too weak, please choose a stronger password',
    passwordIncorrect: 'Incorrect password, please try again',
    userNotExists: 'User does not exist',
    accountDisabled: 'This account has been disabled',
    tooManyAttempts: 'Too many login attempts, please try again later',
    checkEmailError: 'Error occurred while checking email, please try again',
    logoutError: 'Logout failed, please try again'
  },

  confirmDialog: {
    deleteAPI: 'Delete API',
    deleteAPIMessage: 'Are you sure you want to delete this API? This action cannot be undone.'
  },

  admin: {
    title: 'Admin Dashboard',
    createAPI: 'Publish API',
    reviewAPIs: 'Review APIs',
    loading: 'Loading...',
    loadingAPIs: 'Loading APIs to review...',
    noAPIsToReview: 'No APIs to review',
    loadFailed: 'Load failed, please try again later',
    retry: 'Retry',
    approve: 'Approve',
    approving: 'Approving...',
    createSuccess: 'API published successfully!',
    approvalSuccess: 'API approved successfully!',
    // Form related
    apiName: 'API Name',
    apiSlug: 'API Slug',
    shortDescription: 'Short Description',
    longDescription: 'Long Description',
    category: 'Category',
    baseUrl: 'Base URL',
    healthCheckUrl: 'Health Check URL',
    websiteUrl: 'Website URL',
    documentationUrl: 'Documentation URL',
    termsUrl: 'Terms URL',
    isPublic: 'Public Access',
    gatewayKey: 'Gateway Key',
    documentation: 'Documentation',
    tags: 'Tags',
    estimatedResponseTime: 'Estimated Response Time (ms)',
    // Placeholders
    apiNamePlaceholder: 'e.g., Weather API',
    apiSlugPlaceholder: 'e.g., weather-api',
    shortDescPlaceholder: 'e.g., Provides global weather information query service',
    longDescPlaceholder: 'Detailed description of API functionality...',
    baseUrlPlaceholder: 'https://api.example.com',
    healthUrlPlaceholder: 'https://api.example.com/health',
    websiteUrlPlaceholder: 'https://example.com',
    docsUrlPlaceholder: 'https://docs.example.com',
    termsUrlPlaceholder: 'https://example.com/terms',
    gatewayKeyPlaceholder: 'Optional gateway key',
    tagsPlaceholder: 'Enter tag...',
    estimatedResponseTimePlaceholder: 'e.g., 200',
    addTag: 'Add Tag',
    removeTag: 'Remove Tag',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close'
  },
  
  errors: {
    userInfoFailed: 'Failed to load user information:',
    userNotFound: 'User information not found',
    loadAPIsFailed: 'Failed to load API list',
    deleteAPIFailed: 'Failed to delete API',
    logoutFailed: 'Logout failed'
  }
}

// 中文翻译
export const zh: Translations = {
  common: {
    loading: '加载中',
    verifying: '正在验证身份...',
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
    apiMarketIntro: '发现和集成强大的API，加速您的开发进程',
    usageCount: '已调用 {count} 次',
    noApiServices: '暂无API服务'
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
    copied: '已复制',
    // 新增字段
    overview: '概览',
    status: '状态',
    serviceStatus: '服务状态',
    activeService: '服务正常',
    inactiveService: '服务暂停',
    deprecatedService: '已弃用',
    testApiModal: '测试 {name}',
    testApiDescription: '输入您的API密钥来测试此API',
    startTest: '开始测试',
    testKey: 'API密钥',
    testKeyNote: '您的API密钥将用于测试，不会被存储',
    testSuccessful: '测试成功',
    testResultTitle: '测试结果',
    description: '描述',
    endpoints: '端点',
    noDescription: '暂无详细描述',
    noEndpoints: '暂无API端点',
    loadingEndpoints: '加载端点中...',
    endpointDescription: '描述',
    queryParams: '查询参数',
    bodyParams: '请求体参数',
    responseExample: '响应示例',
    avgResponseTime: '平均响应时间',
    successRate: '成功率',
    endpointStatus: '状态',
    active: '活跃',
    inactive: '已停用',
    calls: '次调用'
  },

  apiProvider: {
    title: 'API 提供商',
    description: '发布您的API服务，立即开始赚取服务费',
    createNew: '发布API',
    createFirst: '发布您的第一个API',
    loading: '加载中...',
    noAPIs: '暂无API',
    noAPIsDescription: '您还没有发布任何API。开始发布您的第一个API来与社区分享吧。',
    noDescription: '暂无描述',
    // Actions and labels
    totalCalls: '调用量',
    createdAt: '创建时间',
    editProject: '编辑Project',
    viewEndpoints: '查看Endpoints',
    deleteAPI: '删除API',
    deleting: '删除中...',
    // Create page
    create: {
      title: '发布新API',
      description: '发布您的API并提交到Vola市场。API将首先保存为草稿状态，您可以随时编辑和完善。',
      basicInfo: '基本信息',
      technicalConfig: '技术配置',
      relatedLinks: '相关链接',
      tagsAndDocs: '标签和文档',
      cancel: '取消',
      publishing: '发布中...',
      publishAPI: '发布 API',
      // Form labels
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
      estimatedResponseTime: '预估响应时间 (毫秒)',
      // Validation messages
      nameRequired: 'API名称不能为空',
      nameMaxLength: 'API名称不能超过255个字符',
      slugRequired: 'API标识不能为空',
      slugFormat: 'API标识只能包含小写字母、数字和连字符',
      shortDescRequired: '简短描述不能为空',
      shortDescMaxLength: '简短描述不能超过100个字符',
      validUrl: '请输入有效的URL',
      responseTimeRequired: '预估响应时间必须大于0',
      responseTimeRange: '预估响应时间不能超过10分钟',
      // Placeholders
      slugHelper: '用于生成API访问URL，只能包含小写字母、数字和连字符',
      responseTimeHelper: 'API预期响应时间，单位为毫秒（可选）',
      tagsHelper: '标签 (最多5个)',
      // Auth messages
      loginPrompt: '请先登录以发布API',
      // API文档模板
      apiDocsPlaceholder: `# API 文档

## 概述
描述您的API功能...

## 认证
描述认证方式...

## 端点
### GET /endpoint
描述端点用法...`
    },
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
    },
    status: {
      draft: '草稿',
      published: '已发布',
      deprecated: '已弃用',
      suspended: '已暂停'
    }
  },

  endpoints: {
    title: 'API 端点',
    description: '管理您的API端点',
    createNew: '发布新端点',
    noEndpoints: '暂无Endpoint',
    loading: '加载中...',
    loadFailed: '加载失败',
    retry: '重试',
    loginPrompt: '请先登录以管理API端点',
    
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
    createSuccess: '端点发布成功',
    updateSuccess: '端点更新成功',
    deleteSuccess: '端点删除成功',
    createFailed: '端点发布失败',
    updateFailed: '端点更新失败',
    deleteFailed: '端点删除失败',
    
    // 确认对话框
    deleteConfirmTitle: '删除端点',
    deleteConfirmMessage: '确定要删除此端点吗？此操作不可撤销。',
    editConfirmTitle: '保存更改',
    editConfirmMessage: '确定要保存这些更改吗？',
    // API不存在相关
    apiNotFound: 'API不存在或您没有访问权限',
    backToList: '返回列表',
    // 错误状态相关
    generalLoadFailed: '加载失败',
    endpointLoadFailed: '端点加载失败',
    retryEndpoints: '重试加载端点',
    refreshAndRetry: '刷新重试',
    firstEndpoint: '开始创建您的第一个API端点',
    refreshSuccess: '端点列表已刷新',
    // 基本信息和统计信息标题
    basicInfo: '基本信息',
    statisticsInfo: '统计信息',
    requestParams: '请求参数',
    none: '无',
    deleting: '删除中...',
    // 表单占位符
    endpointNamePlaceholder: '端点名称',
    endpointPathPlaceholder: '/example/path',
    endpointDescPlaceholder: '端点描述...',
    jsonFormatNote: '请使用标准JSON格式，属性名需用双引号',
    saving: '保存中...',
    // 验证错误消息
    dataFormatError: '端点数据格式异常，这可能是由于后端数据不兼容导致的。请联系管理员检查数据完整性。'
  },

  validation: {
    required: '此字段为必填项',
    emailInvalid: '请输入有效的邮箱地址',
    passwordMinLength: '密码至少需要6个字符',
    passwordMismatch: '密码不匹配',
    urlInvalid: '请输入有效的URL',
    apiNameRequired: 'API名称不能为空',
    apiNameMaxLength: 'API名称不能超过255个字符',
    apiSlugRequired: 'API标识不能为空',
    apiSlugFormat: 'API标识只能包含小写字母、数字和连字符',
    shortDescRequired: '简短描述不能为空',
    shortDescMaxLength: '简短描述不能超过100个字符',
    responseTimeRequired: '预估响应时间必须大于0',
    responseTimeRange: '预估响应时间不能超过10分钟'
  },

  toast: {
    networkError: '网络连接失败，请检查网络设置',
    authError: '认证失败，请重新登录',
    loginSuccess: '登录成功！',
    signupSuccess: '注册成功！',
    logoutSuccess: '已安全退出',
    // API相关
    apiDeleteSuccess: 'API删除成功',
    apiCreateSuccess: 'API发布成功！',
    apiCreateSuccessDraft: 'API发布成功！API处于草稿状态，可以进一步编辑完善。',
    apiApprovalSuccess: 'API审核通过成功!',
    apiSetToPublic: 'API已设为公开',
    apiSetToPrivate: 'API已设为私有',
    apiUpdateFailed: '更新API状态失败',
    // API状态切换提示
    clickToSetPrivate: '点击设为私有',
    clickToSetPublic: '点击设为公开',
    // 认证相关
    emailAlreadyExists: '该邮箱已被注册，请使用其他邮箱或尝试登录',
    passwordWeak: '密码强度不够，请选择更强的密码',
    passwordIncorrect: '密码错误，请重试',
    userNotExists: '用户不存在',
    accountDisabled: '该账户已被禁用',
    tooManyAttempts: '登录尝试次数过多，请稍后重试',
    checkEmailError: '检查邮箱时出现错误，请重试',
    logoutError: '登出失败，请重试'
  },

  confirmDialog: {
    deleteAPI: '删除API',
    deleteAPIMessage: '确定要删除API "{name}" 吗？此操作不可撤销。'
  },

  admin: {
    title: '管理员面板',
    createAPI: '发布API',
    reviewAPIs: '审核API',
    loading: '加载中...',
    loadingAPIs: '正在加载待审核API...',
    noAPIsToReview: '暂无需要审核的API',
    loadFailed: '加载失败，请稍后重试',
    retry: '重试',
    approve: '审核通过',
    approving: '审核中...',
    createSuccess: 'API发布成功！',
    approvalSuccess: 'API审核通过成功!',
    // 表单相关
    apiName: 'API名称',
    apiSlug: 'API标识',
    shortDescription: '简短描述',
    longDescription: '详细描述',
    category: '分类',
    baseUrl: '基础URL',
    healthCheckUrl: '健康检查URL',
    websiteUrl: '官方网站',
    documentationUrl: '文档链接',
    termsUrl: '服务条款链接',
    isPublic: '公开访问',
    gatewayKey: '网关密钥',
    documentation: '文档',
    tags: '标签',
    estimatedResponseTime: '预估响应时间 (毫秒)',
    // 占位符
    apiNamePlaceholder: '例如：天气预报API',
    apiSlugPlaceholder: '例如：weather-forecast',
    shortDescPlaceholder: '例如：提供全球天气信息查询服务',
    longDescPlaceholder: '详细描述API功能...',
    baseUrlPlaceholder: 'https://api.example.com',
    healthUrlPlaceholder: 'https://api.example.com/health',
    websiteUrlPlaceholder: 'https://example.com',
    docsUrlPlaceholder: 'https://docs.example.com',
    termsUrlPlaceholder: 'https://example.com/terms',
    gatewayKeyPlaceholder: '可选的网关密钥',
    tagsPlaceholder: '输入标签...',
    estimatedResponseTimePlaceholder: '例如：200',
    addTag: '添加标签',
    removeTag: '移除标签',
    save: '保存',
    cancel: '取消',
    close: '关闭'
  },
  
  errors: {
    userInfoFailed: '加载用户信息时出错：',
    userNotFound: '未找到用户信息',
    loadAPIsFailed: '加载用户API列表失败',
    deleteAPIFailed: '删除API失败',
    logoutFailed: '登出失败'
  }
}

// 翻译字典
export const translations: Record<SupportedLanguage, Translations> = {
  en,
  zh
}
