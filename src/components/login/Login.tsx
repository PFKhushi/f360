'use client'
import React from 'react'
import { FiUser } from 'react-icons/fi'
import { GoLock } from 'react-icons/go'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LoginFormSchemaType, loginFormSchema } from './loginFormSchema'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function Login() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
  })

  const onSubmit = async (data: LoginFormSchemaType) => {
    try {
      const res = await signIn('credentials', {
        redirect: false,
        username: data.email,
        password: data.password,
      })

      if (res?.error) {
        console.log(res.error)
        toast.error('Email ou senha incorretos')
      } else {
        toast.success('Login realizado com sucesso')
        router.push('/acesso/inicio')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="flex min-h-screen w-full flex-col lg:flex-row  bg-light-grey">
      <div className="flex flex-col items-center gap-4 w-full lg:w-3/4 lg:pt-24">
        <div className="flex justify-center w-4/5 mt-10">
          <Image
            src="/img/LOGO-ROXA-LETREIRO-HORIZONTAL.png"
            alt="Logo"
            width={400}
            height={147}
            className=""
          />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center md:px-36 lg:px-44 xl:gap-10 gap-8 w-full p-7"
        >
          <article className="relative w-full flex flex-col items-end gap-1">
            <input
              type="text"
              id="login"
              placeholder="Email"
              className="bg-white border-white border-2 text-lg xl:pl-3 pl-16 py-5 rounded-lg w-full"
              {...register('email')}
            />
            <label htmlFor="login">
              <FiUser className="text-light-purple text-3xl absolute top-5 xl:right-3 xl:left-auto left-6" />
            </label>
            {errors.email && (
              <span className="text-red-500 text-sm md:text-base font-semibold">
                {errors.email.message}
              </span>
            )}
          </article>

          <article className="relative flex flex-col items-end xl:gap-2 gap-5 w-full">
            <div className="flex flex-col items-start gap-1 w-full">
              <input
                type="password"
                id="senha"
                placeholder="Senha"
                className="bg-white border-white border-2 text-lg  xl:pl-3 pl-16 py-5 rounded-lg w-full"
                {...register('password')}
              />
              <label htmlFor="senha">
                <GoLock className="text-light-purple text-3xl absolute top-5 xl:right-3 xl:left-auto left-6" />
              </label>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm md:text-base font-semibold">
                {errors.password.message}
              </span>
            )}
            <a href="#" className="text-light-purple font-semibold text-lg">
              Esqueceu a senha?
            </a>
          </article>

          <button className="bg-light-purple text-white text-xl font-bold py-5 px-20 rounded-lg shadow-md hover:bg-yellow-400 active:bg-yellow-500 duration-200">
            ENTRE
          </button>
        </form>
      </div>
      <div className="bg-primary h-full pt-10 pb-44 lg:py-0 lg:h-auto lg:w-1/4 text-white p-3 flex flex-col justify-center items-center gap-8 lg:p-7">
        <h1 className="text-5xl font-bold">Novo Aqui?</h1>
        <p className="text-md">Faça seu cadastro como imersionista!</p>
        <Link
          href="/registrar"
          className="bg-white py-5 px-12 xl:px-20 text-xl whitespace-nowrap text-light-purple font-extrabold rounded-md shadow-md hover:text-white hover:bg-yellow-400 active:bg-yellow-500 duration-200"
        >
          CADASTRE-SE
        </Link>
      </div>
    </main>
  )
}
