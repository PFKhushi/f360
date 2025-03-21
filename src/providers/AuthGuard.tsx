/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, signOut, useSession } from 'next-auth/react'
import axios from 'axios'
import Image from 'next/image'

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (status === 'loading') return // Ainda está carregando a sessão

      checkSession()
      checkTerms()
    }
  }, [router])

  async function checkSession() {
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen w-full flex flex-col gap-4 justify-center items-center font-bold animate-blink">
        <Image
          src="/img/LOGO-ROXA-LETREIRO-HORIZONTAL.png"
          alt="Logo"
          width={400}
          height={147}
          className="animate-blink mx-4 px-4"
        />
        <p className="text-2xl text-dark-purple">Carregando...</p>
      </div>
    )
  }

  return <>{children}</>
}
