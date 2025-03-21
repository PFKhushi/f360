// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth/next'

declare module 'next-auth' {
  interface Session {
    user: {
      sub: string
      refresh: string
      access: string
      id: number
      cargo: string
      iat: number
      exp: number
      jti: string
    }
  }
}
