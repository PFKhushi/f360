import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import NextAuthSessionProvider from '@/providers/sessionProvider'
import ToasterProvider from '@/providers/ToasterProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fabrica 360',
  description: 'Fábrica de Software',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          <ReactQueryProvider>
            <>  
            {children}
            <ToasterProvider />
            </>   
          </ReactQueryProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
