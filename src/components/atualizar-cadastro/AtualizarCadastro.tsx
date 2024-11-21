'use client'
import Link from 'next/link'
import Image from 'next/image'
import InputText from '../Inputs/InputText'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AtualizarCadastroFormSchema,
  AtualizarCadastroFormSchemaType,
} from './AtualizarCadastroFormSchema'
import { PatchData } from '@/services/axios'
import { User } from '@/@types'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import InputSelect from '../Inputs/InputSelect'
import { useRouter } from 'next/navigation'

interface AtualizarCadastroProps {
  user: User
}

export default function AtualizarCadastro({ user }: AtualizarCadastroProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AtualizarCadastroFormSchemaType>({
    mode: 'all',
    resolver: zodResolver(AtualizarCadastroFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (user) {
      setValue('rgm', user?.rgm || '')
      setValue('cpf', user?.cpf || '')
      setValue('telefone', user?.telefone || '')
      setValue('curso', user?.curso || '')
    }
  }, [user, setValue])

  const handleForm = (data: AtualizarCadastroFormSchemaType) => {
    PatchData({
      url: `/usuario/usuarios/${user.id}/`,
      data: { ...data },
      onSuccess: () => {
        toast.success('Atualização realizada com sucesso')
        router.push('/acesso/usuarios')
      },
      onError: (error) =>
        toast.error(
          'Erro ao atualizar cadastro: ',
          error.response?.data || error.message,
        ),
    })
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
        <div className="flex flex-col md:grid grid-cols-2 justify-center items-center gap-4 md:gap-12">
          <div>
            <InputText
              label="RGM"
              placeholder="Insira seu RGM"
              type="text"
              register={register('rgm')}
              error={errors.rgm}
              defaultValue={user?.rgm}
            />
          </div>
          <div>
            <InputText
              label="CPF"
              placeholder="Insira seu CPF"
              type="text"
              register={register('cpf')}
              error={errors.cpf}
              defaultValue={user?.cpf}
            />
          </div>

          <div>
            <InputText
              label="Telefone"
              placeholder="Insira seu telefone"
              type="text"
              register={register('telefone')}
              error={errors.telefone}
              defaultValue={user?.telefone}
            />
          </div>
          <div>
            <InputSelect
              label="Curso"
              register={register('curso')}
              error={errors.curso}
              valueDefault={user?.curso}
            >
              <option value="" hidden>
                Selecione um curso
              </option>
              <option value="Análise e Desenvolvimento de Sistemas">
                Análise e Desenvolvimento de Sistemas
              </option>
              <option value="Ciência da Computação">
                Ciência da Computação
              </option>
              <option value="Sistemas para Internet">
                Sistemas para Internet
              </option>
              <option value="Ciência de Dados">Ciência de Dados</option>
              <option value="Outros">Outros</option>
            </InputSelect>
          </div>
          <div>
            <InputText
              label="Curso - Outros"
              placeholder="Insira seu curso"
              type="text"
              register={register('outros_cursos')}
              error={errors.outros_cursos}
              defaultValue={user?.outros_cursos}
            />
          </div>
        </div>
        <button
          type="submit"
          className="text-secondary font-bold text-xl bg-light-grey flex items-center justify-center m-auto p-4 rounded-md mt-12 md:mt-28 md:w-60"
        >
          ATUALIZAR
        </button>
        <div className="flex flex-row justify-center items-center mt-8 mb-2 md:gap-3">
          <input
            type="checkbox"
            {...register('aceita_termo')}
            className="cursor-pointer rounded accent-purple-300 border-white border-4 w-5 h-5"
          />
          <p>
            Eu li e concordo com os{' '}
            <span className="text-dark-yellow underline ">
              <Link href="/termos-de-uso">termos de uso.</Link>
            </span>
          </p>
        </div>
        {errors.aceita_termo && (
          <div className="w-full flex justify-center items-center">
            <span className="text-red-500 w-full text-center xl:text-sm text-md font-semibold ml-1">
              {errors.aceita_termo.message}
            </span>
          </div>
        )}
      </form>
    </div>
  )
}
