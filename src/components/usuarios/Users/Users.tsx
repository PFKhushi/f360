'use client'
import UsersTable from '../Table/UsersTable'
import { usersWithHabilitiesGet } from '@/hook/usersWithHabilitiesGet'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Users() {
  const { data: session } = useSession()
  const { usersWithHabilities, userWithHabilitiesRefetch } =
    usersWithHabilitiesGet()
  const router = useRouter()

  // Verifique se o usuário é gestor
  const isGestor = session?.user?.cargo === 'GESTOR'

  if (!isGestor) {
    router.push('/acesso/inicio')

    return (
      <div className="min-h-screen w-full flex flex-col gap-4 justify-center items-center font-bold">
        <p className="text-2xl text-dark-purple">
          Acesso negado. Você não tem permissão para visualizar esta página.
        </p>
      </div>
    )
  }

  return (
    <div className="p4 lg:px-12 xl:px-24">
      <UsersTable
        users={usersWithHabilities}
        userRefetch={userWithHabilitiesRefetch}
      />
    </div>
  )
}
