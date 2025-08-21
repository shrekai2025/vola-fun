import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  // 配置认证提供商（稍后配置Firebase或其他提供商）
  providers: [
    // 将在后续添加具体提供商配置
  ],
  callbacks: {
    async session({ session, token }) {
      // 扩展session对象
      if (session.user) {
        session.user.id = token.sub!
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
}
