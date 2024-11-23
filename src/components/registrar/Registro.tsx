'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  RegistroFormSchemaType,
  registroFormSchema,
} from './registerFormSchema'
import Image from 'next/image'
import InputText from '../Inputs/InputText'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function Registro() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistroFormSchemaType>({
    resolver: zodResolver(registroFormSchema),
  })

  const router = useRouter()

  const onSubmit = async (data: RegistroFormSchemaType) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/usuario/usuarios/`,
        {
          username: data.email,
          email_institucional: data.email,
          nome: data.nome,
          cargo: 'REGISTRADO',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      toast.success('O Usuário cadastrado com sucesso:', response.data)
      router.push('/')
    } catch (error) {
      toast.error('Erro ao cadastrar o usuário')
      console.error(error)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-8 justify-center items-center p-8">
        <Image
          src="/img/LOGO-ROXA-LETREIRO-HORIZONTAL1.png"
          alt="LOGO"
          width={400}
          height={147}
          className=""
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 p-2 mt-4 items-center"
        >
          <InputText
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            type="text"
            error={errors.nome}
            register={register('nome')}
          />
          <InputText
            label="Email"
            placeholder="Digite seu email"
            type="email"
            error={errors.email}
            register={register('email')}
          />
          <button className=" bg-white p-3 mt-4 text-light-purple font-extrabold rounded-md w-2/3 flex justify-center ">
            CADASTRE-SE
          </button>
        </form>
      </div>
    </div>
  )
}
