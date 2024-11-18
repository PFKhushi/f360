'use client'
import AtualizarCadastro from '@/components/atualizar-cadastro/AtualizarCadastro'
import { usersGet } from '@/hook/usersGet'
import { useSession } from 'next-auth/react'

export default function Update() {
  const session = useSession()
  const id = session?.data?.user?.id
  const { userId } = usersGet(id)

  return (
    <main className="min-h-screen bg-dark-purple text-white">
      <AtualizarCadastro user={userId[0]} />
    </main>
  )
}
