import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://api.vola.fun'

// 处理所有HTTP方法
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const startTime = Date.now()
  
  try {
    // 构建目标URL - Next.js 15+ 需要 await params
    const resolvedParams = await params
    const path = resolvedParams.path.join('/')
    const targetUrl = `${API_BASE_URL}/${path}`
    
    // 获取查询参数
    const url = new URL(request.url)
    const searchParams = url.searchParams.toString()
    const fullUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl

    console.group('🌐 [proxy] 接收到代理请求')
    console.log('🔗 原始URL:', request.url)
    console.log('🎯 目标URL:', fullUrl)
    console.log('🔧 方法:', request.method)
    console.log('⏰ 请求时间:', new Date().toISOString())
    console.log('🌍 API基础URL:', API_BASE_URL)
    
    // 构建请求头，过滤掉不需要的头部
    const headers: HeadersInit = {}
    const skipHeaders = ['host', 'connection', 'content-length', 'content-encoding']
    
    console.log('📋 原始请求头:')
    request.headers.forEach((value, key) => {
      console.log(`  ${key}: ${key.toLowerCase().includes('authorization') ? value.substring(0, 20) + '...' : value}`)
      if (!skipHeaders.includes(key.toLowerCase())) {
        headers[key] = value
      }
    })

    // 添加CORS头部
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, x-vola-key, x-vola-gateway'
    
    console.log('📤 转发请求头:')
    Object.entries(headers).forEach(([key, value]) => {
      console.log(`  ${key}: ${typeof value === 'string' && key.toLowerCase().includes('authorization') ? value.substring(0, 20) + '...' : value}`)
    })
    
    // 处理预检请求
    if (request.method === 'OPTIONS') {
      console.log('✈️ [proxy] 处理预检请求 (OPTIONS)')
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
    let body: string | undefined
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      body = await request.text()
      console.log('📦 请求体:')
      console.log(body)
      // 尝试解析并美化JSON
      try {
        const jsonBody = JSON.parse(body)
        console.log('📦 请求体 (格式化JSON):')
        console.log(JSON.stringify(jsonBody, null, 2))
      } catch (e) {
        console.log('📦 请求体不是JSON格式')
      }
    } else {
      console.log('📦 无请求体')
    }
    
    console.groupEnd()

    console.log('🚀 [proxy] 开始转发请求到后端')
    const fetchStartTime = Date.now()
    
    // 发起代理请求
    const response = await fetch(fullUrl, {
      method: request.method,
      headers,
      body,
    })
    
    const fetchEndTime = Date.now()
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
