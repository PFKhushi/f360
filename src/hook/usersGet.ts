import { User } from '@/@types'
import { getUsers } from '@/services'
import { useQuery } from '@tanstack/react-query'

export function usersGet(id?: number) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, error, isLoading, isError, refetch } = useQuery<User[]>({
    queryKey: ['user'],
    queryFn: getUsers,
  })

  const users = data || []

  const userId = () => {
    if (data) {
      const userId = data.filter((user) => user.id === id)
      return userId
    }
    return []
  }

  return {
    users,
    userId: userId(),
    userError: error,
    userLoading: isLoading,
    userRefetch: refetch,
    userIsError: isError,
  }
}
