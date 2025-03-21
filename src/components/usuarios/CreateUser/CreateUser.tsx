'use client'
import { DialogTitle } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { PostData } from '@/services/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import InputText from '../../Inputs/InputText'
import InputSelect from '../../Inputs/InputSelect'
import {
  CreateUserFormSchemaType,
  createUserFormSchema,
} from './createUserFormSchema'

interface UpdateModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>
  userRefetch: () => void
}

export default function CreateUser({
  setIsOpen,
  userRefetch,
}: UpdateModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormSchemaType>({
    mode: 'all',
    resolver: zodResolver(createUserFormSchema),
  })

  function closeModal() {
    setIsOpen(false)
  }

  const cargo = watch('cargo')
  const curso = watch('curso')

  const onSubmit = (data: CreateUserFormSchemaType) => {
    PostData({
      url: `/usuario/usuarios/`,
      data: { ...data, username: data.email_institucional },
      onSuccess: () => {
        toast.success('Usuário criado com sucesso')
        userRefetch()
        closeModal()
      },
      onError: (error) => {
        toast.error('Erro ao criar usuário')
        console.error('Erro ao criar usuário', error)
      },
    })
  }

  return (
    <div>
      <DialogTitle>
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
        <div className="mx-auto sm:px-2 lg:py-2">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 mt-28 text-start md:flex md:flex-row items-center gap-x-10">
              <h2 className="max-[420px]:text-2xl font-semibold py-5 text-white text-3xl md:text-4xl -mt-10 md:-mt-20">
                Criar novo usuário
              </h2>
            </div>

            <div className="rounded-x relative mt-1 w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4 text-white justify-center items-center xl:grid grid-cols-2">
                  <InputText
                    label="Nome"
                    placeholder="Digite o nome do usuário"
                    type="text"
                    error={errors.nome}
                    register={register('nome')}
                  />

                  <InputText
                    label="E-mail Institucional"
                    placeholder="Digite o E-mail Instituicional do usuário"
                    type="email"
                    error={errors.email_institucional}
                    register={register('email_institucional')}
                  />

                  <InputText
                    label="RGM"
                    placeholder="Digite o RGM do usuário"
                    type="text"
                    error={errors.rgm}
                    register={register('rgm')}
                  />

                  <InputText
                    label="CPF"
                    placeholder="Digite o CPF do usuário"
                    type="text"
                    error={errors.cpf}
                    register={register('cpf')}
                  />

                  <InputText
                    label="Telefone"
                    placeholder="Digite o Telefone do usuário"
                    type="text"
                    error={errors.telefone}
                    register={register('telefone')}
                  />

                  <InputSelect
                    label="Cargo"
                    register={register('cargo')}
                    error={errors.cargo}
                  >
                    <option value="">Nenhum</option>
                    <option value="GESTOR">Gestor</option>
                    <option value="TECH_LEADER">Tech Leader</option>
                    <option value="VETERANO">Veterano</option>
                    <option value="NOVATO">Novato</option>
                    <option value="IMERSIONISTA">Imersionista</option>
                    <option value="REGISTRADO">Registrado</option>
                  </InputSelect>

                  {cargo !== 'GESTOR' && cargo !== '' && (
                    <div>
                      <InputSelect
                        label="Curso"
                        register={register('curso')}
                        error={errors.curso}
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
                        <option value="Ciência de Dados">
                          Ciência de Dados
                        </option>
                        <option value="Outros">Outros</option>
                      </InputSelect>
                    </div>
                  )}
                  {curso === 'Outros' && (
                    <div>
                      <InputText
                        label="Curso - Outros"
                        placeholder="Insira seu curso"
                        type="text"
                        register={register('outros_cursos')}
                        error={errors.outros_cursos}
                      />
                    </div>
                  )}

                  <InputSelect
                    label="Setor"
                    register={register('setor')}
                    error={errors.setor}
                  >
                    <option value="">Nenhum</option>
                    <option value="GESTAO">Gestão</option>
                    <option value="BACK">Back-end</option>
                    <option value="DADOS">Dados</option>
                    <option value="DEVOPS">DevOps</option>
                    <option value="FRONT">Front-end</option>
                    <option value="IA">Inteligência Artificial</option>
                    <option value="JOGOS">Jogos</option>
                    <option value="MOBILE">Mobile</option>
                    <option value="PO">Product Owner</option>
                    <option value="QA">Quality Assurance</option>
                    <option value="UIUX">UI/UX</option>
                  </InputSelect>

                  <InputSelect
                    label="Periodo"
                    register={register('periodo')}
                    error={errors.periodo}
                  >
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
                </div>
                <div className="w-full flex justify-center items-center">
                  <button
                    type="submit"
                    className="max-w-64 md:max-w-none text-center mt-7 mb-10 bg-white py-5 px-4 xl:px-20 text-xl whitespace-nowrap text-light-purple font-extrabold rounded-md shadow-md hover:text-white hover:bg-yellow-400 active:bg-yellow-500 duration-200"
                  >
                    CADASTRAR USUÁRIO
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
