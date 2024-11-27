import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PatchData } from '@/services/axios'
import { User } from '@/@types'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import InputText from '../Inputs/InputText'
import { AtualizarPerfilFormSchema } from '@/components/meu-perfil/AtualizarPerfilFormSchema'

interface AtualizarPerfil {
  user: User
}

interface AtualizarPerfilFormSchemaType {
  nome: string
  email_institucional: string
  curso: string
  cargo: string
  setor: string
}

export default function MyProfile({ user }: AtualizarPerfil) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AtualizarPerfilFormSchemaType>({
    resolver: zodResolver(AtualizarPerfilFormSchema),
    defaultValues: {
      nome: '',
      email_institucional: '',
      curso: '',
      cargo: '',
      setor: '',
    },
  })

  const router = useRouter()

  useEffect(() => {
    if (user) {
      setValue('nome', user.nome || '')
      setValue('email_institucional', user.username || '')
      setValue('curso', user.curso || '')
      setValue('cargo', user.cargo || '')
      setValue('setor', user.setor || '')
    }
  }, [user, setValue])

  const handleForm = (data: AtualizarPerfilFormSchemaType) => {
    PatchData({
      url: `/usuario/usuarios/${user.id}/`,
      data: { ...data },
      onSuccess: () => {
        toast.success('Atualização realizada com sucesso')
        router.push('/acesso/usuarios')
      },
      onError: (error) =>
        toast.error(
          'Erro ao atualizar perfil: ' + (error.response?.data || error.message),
        ),
    })
  }
  return (
    <form
      onSubmit={handleSubmit(handleForm)}
      className="w-full md:p-4 flex flex-col justify-center items-center bg-dark-purple rounded-xl text-white"
    >
      <h1 className="md:text-3xl mb-8 mt-8">Editar Perfil</h1>
      <div className="flex flex-col md:grid grid-cols-2 justify-center items-center gap-4 md:gap-12">
        <InputText
          label="NOME"
          placeholder="Insira seu NOME"
          type="text"
          register={register('nome')}
          error={errors.nome}
          defaultValue={user?.nome}
        />
        <InputText
          label="EMAIL INSTITUCIONAL"
          placeholder="Insira seu EMAIL INSTITUCIONAL"
          type="text"
          register={register('email_institucional')}
          error={errors.email_institucional}
          defaultValue={user?.email_institucional}
        />
        <InputText
          label="CURSO"
          placeholder="Insira seu CURSO"
          type="text"
          register={register('curso')}
          error={errors.curso}
          defaultValue={user?.curso}
        />
        <InputText
          label="CARGO"
          placeholder="Insira seu CARGO"
          type="text"
          register={register('cargo')}
          error={errors.cargo}
          defaultValue={user?.curso}
        />
        <InputText
          label="SETOR"
          placeholder="Insira seu SETOR"
          type="text"
          register={register('setor')}
          error={errors.setor}
          defaultValue={user?.setor}
        />
      </div>
      <button
        type="submit"
        className="text-secondary font-bold text-xl bg-light-grey flex items-center justify-center m-auto p-4 rounded-md mt-12 md:mt-16 md:w-60"
      >
        ATUALIZAR
      </button>
    </form>
  )
}
