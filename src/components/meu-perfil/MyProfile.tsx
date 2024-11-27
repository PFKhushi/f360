import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PatchData } from '@/services/axios'
import { User } from '@/@types'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import InputText from '../Inputs/InputText'
import InputSelect from '../Inputs/InputSelect'
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
  periodo: number
  telefone:number
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
      className="-ml-2 md:-ml-0 w-80 md:w-full md:p-4 flex flex-col justify-center items-center bg-dark-purple rounded-xl text-white"
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
          placeholder="Insira seu email institucional"
          type="text"
          register={register('email_institucional')}
          error={errors.email_institucional}
          defaultValue={user?.email_institucional}
        />
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
        <InputSelect
          label="CARGO"
          register={register('cargo')}
          error={errors.cargo}
          valueDefault={user?.cargo}
        >
          <option value="" hidden>
            Selecione um cargo
          </option>
          <option value="NENHUM">Nenhum</option>
          <option value="GESTOR">Gestor</option>
          <option value="IMERSIONISTA">Imersionista</option>
          <option value="NOVATO">Novato</option>
          <option value="TECH LEADER">Tech Leader</option>
          <option value="VETERANO">Veterano</option>
        </InputSelect>
        <InputSelect
          label="SETOR"
          register={register('setor')}
          error={errors.setor}
          valueDefault={user?.setor}
        >
          <option value="" hidden>
            Selecione uma função
          </option>
          <option value="BACK">Back-End</option>
          <option value="FRONT">Front-End</option>
          <option value="PO">PO</option>
          <option value="DADOS">Dados</option>
          <option value="QA">Quality Assurance</option>
          <option value="UIUX">UI/UX</option>
          <option value="DEVOPS">DevOps</option>
          <option value="MOBILE">Mobile</option>
          <option value="IA">Inteligência Artificial</option>
          <option value="JOGOS">Jogos</option>
        </InputSelect>
        
        <InputSelect
            label="Período"
            register={register('periodo')}
            error={errors.periodo}
            valueDefault={errors?.periodo?.message}
          >
            <option value="" hidden>
              Selecione um período
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
        </InputSelect>
        <InputText
          label="TELEFONE"
          placeholder="Insira seu telefone"
          type="text"
          register={register('telefone')}
          error={errors.telefone}
          defaultValue={user?.telefone}
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
