"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginService } from "@/app/services/api/LoginService";
import { MessageService } from "@/app/services/message/MessageService";
import { useAuth } from "@/app/context/useAuth";
import ButtonSubmit from "@/app/components/shared/ButtonSubmit";

const schema = z.object({
  email: z
    .string()
    .email({ message: "Digite um email válido" })
    .min(1, { message: "Preenchimento obrigatório" })
    .max(30, { message: "O campo não deve ter mais que 30 caracteres" }),
  senha: z
    .string()
    .min(1, { message: "Preenchimento obrigatório" })
    .max(30, { message: "O campo não deve ter mais que 30 caracteres" }),
});

type FormData = z.infer<typeof schema>;

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const [isloading, setIsLoading] = useState<boolean>(false)
  const { setToken, clearAuth } = useAuth()

  async function handleLogin(data: FormData) {

    clearAuth();

    setIsLoading(true)
    const response = await new LoginService().login({username: data.email, password: data.senha})
    setIsLoading(false)

    const message = new MessageService()

    if(response){

      if(response.sucesso){
        setToken(response.resultado)
        router.push("/dashboard");
        return router.refresh()
      }

      return response.detalhes.map(detalhe => {
        message.error(detalhe)
      })
      
    }

    return message.error('Erro ao buscar os dados.')
  }

  return (
    <main className="flex min-h-dvh bg-cover bg-top-left bg-[url('/images/planodefundologin.jpg')]">
      
      <div className="flex flex-col gap-12 justify-center items-center w-full md:max-w-1/2 lg:max-w-2/5 bg-primary-3 text-white px-5 py-5 md:rounded-r-3xl">
        
        <div className="flex flex-col gap-12 w-full max-w-83">
          <Link
            href={'/'}
            className="flex items-center justify-between"
          >
            <picture>
              <img
                src="/images/logos/branca-com-preenchimento/branco-com-preenchimento.png"
                alt="Logo"
                className="h-32 object-contain"
              />
            </picture>
          </Link>

          <div className="flex flex-col gap-4">
            <h1 className="text-[40px] font-bold font-coolvetica">Boas vindas.</h1>
            <p className="text-2xl font-light font-louis-george-cafe">Faça login para continuar</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handleLogin)}
          className="flex flex-col gap-3 w-full max-w-83"
        >
          <div>
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-xl"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu email aqui..."
              className="w-full px-4 py-2.5 rounded-lg border-[#D9D9D9] border-1 bg-white/37 placeholder-[#1E1E1EE5]/90 text-white text-xl focus:outline-none"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-secondary-1 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="senha"
              className="block mb-2 font-medium text-xl"
            >
              Senha
            </label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha aqui..."
              className="w-full px-4 py-2.5 rounded-lg border-[#D9D9D9] border-1 bg-white/37 placeholder-[#1E1E1EE5]/90 text-white text-xl focus:outline-none"
              {...register("senha")}
            />
            {errors.senha && (
              <span className="text-secondary-1 text-sm">
                {errors.senha.message}
              </span>
            )}
          </div>

          <div className="text-right text-lg text-white mb-4">
            esqueceu a senha?
          </div>

          <div className="flex flex-col gap-4">
            <ButtonSubmit
              isLoading={isloading}
              label="Entrar"
              className="text-2xl md:text-2xl font-semibold rounded-2xl w-46 self-center"
            />
            <div className="flex justify-center gap-1 text-lg">
              <span>Não se cadastrou?</span>
              <Link
                href="register"
                className="underline"
              >
                Cadastre-se aqui
              </Link>
            </div>
          </div>

        </form>

      </div>
    </main>
  );
}
