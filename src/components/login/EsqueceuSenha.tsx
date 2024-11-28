'use client'
import { DialogTitle } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'
import toast from 'react-hot-toast'
import {
  esqueceuSenhaFormSchema,
  esqueceuSenhaFormSchemaType,
} from './esqueceuSenhaFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import axios from 'axios'

interface EsqueceuSenhaProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export default function EsqueceuSenha({ setIsOpen }: EsqueceuSenhaProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<esqueceuSenhaFormSchemaType>({
    resolver: zodResolver(esqueceuSenhaFormSchema),
  })

  function closeModal() {
    setIsOpen(false)
  }

  async function handleForgetPassword(data: esqueceuSenhaFormSchemaType) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/usuario/password-reset/`,
        data,
      )
      toast.success('Email de recuperação enviado com sucesso!')
      closeModal()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.email) {
        toast.error(error.response.data.email[0])
      } else {
        toast.error('Erro ao enviar email de recuperação. Tente novamente.')
        console.error(error)
      }
    }
  }

  return (
    <div>
      <DialogTitle>
        <h2 className="mt-10 sm:-mt-4 text-4xl font-bold py-5 pl-5 text-white text-left col-span-4">
          Esqueceu a senha?
        </h2>
        <div className="text-end text-lg font-medium leading-6 text-light-grey absolute right-4 top-4">
          <button
            type="button"
            className="mx-4 sm:mr-6 mt-7 2xl:mr-10 2xl:mt-10 inline-flex justify-center rounded-md border border-transparent bg-light-grey px-4 py-2 text-sm font-bold text-dark-purple hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={closeModal}
          >
            X
          </button>
        </div>
      </DialogTitle>
      <div className="mt-2">
        <div>
          <form
            className="text-start flex flex-col justify-end items-center gap-x-10 mt-8"
            onSubmit={handleSubmit(handleForgetPassword)}
          >
            <div className="flex flex-col gap-5 justify-center items-center">
              <label
                htmlFor="email-recuperar"
                className="text-white text-lg font-semibold text-center"
              >
                Informe seu email para recuperar sua senha
              </label>
              <input
                type="text"
                id="email-recuperar"
                placeholder="Email"
                className="bg-white border-white border-2 text-lg pl-3 py-5 rounded-lg w-full text-left"
                {...register('email')}
              />
              {errors.email && (
                <span className="text-red-500 text-sm md:text-base font-semibold text-center">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="w-full flex flex-wrap gap-4 justify-center items-center mt-7">
              <button
                type="button"
                onClick={closeModal}
                className="bg-light-grey py-3 px-8 text-lg whitespace-nowrap text-dark-purple font-extrabold rounded-md shadow-md duration-200"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                className="bg-green-500 py-3 px-8 text-lg whitespace-nowrap text-white font-extrabold rounded-md shadow-md hover:text-white duration-200"
              >
                ENVIAR
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
