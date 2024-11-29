import { z } from 'zod'

const telefoneRegex = /^\(\d{2}\)\d{4,5}-\d{4}$/
const numerosApenasRegex = /^\d+$/

export const AtualizarPerfilFormSchema = z
  .object({
    nome: z.string().min(1, 'O nome é obrigatório'),
    username: z.string().email('O email precisa ser válido'),
    email_institucional: z
      .string()
      .email('O email precisa ser válido')
      .regex(
        /^[a-zA-Z0-9._%+-]+@cs\.unipe\.edu\.br$/,
        'O email institucional deve seguir o formato @cs.unipe.edu.br',
      ),
    curso: z.string().optional(),
    outros_cursos: z
      .string()
      .max(100, 'É necessário que contenha no máximo 100 digitos')
      .optional(),
    periodo: z
      .string()
      .optional()
      .refine((val) => !val || numerosApenasRegex.test(val), {
        message: 'O período deve conter apenas números',
      }),
    telefone: z
      .string()
      .min(1, 'O telefone é obrigatório')
      .refine((val) => !val || telefoneRegex.test(val), {
        message:
          'O telefone deve estar no formato (XX)XXXXX-XXXX ou (XX)XXXX-XXXX',
      }),
    habilidades: z
      .array(
        z.object({
          senioridade: z.string().min(1, 'A senioridade é obrigatória.'),
          tecnologias: z.number(),
        }),
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.curso === 'Outros') {
        return data.outros_cursos && data.outros_cursos.trim() !== ''
      }
      return true
    },
    {
      path: ['outros_cursos'],
      message: 'É necessário informar qual é o seu curso',
    },
  )

export type AtualizarPerfilFormSchemaType = z.infer<
  typeof AtualizarPerfilFormSchema
>
