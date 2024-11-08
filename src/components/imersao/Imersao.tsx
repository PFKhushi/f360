'use client'
import { FiChevronDown } from 'react-icons/fi'
import Radio from './RadioGroup/RadioGroup'
import Image from 'next/image'
import InputSelect from '../Inputs/InputSelect'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { imersaoFormSchemaType, imersaoFormSchema } from './imersaoFormSchema'

export default function Imersao() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<imersaoFormSchemaType>({
    mode: 'all',
    resolver: zodResolver(imersaoFormSchema),
  })

  console.log(errors)

  const handleForm = (data: imersaoFormSchemaType) => {
    console.log(data)
  }

  const funcao = watch('funcao')

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
        <div className="flex justify-center items-center">
          <div className="flex flex-col gap-4 items-center justify-center md:grid grid-cols-2 md:gap-8 mt-12">
            <InputSelect
              label="Função"
              register={register('funcao')}
              error={errors.funcao}
            >
              <option value="" hidden>
                Selecione uma função
              </option>
              <option value="Back-End">Back-End</option>
              <option value="Front-End">Front-End</option>
              <option value="Dados">Dados</option>
              <option value="PO">PO</option>
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
          </div>
        </div>
        <div className="flex items-center">
          <h1 className="  text-lg ml-[11%] md:ml-[11%] lg:ml-[16%] mt-8 mb-8 font-bold">
            Habilidades
          </h1>
          <FiChevronDown className="ml-2 h-5 w-5 transform scale-125" />
        </div>
        <div>
          {funcao === 'Front-End' && (
            <>
              <Radio
                label={'Next.js & React'}
                setValue={setValue}
                name={'nextJsReact'}
                error={errors.nextJsReact}
                errorText="A habilidade é obrigatória"
              ></Radio>
              <Radio
                label={'Vite & React'}
                setValue={setValue}
                name={'nextJsReact'}
                error={errors.nextJsReact}
                errorText="A habilidade é obrigatória"
              ></Radio>
              <Radio
                label={'TypeScript'}
                setValue={setValue}
                name={'nextJsReact'}
                error={errors.nextJsReact}
                errorText="A habilidade é obrigatória"
              ></Radio>
              <Radio
                label={'JavaScript'}
                setValue={setValue}
                name={'nextJsReact'}
                error={errors.nextJsReact}
                errorText="A habilidade é obrigatória"
              ></Radio>
            </>
          )}
          {funcao === 'Back-End' && (
            <>
              <Radio
                label={'Python & Django'}
                setValue={setValue}
                name={'pythonDjango'}
                error={errors.pythonDjango}
                errorText="A habilidade é obrigatória"
              ></Radio>
              <Radio
                label={'PHP & Laravel'}
                setValue={setValue}
                name={'pythonDjango'}
                error={errors.pythonDjango}
                errorText="A habilidade é obrigatória"
              ></Radio>
              <Radio
                label={'Node.JS & Express'}
                setValue={setValue}
                name={'pythonDjango'}
                error={errors.pythonDjango}
                errorText="A habilidade é obrigatória"
              ></Radio>
            </>
          )}
          {funcao === 'Dados' && (
            <Radio
              label={'Habilidade Dados'}
              setValue={setValue}
              name={'javaSpring'}
              error={errors.javaSpring}
              errorText="A habilidade é obrigatória"
            ></Radio>
          )}
          {funcao === 'PO' && (
            <Radio
              label={'Habilidade PO'}
              setValue={setValue}
              name={'javaSpring'}
              error={errors.javaSpring}
              errorText="A habilidade é obrigatória"
            ></Radio>
          )}
        </div>
        <button className="text-secondary font-bold text-xl bg-light-grey flex items-center justify-center m-auto p-4 rounded-md mt-8">
          INSCREVER-SE
        </button>
      </form>
    </div>
  )
}
