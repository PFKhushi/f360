/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react'

export type User = {
  id: number
  nome: string
  username: string
  email_institucional: string
  cargo: string
  cpf?: string
  rgm?: string
  telefone?: string
  curso?: string
  outros_cursos: string
  periodo: number
  ingresso_fab: string
  setor: string
  situacao: string
  is_bolsista: boolean
  is_estagiario: boolean
  data_criacao: string
  data_atualizacao: string
  aceita_termo: boolean
}

export type ReactQueryProviderProps = {
  children: ReactNode
}

export type Habilidade = {
  id: number
  nome: string
}
