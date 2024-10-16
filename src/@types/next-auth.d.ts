// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth/next'

declare module 'next-auth' {
  interface Session {
    user: {
      token: string
      access: string
      refresh: string
    }
  }
}
