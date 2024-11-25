'use client'
import { isValidCPF } from '@/components/atualizar-cadastro/AtualizarCadastroFormSchema'
import { z } from 'zod'

const telefoneRegex = /^\(\d{2}\)\d{4,5}-\d{4}$/

export const changeUserFormSchema = z
  .object({
    nome: z.string().min(1, 'Preencha seu nome completo'),
    periodo: z.string().optional(),
    cpf: z
      .string()
      .min(1, 'O CPF é obrigatório')
      .transform((cpf) => {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      })
      .refine((value) => isValidCPF(value), 'Esse CPF é inválido'),
    cargo: z.string().min(2, 'O cargo é obrigatório'),
    curso: z.string().optional(),
    outros_cursos: z
      .string()
      .max(100, 'É necessário que contenha no máximo 100 digitos')
      .optional(),
    setor: z.string().min(2, 'Escolha o setor'),
    rgm: z.string().length(8, 'É necessário que o RGM contenha 8 dígitos'),
    username: z.string().email('O email é obrigatório'),
    email_institucional: z
      .string()
      .min(1, 'O email é obrigatório')
      .regex(
        /^[a-zA-Z0-9._%+-]+@cs\.unipe\.edu\.br$/,
        'O email institucional deve seguir o formato @cs.unipe.edu.br',
      ),
    telefone: z
      .string()
      .min(1, 'O telefone é obrigatório')
      .refine((val) => !val || telefoneRegex.test(val), {
        message:
          'O telefone deve estar no formato (XX)XXXXX-XXXX ou (XX)XXXX-XXXX',
      }),
  })
  .refine(
    (data) => {
      if (data.curso === 'Outros' && data.cargo !== 'GESTAO') {
        return data.outros_cursos && data.outros_cursos.trim() !== ''
      }
      return true
    },
    {
      path: ['outros_cursos'],
      message: 'É necessário informar qual é o seu curso',
    },
  )
  .refine(
    (data) => {
      if (data.cargo === 'GESTAO') {
        return data.curso && data.curso.trim() !== ''
      }
      return true
    },
    {
      path: ['curso'],
      message: 'O campo "curso" é obrigatório quando o cargo é "GESTAO"',
    },
  )

export type ChangeUserFormSchemaType = z.infer<typeof changeUserFormSchema>
