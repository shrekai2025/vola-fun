import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 新版本的 turbopack 配置
  turbopack: {
    root: '/Users/uniteyoo/Documents/volaapi/vola-fun',
  },

  // API 代理现在通过 /src/app/api/proxy/[...path]/route.ts 处理

  // 配置响应头以支持跨域
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ]
  },
}

export default nextConfig
