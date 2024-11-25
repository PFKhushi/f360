import axios from 'axios'
import { getSession } from 'next-auth/react'

export const getUsers = async () => {
  const session = await getSession()
  const token = session?.user?.access
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/usuario/usuarios/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )

  return response.data
}

export const getHabilidades = async () => {
  const session = await getSession()
  const token = session?.user?.access
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/habilidades/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )

  return response.data
}

export const getExperiencias = async () => {
  const session = await getSession()
  const token = session?.user?.access
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/usuario/experiencias/`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  )

  return response.data
}
