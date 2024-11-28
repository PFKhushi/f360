import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PatchData, PostData } from '@/services/axios'
import { User } from '@/@types'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import InputText from '../Inputs/InputText'
import InputSelect from '../Inputs/InputSelect'
import {
  AtualizarPerfilFormSchema,
  AtualizarPerfilFormSchemaType,
} from '@/components/meu-perfil/AtualizarPerfilFormSchema'
import { LuUserCircle2 } from 'react-icons/lu'
import HabilidadesSelect from '../imersao/HabilidadesSelect'
import { useExperiencias } from '@/hook/experienciaUserGet'

interface AtualizarPerfil {
  user: User
}

export default function MyProfile({ user }: AtualizarPerfil) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AtualizarPerfilFormSchemaType>({
    resolver: zodResolver(AtualizarPerfilFormSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'habilidades',
  })

  const { experienciaUser, refetchExperiencias } = useExperiencias(user?.id)

  useEffect(() => {
    if (user) {
      setValue('nome', user.nome || '')
      setValue('username', user.username || '')
      setValue('email_institucional', user.username || '')
      setValue('curso', user.curso || '')
      setValue('periodo', String(user.periodo) || '')
      setValue('telefone', user.telefone || '')
    }
  }, [user, setValue])

  const handleForm = (data: AtualizarPerfilFormSchemaType) => {
    PatchData({
      url: `/usuario/usuarios/${user.id}/`,
      data: { ...data },
      onSuccess: () => {
        if (!data?.habilidades || data.habilidades.length === 0) {
          toast.success('Atualização realizada com sucesso')
        } else {
          let processedCount = 0
          const totalHabilidades = data.habilidades.length

          data.habilidades.forEach((habilidade) => {
            PostData({
              url: `/usuario/experiencias/`,
              data: {
                usuario: user.id,
                tecnologias: habilidade.tecnologias,
                senioridade: habilidade.senioridade,
                descricao: 'Nenhuma',
              },
              onSuccess: () => {
                processedCount++
                if (processedCount === totalHabilidades) {
                  toast.success('Atualização realizada com sucesso')
                  window.location.reload()
                }
              },
              onError: (error) => {
                toast.error('Erro ao atualizar perfil')
                console.error(error)
              },
            })
          })
        }
      },
      onError: () => toast.error('Erro ao atualizar perfil'),
    })
  }
  return (
    <form
      onSubmit={handleSubmit(handleForm)}
      className="mt-4 sm:p-8 flex flex-col gap-8 justify-center items-center bg-dark-purple rounded-xl text-white w-full"
    >
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
        <LuUserCircle2 className="w-20 h-20 md:w-14 md:h-14" />
        <h1 className="text-3xl md:text-4xl md:my-8 font-bold">
          Editar Perfil
        </h1>
      </div>
      <div className="flex flex-row flex-wrap justify-center max-w-[1500px] mx-auto w-full items-center gap-4 md:gap-12">
        <InputText
          label="Nome completo"
          placeholder="Insira seu nome completo"
          type="text"
          register={register('nome')}
          error={errors.nome}
          defaultValue={user?.nome}
        />

        <InputText
          label="Email de Login"
          placeholder="Insira seu email de login"
          type="text"
          register={register('username')}
          error={errors.username}
          defaultValue={user?.username}
        />

        <InputText
          label="Email Institucional"
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
          <option value="Ciência da Computação">Ciência da Computação</option>
          <option value="Sistemas para Internet">Sistemas para Internet</option>
          <option value="Ciência de Dados">Ciência de Dados</option>
          <option value="Outros">Outros</option>
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
          <option value="">Nenhum</option>
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
          label="Telefone"
          placeholder="Insira seu telefone"
          type="text"
          register={register('telefone')}
          error={errors.telefone}
          defaultValue={user?.telefone}
        />

        <div>
          <HabilidadesSelect
            contentName="habilidades"
            errors={errors}
            label="Habilidades"
            setValue={setValue}
            watch={watch}
            defaultHabilidades={[]}
            fields={fields}
            append={append}
            remove={remove}
            experiencias={experienciaUser}
            experienceRefetch={refetchExperiencias}
          />
        </div>
      </div>
      <button
        type="submit"
        className="text-secondary font-bold text-xl bg-light-grey flex items-center justify-center m-auto mb-6 p-4 rounded-md mt-12 md:mt-16 md:w-60"
      >
        ATUALIZAR PERFIL
      </button>
    </form>
  )
}
