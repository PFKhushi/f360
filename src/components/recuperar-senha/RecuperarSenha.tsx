'use client'
import Image from 'next/image'
import InputText from '../Inputs/InputText'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import {
  RecuperarSenhaFormSchema,
  RecuperarSenhaFormSchemaType,
} from './RecuperarSenhaFormSchema'
import axios from 'axios'

interface RecuperarSenhaProps {
  url: string
}

export default function RecuperarSenha({ url }: RecuperarSenhaProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecuperarSenhaFormSchemaType>({
    mode: 'all',
    resolver: zodResolver(RecuperarSenhaFormSchema),
  })

  const router = useRouter()

  async function handleForm(data: RecuperarSenhaFormSchemaType) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/usuario/password-reset-confirm/${url}/`,
        { new_password: data.senha },
      )
      toast.success('Senha alterada com sucesso!')
      router.push('/')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.email) {
        toast.error(error.response.data.email[0])
      } else {
        toast.error(
          'Ocorreu um erro ao alterar a senha ou o tempo foi expirado.',
        )
        console.error(error)
      }
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit(handleForm)}>
        <div className="mb-10">
          <Image
            src="/img/LOGO-ROXA-LETREIRO-HORIZONTAL1.png"
            alt="Logo"
            width={320}
            height={147}
            className="m-auto mt-8"
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
          <div>
            <InputText
              label="Nova Senha"
              placeholder="Insira sua nova senha"
              type="text"
              register={register('senha')}
              error={errors.senha}
            />
          </div>
          <div>
            <InputText
              label="Confirmar Senha"
              placeholder="Insira sua senha novamente"
              type="text"
              register={register('confirmarSenha')}
              error={errors.confirmarSenha}
            />
          </div>
        </div>
        <button
          type="submit"
          className="text-secondary font-bold text-xl bg-light-grey flex items-center justify-center m-auto p-4 rounded-md mt-12 md:mt-28 md:w-60"
        >
          ALTERAR
        </button>
      </form>
    </div>
  )
}
