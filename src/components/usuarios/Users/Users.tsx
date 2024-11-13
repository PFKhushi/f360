'use client'
import { usersGet } from '@/hook/usersGet'
import UsersTable from '../Table/UsersTable'

export default function Users() {
  const { users } = usersGet()

  return (
    <div className="p4 lg:px-12 xl:px-24">
      <UsersTable users={users} />
    </div>
  )
}
