import { UsersWithHabilities } from '@/@types'
import { getUsersWithHabilities } from '@/services'
import { useQuery } from '@tanstack/react-query'

export function usersWithHabilitiesGet(id?: number) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, error, isLoading, isError, refetch } = useQuery<
    UsersWithHabilities[]
  >({
    queryKey: ['userHabilities'],
    queryFn: getUsersWithHabilities,
  })

  const usersWithHabilities = data || []

  const userId = () => {
    if (data) {
      const userId = data.filter((user) => user.usuario.id === id)
      return userId
    }
    return []
  }

  return {
    usersWithHabilities,
    userWithHabilitiesId: userId(),
    userWithHabilitiesError: error,
    userWithHabilitiesLoading: isLoading,
    userWithHabilitiesRefetch: refetch,
    userWithHabilitiesIsError: isError,
  }
}
