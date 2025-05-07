'use client'

import React, { useState } from 'react'
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '@/app/components/InputField';

const schema = z.object({
  nomeEmpresa: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
  cnpj: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
  nomeRepresentante: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
  emailRepresentante: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
  telefone: z
    .string()
    .min(1, {message: 'Preenchimento Obrigatório'}),
})

export default function Empresa() {

  const{
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({
    resolver: zodResolver(schema),
  });

  function handleRegister (data:any){
    console.log(data);
  }

  return (
    <main className='flex items-center justify-center bg-primary-4 min-h-svh p-4'>
      <div className="bg-secondary-2 w-full max-w-[966px] mt-[140px] rounded-2xl mx-auto pb-[10px]">
        <div className='flex flex-col bg-primary-2 w-full rounded-xl justify-center items-center relative px-4 sm:px-6 py-10'>
          
          <picture>
          <img 
            src="/images/logos/branca-com-preenchimento/branco-com-preenchimento-letreiro-horizontal.png" 
            alt="Logo Fábrica de Software"
            className='w-[335px] h-[127px] absolute top-0 mt-[30px] left-1/2 -translate-x-1/2 '
           />
          </picture>

          <p 
            className='text-white font-louis-george-cafe whitespace-nowrap sm:text-[24px] max-w-[435px]  absolute top-[180px] left-1/2 -translate-x-1/2 text-center'
          >
            Venha registrar as suas demandas
          </p>

          <div className="bg-white h-[1px] w-[90%] max-w-[503px] absolute top-[240px] left-1/2 -translate-x-1/2" />

          <form 
            className='grid md:grid-cols-2 gap-x-[80px] gap-y-12 w-full max-w-[750px] mt-[250px]'
            onSubmit={handleSubmit(handleRegister)}
          >

            <InputField
              id="nomeEmpresa"
              label="Nome da Empresa"
              placeholder='Digite o nome da empresa...'
              register={register}
              error={errors.nomeEmpresa}
            />

            <InputField
              id="cnpj"
              label="CNPJ"
              placeholder='Digite o CNPJ aqui...'
              register={register}
              error={errors.cnpj}
            />

            <InputField
              id="nomeRepresentante"
              label="Nome do representante"
              placeholder='Digite o nome aqui...'
              register={register}
              error={errors.nomeRepresentante}
            />

            <InputField
              id="emailRepresentante"
              label="Email"
              placeholder='Digite o email do representante...'
              register={register}
              error={errors.emailRepresentante}
            />

          <div className='col-span-2 flex justify-center'>
            <div className='w-full max-w-[335px]'>
              <InputField
                id="telefone"
                label="Telefone"
                placeholder='Digite o telefone aqui...'
                register={register}
                error={errors.telefone}
              />
            </div>
          </div>

            <div className="col-span-2 flex flex-col items-center gap-1 mt-6">
              <input 
                type="submit"
                value="Cadastrar-se"
                className="text-white text-[24px] font-roboto bg-secondary-2 rounded-[20px] w-[185px] h-[75px]" 
              />
              <p className="text-white text-[20px] font-roboto">Já é cadastrado? Entre aqui</p>
            </div>

          </form>
        </div>
      </div>
    </main>
  )
}