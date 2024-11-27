'use client'
import MyProfile from '@/components/meu-perfil/MyProfile'
import React from 'react'
import { usersGet } from '@/hook/usersGet'
import { useSession } from 'next-auth/react'

export default function Update() {
  const session = useSession()
  const id = session?.data?.user?.id
  const { userId } = usersGet(id)
  return (
    <main className="p-4">
      <MyProfile  user={userId[0]}/>
    </main>
  )
}
