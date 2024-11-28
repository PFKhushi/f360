'use client'
import UsersTable from '../Table/UsersTable'
import { usersWithHabilitiesGet } from '@/hook/usersWithHabilitiesGet'

export default function Users() {
  const { usersWithHabilities, userWithHabilitiesRefetch } =
    usersWithHabilitiesGet()

  return (
    <div className="p4 lg:px-12 xl:px-24">
      <UsersTable
        users={usersWithHabilities}
        userRefetch={userWithHabilitiesRefetch}
      />
    </div>
  )
}
