import Header from '@/components/navbar/Header'
// import AuthGuard from '@/providers/AuthGuard'
import { Poppins } from 'next/font/google'

import { ReactNode } from 'react'

const inter = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
})

export default function SystemLayout({ children }: { children: ReactNode }) {
  return (
    <main className={(inter.className, 'bg-light-grey min-h-screen')}>
      {/* <AuthGuard> */}
      <Header>{children}</Header>
      {/* </AuthGuard> */}
    </main>
  )
}
