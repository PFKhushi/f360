'use client'
import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, signOut } from 'next-auth/react'
import axios from 'axios'

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()

  async function checkSession() {
    const session = await getSession()

    if (!session) {
      router.push('/')
      return
    }

    async function logout() {
      await signOut({ redirect: false })
    }

    if (session?.expires) {
      const expires = new Date(session.expires).getTime()
      const now = new Date().getTime()
      if (expires < now) {
        logout()
        router.push('/')
      }
    }
  }

  checkSession()

  async function checkTerms() {
    const session = await getSession()
    const token = session?.user?.access
    const userId = session?.user?.id

    if (!token || !userId) return

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/usuario/usuarios/${userId}/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    if (response.data && response.data.aceita_termo === false) {
      router.push('/atualizar-cadastro')
    }
  }

  checkTerms()

  return <>{children}</>
}
