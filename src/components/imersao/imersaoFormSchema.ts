/* Importações */
'use client'
import { z } from 'zod'

/* Validação do dado colocado no campo */
export const imersaoFormSchema = z.object({
  funcao: z.string().min(1, 'A função é obrigatória'),
  periodo: z.string().min(1, 'O período é obrigatório'),
  nextJsReact: z.string(),
  pythonDjango: z.string(),
  javaSpring: z.string(),
})

export type imersaoFormSchemaType = z.infer<typeof imersaoFormSchema>
