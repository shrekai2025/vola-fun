import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '../../../../constants'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, await params)
}

async function handleRequest(request: NextRequest, params: { path: string[] }) {
  const path = params.path?.join('/') || ''
  const url = `${API_CONFIG.BASE_URL}/${path}`

  // 复制请求头，排除一些不需要的头
  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (!['host', 'connection', 'accept-encoding'].includes(key.toLowerCase())) {
      headers.set(key, value)
    }
  })

  try {
    let body = undefined
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      // 使用text而不是arrayBuffer避免detached问题
      const bodyText = await request.text()
      body = bodyText || undefined
    }

    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
    })

    // 复制响应头
    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value)
    })

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json({ error: 'Proxy request failed' }, { status: 500 })
  }
}
