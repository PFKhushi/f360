'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

const schema = z.object({
  email: z
    .string()
    .email({message: 'Digite um email válido'})
    .min(1, {message: 'Preenchimento obrigatório'})
    .max(30, {message: 'O campo não deve ter mais que 30 caracteres'}),
  senha: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'})
    .max(30, {message: 'O campo não deve ter mais que 30 caracteres'}),
})

type FormData = z.infer<typeof schema>

export default function SignIn() {

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const router = useRouter();

  function handleLogin(data: FormData){
    console.log(data)
    router.push('/dashboard')
  }

  return (
    <main className='flex bg-primary-3 min-h-svh'>

      <div className='relative flex justify-center items-center w-1/2 overflow-hidden'>
        <picture className='z-10 max-w-50'>
          <img
            src="/images/logos/branca-com-preenchimento/branco-com-preenchimento-letreiro.png"
            alt="Logo Fábrica de Software"
          />
        </picture>
        <div className='absolute h-[calc(100svh*1.5)] w-[calc(100svh*1.5)] min-h-200 min-w-200 right-0  bg-primary-2 rounded-full'/>
        <div className='absolute h-[calc(100svh*1.5)] w-[calc(100svh*1.5)] min-h-200 min-w-200 right-30  bg-primary-1 rounded-full'/>
      </div>

      <div className='flex justify-center items-center w-1/2'>
        <form
          className='flex flex-col gap-4 w-full max-w-80'
          onSubmit={handleSubmit(handleLogin)}
        >

          <div className='relative flex flex-col'>
            <input
              type="text"
              id="email"
              className='peer bg-variation-1 px-3 py-5 rounded-xl transition focus:bg-secondary-1 focus:text-white'
              {...register('email')}
            />
            <label className='absolute peer-focus:text-white top-0 left-2 text-primary-3'>E-mail</label>
            {errors.email && (
              <span className='text-secondary-1 text-right'>{errors.email.message?.toString()}</span>
            )}
          </div>

          <div className='relative flex flex-col'>
            <input
              type="password"
              id="senha"
              className='peer bg-variation-1 px-3 py-5 rounded-xl transition focus:bg-secondary-1 focus:text-white'
              {...register('senha')}
            />
            <label className='absolute peer-focus:text-white top-0 left-2 text-primary-3'>Senha</label>
            {errors.senha && (
              <span className='text-secondary-1 text-right'>{errors.senha.message?.toString()}</span>
            )}
          </div>
          
          <div className='flex justify-between items-center'>
            <a
              href="#"
              className='text-white transition hover:text-secondary-1'
            >
              Esqueceu senha?
            </a>
            <input
              type="submit"
              value="Entrar"
              className='bg-secondary-1 px-3 py-2 rounded-xl w-full max-w-1/2 transition hover:bg-variation-1'
            />
          </div>
          
        </form>

      </div>
    </main>
  )
}
