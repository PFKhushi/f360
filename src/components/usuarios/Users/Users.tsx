'use client'
import { usersGet } from '@/hook/usersGet'

export default function Users() {
  const { users } = usersGet()

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.nome}</h2>
          <p>{user.cpf}</p>
        </div>
      ))}
    </div>
  )
}
