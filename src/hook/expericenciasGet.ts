import { Experiencia } from '@/@types'
import { getExperiencias } from '@/services'
import { useQuery } from '@tanstack/react-query'

export function experienciasGet(id?: number) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, error, isLoading, isError, refetch } = useQuery<Experiencia[]>({
    queryKey: ['experiencia'],
    queryFn: getExperiencias,
  })

  const experiencias = data || []

  const experienciaId = () => {
    if (data) {
      const experienciaId = data.filter((experiencia) => experiencia.id === id)
      return experienciaId
    }
    return []
  }

  const experienciaUserId = () => {
    if (data) {
      const experienciaId = data.filter(
        (experiencia) => experiencia.usuario === id,
      )
      return experienciaId
    }
    return []
  }

  return {
    experiencias,
    experienciaId: experienciaId(),
    experienciaUserId,
    experienciaError: error,
    experienciaLoading: isLoading,
    experienciaRefetch: refetch,
    experienciaIsError: isError,
  }
}
