'use client'

import { MainLayout } from '@/components/templates/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Zap, CreditCard, Shield, Code, Globe, ArrowRight } from 'lucide-react'

export default function PricingPage() {
  return (
    <MainLayout>
      {/* 页面标题 */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">定价方案</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            了解vola.fun的核心价值，选择适合您的使用方案
          </p>
        </div>
      </section>

      {/* 核心价值主张 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">为什么选择 vola.fun？</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <CardTitle>简化API管理</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  统一的API密钥，一次认证，调用所有API。告别繁琐的密钥管理，专注于业务逻辑。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <CardTitle>集中化支付</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  单一支付入口，统一计费。只需向vola支付，即可使用市场内所有API服务。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <CardTitle>面向AI优化</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  专为AI应用场景设计的API生态，提供高质量、稳定可靠的AI工具和数据服务。
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 使用场景 */}
      <section className="py-16 bg-white rounded-lg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">适用场景</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <Code className="h-8 w-8 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">独立开发者</h3>
                <p className="text-gray-600">
                  快速验证想法，需要一个能够轻松调用多种API的&ldquo;游乐场&rdquo;。
                  无需为每个API单独注册和管理密钥。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Globe className="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">AI应用开发者</h3>
                <p className="text-gray-600">
                  需要调用各种工具类API（数据处理、图像识别、自然语言处理）
                  来构建和优化AI模型或应用。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 定价计划占位 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">定价计划</h2>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-lg text-gray-600 mb-4">定价计划正在制定中...</p>
            <p className="text-gray-500">我们将很快推出灵活的定价方案，敬请期待！</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">开始构建你的AI应用</h2>
          <p className="text-lg text-gray-600 mb-8">
            加入thousands of developers，使用vola.fun简化你的API集成流程
          </p>
          <Button size="lg" asChild>
            <Link href="/#api-market">
              浏览API市场
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  )
}
