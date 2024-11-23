"use client";
import { z } from "zod";

const telefoneRegex = /^\(\d{2}\)\d{4,5}-\d{4}$/;

export const changeUserFormSchema = z.object({
  nome: z.string().min(1, "Preencha seu nome completo"),
  periodo: z
    .string()
    .nonempty("O período é obrigatório")
    .min(1, "O período é obrigatório")
    .refine((val) => val !== "", "Selecione um período válido"),
  cargo: z.string().min(2, "O cargo é obrigatório"),
  setor: z.string().min(2, "Escolha o setor"),
  rgm: z.string().length(8, "É necessário que o RGM contenha 8 dígitos"),
  username: z.string().email("O email é obrigatório"),
  email_institucional: z
    .string()
    .min(1, "O email é obrigatório")
    .regex(
      /^[a-zA-Z0-9._%+-]+@cs\.unipe\.edu\.br$/,
      "O email institucional deve seguir o formato @cs.unipe.edu.br"
    ),
  telefone: z
    .string()
    .min(1, "O telefone é obrigatório")
    .refine((val) => !val || telefoneRegex.test(val), {
      message:
        "O telefone deve estar no formato (XX)XXXXX-XXXX ou (XX)XXXX-XXXX",
    }),
});

export type ChangeUserFormSchemaType = z.infer<typeof changeUserFormSchema>;
