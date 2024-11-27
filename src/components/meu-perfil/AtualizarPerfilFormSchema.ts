import { z } from 'zod';

const telefoneRegex = /^\(\d{2}\)\d{4,5}-\d{4}$/
const numerosApenasRegex = /^\d+$/;

export const AtualizarPerfilFormSchema = z
    .object({
        nome: z
            .string()
            .min(1, 'O nome é obrigatório'),
        email_institucional: z
            .string()
            .email('O email precisa ser válido'),
        curso: z
            .string()
            .min(1, 'O curso é obrigatório'),
        cargo: z
            .string()
            .min(1, 'O cargo é obrigatório'),
        setor: z.
            string()
            .min(1, 'O setor é obrigatório'),
        periodo: z
            .string()
            .min(1, 'O período é obrigatório')
            .refine((val) => numerosApenasRegex.test(val), {
                message: 'O período deve conter apenas números',
            }),
        telefone: z
            .string()
            .min(1, 'O telefone é obrigatório')
            .refine((val) => !val || telefoneRegex.test(val), {
            message:
            'O telefone deve estar no formato (XX)XXXXX-XXXX ou (XX)XXXX-XXXX',
        
    }),
});

export type AtualizarPerfilFormSchemaType = z.infer<typeof AtualizarPerfilFormSchema>;
