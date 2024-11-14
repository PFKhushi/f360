'use client'
import { z } from 'zod'

export const registroFormSchema = z.object({
  nomeCompleto: z.string().min(1, 'Preencha seu nome completo!'),
  email: z
    .string()
    .min(1, 'O email é obrigatório')
    .regex(
      /^[a-zA-Z0-9._%+-]+@cs\.unipe\.edu\.br$/,
      'O email institucional deve seguir o formato @cs.unipe.edu.br',
    ),
})

export type RegistroFormSchemaType = z.infer<typeof registroFormSchema>
