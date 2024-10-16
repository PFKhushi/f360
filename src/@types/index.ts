import { ReactNode } from 'react'

export type User = {
  id: number
  nome: string
  cpf: string
  cargo: number
}

export type ReactQueryProviderProps = {
  children: ReactNode
}
