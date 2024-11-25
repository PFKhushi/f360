'use client'
import Imersao from '@/components/imersao/Imersao'
import { usersGet } from '@/hook/usersGet'
import { useSession } from 'next-auth/react'

export default function Imersionista() {
  const session = useSession()
  const id = session?.data?.user?.id
  const { userId } = usersGet(id)

  return (
    <main className="min-h-screen bg-dark-purple text-white">
      <Imersao user={userId[0]} />
    </main>
  )
}
