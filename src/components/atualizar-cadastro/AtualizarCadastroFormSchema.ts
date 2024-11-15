import { z } from 'zod'

const telefoneRegex = /^\(\d{2}\)\d{4,5}-\d{4}$/

function isValidCPF(cpf: string) {
  cpf = cpf.replace(/[^\d]+/g, '') // Remove caracteres não numéricos

  if (cpf.length !== 11) {
    return false
  }

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) {
    return false
  }

  // Verifica o primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let mod = sum % 11
  const digit1 = mod < 2 ? 0 : 11 - mod

  if (parseInt(cpf.charAt(9)) !== digit1) {
    return false
  }

  // Verifica o segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  mod = sum % 11
  const digit2 = mod < 2 ? 0 : 11 - mod

  if (parseInt(cpf.charAt(10)) !== digit2) {
    return false
  }

  return true
}

export const AtualizarCadastroFormSchema = z.object({
  rgm: z.string().length(8, 'É necessário que o RGM contenha 8 dígitos.'),
  curso: z
    .string()
    .max(100, 'É necessário que contenha no máximo 100 digitos')
    .min(2, 'O curso é obrigatório'),
  telefone: z
    .string()
    .min(1, 'O telefone é obrigatório')
    .refine((val) => !val || telefoneRegex.test(val), {
      message:
        'O telefone deve estar no formato (XX)XXXXX-XXXX ou (XX)XXXX-XXXX',
    }),
  cpf: z
    .string()
    .min(1, 'O CPF é obrigatório')
    .transform((cpf) => {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    })
    .refine((value) => isValidCPF(value), 'Esse CPF é inválido'),
  aceita_termo: z
    .boolean()
    .refine((value) => value, 'É necessário aceitar os termos de uso'),
})

export type AtualizarCadastroFormSchemaType = z.infer<
  typeof AtualizarCadastroFormSchema
>
