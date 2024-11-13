import { ReactNode } from 'react'

export type User = {
  nome: string
  cpf: string
  username: string
  email_institucional: string
  rgm: string
  curso: string
  telefone: string
  ingresso_fab: string
  setor?: string
  data_criacao: string
  data_atualizacao: string
  aceita_termo: boolean
}
export type ReactQueryProviderProps = {
  children: ReactNode
}
