'use client'
import { z } from 'zod'

export const registroFormSchema = z
  .object({
    nome: z.string().min(1, 'Preencha seu nome completo!'),
    email: z
      .string()
      .min(1, 'O email é obrigatório')
      .regex(
        /^[a-zA-Z0-9._%+-]+@cs\.unipe\.edu\.br$/,
        'O email institucional deve seguir o formato @cs.unipe.edu.br',
      ),
    senha: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .max(100, 'A senha deve ter no máximo 100 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
      .regex(
        /[^a-zA-Z0-9]/,
        'A senha deve conter pelo menos um caractere especial',
      ),
    confirmarSenha: z
      .string()
      .max(100, 'É necessário que contenha no máximo 100 digitos')
      .min(2, 'Confirmar a senha é obrigatório'),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    path: ['confirmarSenha'],
    message: 'As senhas não são iguais',
  })

export type RegistroFormSchemaType = z.infer<typeof registroFormSchema>
