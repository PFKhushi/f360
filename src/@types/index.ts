/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react'

export type User = {
  id: number
  password: string
  last_login?: string
  is_superuser: boolean
  first_name: string
  last_name: string
  email: string
  is_staff: boolean
  is_active: boolean
  date_joined: string
  nome: string
  cpf: string
  username: string
  email_institucional: string
  rgm: string
  telefone: string
  curso: string
  cargo: string
  ingresso_fab: any
  setor?: string
  situacao: string
  is_bolsista: boolean
  is_estagiario: boolean
  data_criacao: string
  data_atualizacao: string
  aceita_termo: boolean
  groups: any[]
  user_permissions: any[]
}
export type ReactQueryProviderProps = {
  children: ReactNode
}
