'use client'
import {z} from "zod"

export const registroFormSchema = z.object({
    nomeCompleto: z.string().min(1, "Preencha seu nome completo!"),
    email: z.string().min(1, "O email é obrigatório")
})

export type RegistroFormSchemaType = z.infer<typeof registroFormSchema>

