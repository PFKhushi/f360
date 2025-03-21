import { Habilidade } from '@/@types'
import { getHabilidades } from '@/services'
import { useQuery } from '@tanstack/react-query'

export function habilidadesGet(id?: number) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, error, isLoading, isError, refetch } = useQuery<Habilidade[]>({
    queryKey: ['habilidade'],
    queryFn: getHabilidades,
  })

  const habilidades = data || []

  const habilidadeId = () => {
    if (data) {
      const habilidadeId = data.filter((habilidade) => habilidade.id === id)
      return habilidadeId
    }
    return []
  }

  return {
    habilidades,
    habilidadeId: habilidadeId(),
    habilidadeError: error,
    habilidadeLoading: isLoading,
    habilidadeRefetch: refetch,
    habilidadeIsError: isError,
  }
}
