import axios from 'axios'
import { getSession } from 'next-auth/react'

export const getUsers = async () => {
  const session = await getSession()
  console.log(session)
  const token = session?.user?.access
  console.log(token)
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/usuario/usuarios/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )

  return response.data
}
