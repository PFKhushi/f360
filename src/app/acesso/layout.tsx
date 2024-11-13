import Header from '@/components/navbar/Header'
import { Poppins } from 'next/font/google'

import { ReactNode } from 'react'

const inter = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <main className={inter.className}>
      <Header>{children}</Header>
    </main>
  )
}
