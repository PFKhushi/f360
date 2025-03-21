import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { getSession } from 'next-auth/react'

const fetchExperiencias = async ({
  queryKey,
}: {
  queryKey: [string, number | undefined]
}) => {
  const [, id] = queryKey

  if (!id) {
    return []
  }

  const session = await getSession()
  const token = session?.user?.access

  if (!token) {
    throw new Error('No authentication token found')
  }

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/usuario/listagem/`,
    { usuario: id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return res.data.experiencias || []
}

export function useExperiencias(userId?: number) {
  const {
    data: experienciaUser,
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['experiencias', userId],
    queryFn: fetchExperiencias,
    enabled: !!userId, // Only run query if userId exists
  })

  return {
    experienciaUser,
    refetchExperiencias: refetch,
    isLoadingExperiencias: isLoading,
    experienciasError: error,
  }
}
