/* Importações */
'use client'
import { z } from 'zod'

/* Validação do dado colocado no campo */
export const esqueceuSenhaFormSchema = z.object({
  email: z.string().min(1, 'O email é obrigatório').email('Email inválido'),
})

export type esqueceuSenhaFormSchemaType = z.infer<
  typeof esqueceuSenhaFormSchema
>
