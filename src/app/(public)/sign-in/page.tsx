"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

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

  function handleLogin(data: FormData) {
    console.log(data);
    router.push("/dashboard");
  }

  return (
    <main className="relative min-h-screen flex items-stretch">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/planodefundologin.jpg')" }}
      />
      <div className="relative z-10 w-full max-w-3xl bg-primary-3 text-white flex flex-col justify-center px-10 py-12 rounded-r-3xl">
        <div className="mb-10 flex items-center justify-between">
          <img
            src="/images/logos/branca-com-preenchimento/branco-com-preenchimento-letreiro.png"
            alt="Logo"
            className="h-40 object-contain mb-6"
          />
          <a className="text-right text-xl font-roboto" href="/">
            Início
          </a>
        </div>

        <h1 className="text-3xl font-bold mb-1 font-coolvetica">Boas vindas.</h1>
        <p className="mb-8 text-base font-louis-george-cafe">Faça login para continuar</p>

        <form
          onSubmit={handleSubmit(handleLogin)}
          className="flex flex-col gap-6 px-16 py-4"
        >
          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-xl font-roboto">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu email aqui..."
              className="w-full px-4 py-2 rounded-md bg-white/20 placeholder-white text-white focus:outline-none"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-secondary-1 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="senha" className="block mb-2 font-medium text-xl font-roboto">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha aqui..."
              className="w-full px-4 py-2 rounded-md bg-white/20 placeholder-white text-white focus:outline-none"
              {...register("senha")}
            />
            {errors.senha && (
              <span className="text-secondary-1 text-sm">
                {errors.senha.message}
              </span>
            )}
          </div>

          <div className="text-right text-sm text-white underline font-roboto">
            esqueceu a senha?
          </div>

          <input
            type="submit"
            value="Entrar"
            className="bg-[#F6A723] hover:bg-[#f8b03f] text-white font-semibold py-2 rounded-md cursor-pointer transition"
          />
        </form>

        <div className="mt-6 text-sm font-roboto">
          Não se cadastrou?{" "}
          <a href="register" className="underline font-roboto">
            Cadastre-se aqui
          </a>
        </div>
      </div>
    </main>
  );
}
