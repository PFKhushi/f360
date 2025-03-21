/* Importações */
'use client'
import { z } from 'zod'

/* Validação do dado colocado no campo */
export const imersaoFormSchema = z.object({
  setor: z.string().min(1, 'A função é obrigatória'),
  periodo: z.string().min(1, 'O período é obrigatório'),
  habilidades: z
    .array(
      z.object({
        id: z.number().optional(),
        senioridade: z.string().min(1, 'A senioridade é obrigatória.'),
        tecnologias: z.number(),
      }),
    )
    .optional(),
})

export type imersaoFormSchemaType = z.infer<typeof imersaoFormSchema>
