import { z } from 'zod';

export const AtualizarPerfilFormSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  email_institucional: z.string().email('O email precisa ser válido'),
  curso: z.string().min(1, 'O curso é obrigatório'),
  cargo: z.string().min(1, 'O cargo é obrigatório'),
  setor: z.string().min(1, 'O setor é obrigatório'),
});

export type AtualizarPerfilFormSchemaType = z.infer<typeof AtualizarPerfilFormSchema>;
