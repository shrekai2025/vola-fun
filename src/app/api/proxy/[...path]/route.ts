import { NextRequest, NextResponse } from 'next/server'

// 🔧 修复：确保使用正确的协议和基础URL
const API_BASE_URL = 'https://api.vola.fun' // 确保使用HTTPS

// 代理配置（移除重复的初始化日志）

// 处理所有HTTP方法
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const startTime = Date.now()
  
  try {
    // 构建目标URL - Next.js 15+ 需要 await params
    const resolvedParams = await params
    
    // 🔧 修复：正确处理尾部斜杠，避免丢失
    // 检查原始URL是否有尾部斜杠
    const originalUrl = new URL(request.url)
    const hasTrailingSlash = originalUrl.pathname.endsWith('/') && !originalUrl.pathname.endsWith('//')
    
    let path = resolvedParams.path.join('/')
    // 如果原始URL有尾部斜杠，确保保留它
    if (hasTrailingSlash && !path.endsWith('/')) {
      path += '/'
    }
    
    // 确保路径以 / 开头
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const targetUrl = `${API_BASE_URL}${cleanPath}`
    
    // 获取查询参数
    const url = new URL(request.url)
    const searchParams = url.searchParams.toString()
    const fullUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl

    console.group('🌐 [proxy] 接收到代理请求')
    console.log('🔗 原始URL:', request.url)
    console.log('📍 解析路径:', path)
    console.log('🔍 原始URL尾部斜杠:', hasTrailingSlash ? '✅有' : '❌无')
    console.log('🧹 清理路径:', cleanPath)
    console.log('🎯 目标URL:', fullUrl)
    console.log('🔧 方法:', request.method)
    console.log('⏰ 请求时间:', new Date().toISOString())
    console.log('🌍 API基础URL:', API_BASE_URL)
    
    // 🔧 URL验证 - 确保不会导致重定向
    try {
      const parsedUrl = new URL(fullUrl)
      console.log('✅ URL验证通过:')
      console.log('  协议:', parsedUrl.protocol)
      console.log('  主机:', parsedUrl.host)
      console.log('  路径:', parsedUrl.pathname)
      
      // 检查可能导致重定向的问题
      if (parsedUrl.protocol === 'http:') {
        console.warn('⚠️ 使用HTTP协议，可能导致HTTPS重定向')
      }
      if (parsedUrl.pathname.endsWith('/') && !cleanPath.endsWith('/')) {
        console.warn('⚠️ URL自动添加了尾部斜杠，可能导致重定向')
      }
    } catch (urlError) {
      console.error('❌ URL格式错误:', urlError)
    }
    
    // 构建请求头，过滤掉不需要的头部
    const headers: HeadersInit = {}
    const skipHeaders = ['host', 'connection', 'content-length', 'content-encoding']
    
    console.log('📋 原始请求头:')
    let hasContentType = false
    request.headers.forEach((value, key) => {
      console.log(`  ${key}: ${key.toLowerCase().includes('authorization') ? value.substring(0, 20) + '...' : value}`)
      if (!skipHeaders.includes(key.toLowerCase())) {
        headers[key] = value
        if (key.toLowerCase() === 'content-type') {
          hasContentType = true
        }
      }
    })
    
    // 如果是POST/PUT/PATCH请求但没有Content-Type，添加默认的
    if (['POST', 'PUT', 'PATCH'].includes(request.method) && !hasContentType) {
      headers['Content-Type'] = 'application/json'
      console.log('📝 [proxy] 添加默认Content-Type: application/json')
    }

    // 移除CORS头部（这些是给浏览器的，不应该发送到后端）
    console.log('📤 转发请求头 (到后端):')
    Object.entries(headers).forEach(([key, value]) => {
      console.log(`  ${key}: ${typeof value === 'string' && key.toLowerCase().includes('authorization') ? value.substring(0, 20) + '...' : value}`)
    })
    
    // 🔍 CORS预检请求详细处理
    if (request.method === 'OPTIONS') {
      console.group('✈️ [proxy] 处理CORS预检请求 (OPTIONS)')
      console.log('🌐 这是浏览器发起的预检请求，用于检查跨域策略')
      console.log('📋 预检请求头:')
      request.headers.forEach((value, key) => {
        if (key.toLowerCase().startsWith('access-control-request-')) {
          console.log(`  ${key}: ${value}`)
        }
      })
      
      const requestMethod = request.headers.get('access-control-request-method')
      const requestHeaders = request.headers.get('access-control-request-headers')
      
      console.log('🎯 浏览器要求的方法:', requestMethod)
      console.log('🎯 浏览器要求的头部:', requestHeaders)
      
      if (requestMethod === 'POST') {
        console.log('✅ 预检请求确认要使用POST方法')
      } else if (requestMethod) {
        console.warn('⚠️  预检请求要求的方法不是POST:', requestMethod)
      }
      
      console.log('📤 返回CORS响应头')
      console.groupEnd()
      console.groupEnd()
      
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-vola-key, x-vola-gateway',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    // 准备请求body
    let body: string | null = null
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      body = await request.text()
      console.log('📦 请求体长度:', body.length, '字符')
      console.log('📦 请求体内容:')
      console.log(body)
      // 尝试解析并美化JSON
      try {
        const jsonBody = JSON.parse(body)
        console.log('📦 请求体 (格式化JSON):')
        console.log(JSON.stringify(jsonBody, null, 2))
      } catch (e) {
        console.log('📦 请求体不是JSON格式')
      }
      
      // 检查body是否为空
      if (!body || body.length === 0) {
        console.warn('⚠️ [proxy] POST/PUT/PATCH请求但body为空！')
      }
    } else {
      console.log('📦 无请求体 (方法:', request.method + ')')
    }
    
    console.groupEnd()

    // 构建fetch配置
    const fetchConfig: RequestInit = {
      method: request.method,
      headers,
    }
    
    // 只在有body内容时才添加body
    if (body && body.length > 0) {
      fetchConfig.body = body
    }
    
    console.log('🚀 [proxy] 开始转发请求到后端')
    console.log('🔧 [proxy] 转发方法:', request.method)
    console.log('🔧 [proxy] 转发URL:', fullUrl)
    console.log('🔧 [proxy] 转发配置:', {
      method: fetchConfig.method,
      hasBody: !!fetchConfig.body,
      bodyLength: fetchConfig.body ? (typeof fetchConfig.body === 'string' ? fetchConfig.body.length : 'N/A') : 0
    })
    
    // 最终验证 - 确保方法没有被意外改变
    if (fetchConfig.method !== request.method) {
      console.error('🚨 [proxy] 严重错误：HTTP方法被意外改变！')
      console.error('  原始方法:', request.method)
      console.error('  fetch配置中的方法:', fetchConfig.method)
      throw new Error(`HTTP method mismatch: ${request.method} -> ${fetchConfig.method}`)
    }
    
    // 对于POST请求的额外验证
    if (request.method === 'POST') {
      console.log('✅ [proxy] POST请求验证:')
      console.log('  ✓ 方法确认: POST')
      console.log('  ✓ URL确认:', fullUrl)
      console.log('  ✓ Content-Type:', headers['content-type'] || headers['Content-Type'] || '未设置')
      console.log('  ✓ Authorization:', headers['authorization'] || headers['Authorization'] ? '已设置' : '未设置')
      console.log('  ✓ Body长度:', fetchConfig.body ? (typeof fetchConfig.body === 'string' ? fetchConfig.body.length : 'N/A') : 0, '字符')
    }
    
    const fetchStartTime = Date.now()
    
    // 发起代理请求
    console.log('📡 [proxy] 即将发送到:', API_BASE_URL)
    console.log('📡 [proxy] 完整请求详情:', {
      url: fullUrl,
      method: fetchConfig.method,
      headers: Object.keys(fetchConfig.headers || {}),
      hasBody: !!fetchConfig.body
    })
    
    let response
    try {
      response = await fetch(fullUrl, fetchConfig)
      
      // 立即检查响应状态
      console.log('📊 [proxy] 后端立即响应:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        redirected: response.redirected,
        url: response.url
      })
      
      // 如果是4xx或5xx错误，可能表明请求方法问题
      if (response.status === 405) {
        console.error('🚨 [proxy] HTTP 405 Method Not Allowed - 这可能意味着:')
        console.error('  1. 后端不接受', request.method, '方法')
        console.error('  2. 请求被错误地转换为GET')
        console.error('  3. 后端路由配置问题')
      } else if (response.status === 404) {
        console.error('🚨 [proxy] HTTP 404 Not Found - 检查URL路径:')
        console.error('  目标路径:', path)
        console.error('  完整URL:', fullUrl)
      }
      
    } catch (fetchError) {
      console.error('💥 [proxy] Fetch请求失败:', fetchError)
      console.error('  错误类型:', fetchError instanceof Error ? fetchError.constructor.name : typeof fetchError)
      console.error('  错误消息:', fetchError instanceof Error ? fetchError.message : String(fetchError))
      console.error('  目标URL:', fullUrl)
      
      // 重新抛出错误以便上层处理
      throw fetchError
    }
    
    const fetchEndTime = Date.now()
    
    // 🔍 重定向检测（已修复，应该不再有重定向）
    if (response.redirected) {
      console.group('⚠️ [proxy] 仍然检测到重定向!')
      console.warn('这表明URL修复可能不完整')
      console.warn('  原始URL:', fullUrl)
      console.warn('  重定向到:', response.url)
      console.warn('  原始方法:', request.method)
      console.warn('  状态码:', response.status)
      
      // 分析可能的重定向原因
      const originalUrl = new URL(fullUrl)
      const redirectUrl = new URL(response.url)
      
      if (originalUrl.protocol !== redirectUrl.protocol) {
        console.error('  🔍 重定向原因：协议变化', originalUrl.protocol, '→', redirectUrl.protocol)
      }
      if (originalUrl.host !== redirectUrl.host) {
        console.error('  🔍 重定向原因：主机变化', originalUrl.host, '→', redirectUrl.host)
      }
      if (originalUrl.pathname !== redirectUrl.pathname) {
        console.error('  🔍 重定向原因：路径变化')
        console.error('    原始路径:', originalUrl.pathname)
        console.error('    重定向路径:', redirectUrl.pathname)
        
        // 检查是否是缺少尾部斜杠的问题
        if (originalUrl.pathname + '/' === redirectUrl.pathname) {
          console.error('  💡 解决方案：原始URL缺少尾部斜杠，请在API调用中添加/')
        } else if (originalUrl.pathname === redirectUrl.pathname + '/') {
          console.error('  💡 解决方案：原始URL多了尾部斜杠，请移除/')
        }
      }
      console.groupEnd()
    } else {
      console.log('✅ [proxy] 无重定向 - URL修复成功!')
    }
    
    // 检查特定的重定向状态码
    if ([301, 302, 307, 308].includes(response.status)) {
      console.error('🚨 [proxy] 检测到重定向状态码:', response.status)
      console.error('  301/302: 浏览器会将POST改为GET')
      console.error('  307/308: 应该保持原方法，但需要检查实际行为')
      
      const locationHeader = response.headers.get('location')
      if (locationHeader) {
        console.error('  Location头:', locationHeader)
      }
    }
    
    // 验证响应
    console.log('🔍 [proxy] 响应验证:')
    console.log('  最终URL:', response.url)
    console.log('  是否重定向:', response.redirected)
    console.log('  响应类型:', response.type)
    console.log('  原始方法确认:', request.method)
    
    console.log(`⏱️ [proxy] 后端响应时间: ${fetchEndTime - fetchStartTime}ms`)

    // 获取响应数据
    const responseData = await response.text()
    const totalTime = Date.now() - startTime
    
    console.group('📥 [proxy] 后端响应')
    console.log('📊 响应状态:', response.status, response.statusText)
    console.log('📋 响应头:')
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`)
    })
    console.log('📦 响应数据:')
    console.log(responseData)
    
    // 尝试解析并美化JSON响应
    try {
      const jsonResponse = JSON.parse(responseData)
      console.log('📦 响应数据 (格式化JSON):')
      console.log(JSON.stringify(jsonResponse, null, 2))
    } catch (e) {
      console.log('📦 响应数据不是JSON格式')
    }
    
    console.log(`⏱️ 总处理时间: ${totalTime}ms`)
    console.groupEnd()
    
    // 构建响应头
    const responseHeaders = new Headers()
    
    // 复制原始响应头（除了某些特殊头部）
    const skipResponseHeaders = ['content-encoding', 'transfer-encoding', 'connection']
    response.headers.forEach((value, key) => {
      if (!skipResponseHeaders.includes(key.toLowerCase())) {
        responseHeaders.set(key, value)
      }
    })

    // 设置CORS头部
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-vola-key, x-vola-gateway')

    console.log('✅ [proxy] 成功转发响应到前端')
    
    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })

  } catch (error) {
    const totalTime = Date.now() - startTime
    
    console.group('💥 [proxy] 代理请求失败')
    console.error('错误对象:', error)
    console.error('错误类型:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('错误消息:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.stack) {
      console.error('错误堆栈:', error.stack)
    }
    console.error(`⏱️ 失败前耗时: ${totalTime}ms`)
    console.error('⏰ 失败时间:', new Date().toISOString())
    
    // 如果是 fetch 相关的错误，记录更多详细信息
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('🌐 可能的网络连接问题或CORS问题')
      console.error('🎯 尝试访问的URL可能无法访问:', API_BASE_URL)
    }
    
    console.groupEnd()
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Proxy request failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        duration: totalTime
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-vola-key, x-vola-gateway',
        }
      }
    )
  }
}

// 导出所有HTTP方法处理器
export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
export const OPTIONS = handler
