'use client'
import Image from 'next/image'
import InputSelect from '../Inputs/InputSelect'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { imersaoFormSchemaType, imersaoFormSchema } from './imersaoFormSchema'
import HabilidadesSelect from './HabilidadesSelect'
import { PatchData, PostData } from '@/services/axios'
import toast from 'react-hot-toast'
import { User } from '@/@types'
import { useRouter } from 'next/navigation'

interface ImersaoProps {
  user: User
}

export default function Imersao({ user }: ImersaoProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<imersaoFormSchemaType>({
    mode: 'all',
    resolver: zodResolver(imersaoFormSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'habilidades',
  })

  const router = useRouter()

  const handleForm = (data: imersaoFormSchemaType) => {
    PatchData({
      url: `/usuario/usuarios/${user.id}/`,
      data: {
        periodo: data.periodo,
        setor: data.setor,
      },
      onSuccess: () => {
        if (!data?.habilidades || data.habilidades.length === 0) {
          toast.success('Inscrito na Imersão com sucesso')
          router.push('/acesso/usuarios')
          console.log('Sem habilidades')
        } else {
          let processedCount = 0
          const totalHabilidades = data.habilidades.length

          data.habilidades.forEach((habilidade) => {
            PostData({
              url: `/usuario/habilidades/`,
              data: {
                usuario: user.id,
                tecnologias: habilidade.tecnologias,
                senioridade: habilidade.senioridade,
                descricao: 'Nenhuma',
              },
              onSuccess: () => {
                processedCount++
                if (processedCount === totalHabilidades) {
                  toast.success('Inscrito na Imersão com sucesso')
                  router.push('/acesso/usuarios')
                }
              },
              onError: (error) => {
                toast.error('Erro ao se inscrever na Imersão')
                console.error(error)
              },
            })
          })
        }
      },
      onError: (error) => {
        toast.error('Erro ao se inscrever na Imersão')
        console.error(error)
      },
    })
  }

  return (
    <div className="pb-12">
      <div className="pt-8">
        <Image
          src="/img/LOGO-ROXA-LETREIRO-HORIZONTAL1.png"
          alt="Logo"
          width={320}
          height={147}
          className="m-auto mt-8"
        />
      </div>
      <form onSubmit={handleSubmit(handleForm)}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col gap-4 items-center justify-center md:grid grid-cols-2 md:gap-8 mt-12">
            <InputSelect
              label="Função"
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

            {/* <Radio
            label={'Next.js & React'}
            setValue={setValue}
            name={'nextJsReact'}
            error={errors.nextJsReact}
            errorText="A habilidade é obrigatória"
          ></Radio> */}
            <div className="col-span-2">
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
              />
            </div>
          </div>
          <button className="text-secondary font-bold text-xl bg-light-grey flex items-center justify-center m-auto p-4 rounded-md mt-8">
            INSCREVER-SE
          </button>
        </div>
      </form>
    </div>
  )
}
