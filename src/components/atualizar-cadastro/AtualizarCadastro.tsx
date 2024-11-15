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
import axios from "axios";
import { useState } from 'react'

export default function AtualizarCadastro() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AtualizarCadastroFormSchemaType>({
    mode: 'all',
    resolver: zodResolver(AtualizarCadastroFormSchema),
  })

  const handleForm = (data: AtualizarCadastroFormSchemaType) => {
    console.log(data)
  }
  const [formData, setFormData] = useState<AtualizarCadastroFormSchemaType>({
    inputRGM: '',
    inputCurso: '',
    inputTelefone: '',
    inputCPF: '',
    termoDeUso: false
  });

  const atualizarDados = async (data: AtualizarCadastroFormSchemaType) => {
    try{
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
        data, 
        {
          headers: {
            'Content-Type': 'application/json',  
          },
        }
      )
      console.log("Atualização realizada com sucesso", response.data)
    } catch(error){
      if(axios.isAxiosError(error)){
        console.error("Erro ao atualizar cadastro: ", error.response?.data || error.message)
      }
      else{
        console.error("O erro é desconhecido: ",error)
      }
    }
  }
  const handleClick = () => {
    atualizarDados(formData);
  };

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
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 md:space-y-4">
          <div>
            <InputText
              label="RGM"
              placeholder="Insira seu RGM"
              type="text"
              register={register('inputRGM')}
              error={errors.inputRGM}
            />
          </div>
          <div>
            <InputText
              label="CPF"
              placeholder="Insira seu CPF"
              type="text"
              register={register('inputCPF')}
              error={errors.inputCPF}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 md:space-y-4 mt-4">
          <div>
            <InputText
              label="Telefone"
              placeholder="Insira seu telefone"
              type="text"
              register={register('inputTelefone')}
              error={errors.inputTelefone}
            />
          </div>
          <div>
            <InputText
              label="Curso"
              placeholder="Insira seu Curso"
              type="text"
              register={register('inputCurso')}
              error={errors.inputCurso}
            />
          </div>
        </div>
        <button
          type="submit"
          className="text-secondary font-bold text-xl bg-light-grey flex items-center justify-center m-auto p-4 rounded-md mt-12 md:mt-28 md:w-60"
          onClick={handleClick}
        >
          ATUALIZAR
        </button>
        <div className="flex flex-row justify-center mt-8 mb-8  md:space-x-3">
          <input type="checkbox" {...register('termoDeUso')} />
          <p>
            Eu li e concordo com os{' '}
            <span className="text-dark-yellow underline ">
              <Link href="/termos-de-uso">termos de uso.</Link>
            </span>
          </p>
        </div>
        {errors.termoDeUso && (
          <div className="w-full flex justify-center items-center">
            <span className="text-red-500 w-full text-center xl:text-sm text-md font-semibold ml-1">
              {errors.termoDeUso.message}
            </span>
          </div>
        )}
      </form>
    </div>
  )
}
