import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://api.vola.fun'

// 处理所有HTTP方法
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // 构建目标URL - Next.js 15+ 需要 await params
    const resolvedParams = await params
    const path = resolvedParams.path.join('/')
    const targetUrl = `${API_BASE_URL}/${path}`
    
    // 获取查询参数
    const url = new URL(request.url)
    const searchParams = url.searchParams.toString()
    const fullUrl = searchParams ? `${targetUrl}?${searchParams}` : targetUrl

    // 构建请求头，过滤掉不需要的头部
    const headers: HeadersInit = {}
    const skipHeaders = ['host', 'connection', 'content-length', 'content-encoding']
    
    request.headers.forEach((value, key) => {
      if (!skipHeaders.includes(key.toLowerCase())) {
        headers[key] = value
      }
    })

    // 添加CORS头部
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, x-vola-key, x-vola-gateway'
    
    // 处理预检请求
    if (request.method === 'OPTIONS') {
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
    }

    // 发起代理请求
    const response = await fetch(fullUrl, {
      method: request.method,
      headers,
      body,
    })

    // 获取响应数据
    const responseData = await response.text()
    
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

    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })

  } catch (error) {
    console.error('Proxy error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Proxy request failed',
        error: error instanceof Error ? error.message : 'Unknown error'
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
