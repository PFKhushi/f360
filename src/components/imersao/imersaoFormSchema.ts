/* Importações */
'use client'
import { z } from 'zod'

/* Validação do dado colocado no campo */
export const imersaoFormSchema = z.object({
  funcao: z.string().min(1, 'A função é obrigatória'),
  periodo: z.string().min(1, 'O período é obrigatório'),
  nextJsReact: z.string().min(1, 'A habilidade é obrigatória'),
  pythonDjango: z.string().min(1, 'A habilidade é obrigatória'),
  javaSpring: z.string().min(1, 'A habilidade é obrigatória'),
})

export type imersaoFormSchemaType = z.infer<typeof imersaoFormSchema>
