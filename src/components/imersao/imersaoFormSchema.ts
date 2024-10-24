/* Importações */
'use client'
import { z } from 'zod'

/* Validação do dado colocado no campo */
export const imersaoFormSchema = z.object({
  // rodizio: z.string().min(1, 'O rodízio é obrigatório'),
})

export type imersaoFormSchemaType = z.infer<typeof imersaoFormSchema>
