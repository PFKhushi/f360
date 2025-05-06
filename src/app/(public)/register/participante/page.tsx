'use client'

import React, { useState } from 'react'
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '@/app/components/InputField';
import SelectField from '@/app/components/SelectField';
import TextareaField from '@/app/components/TextArea';

const schema = z.object({
  nome: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
  email: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
  cpf: z
    .string()
    .min(1, {message: 'Preenchimento Obrigatório'}),
  telefone: z
    .string()
    .min(1, {message: 'Preenchimento Obrigatório'}),
  matricula: z
    .string()
    .min(8, {message: 'RGM possui 8 números'})
    .max(8, {message: 'RGM possui 8 números'}),
  curso: z
    .string()
    .min(1, { message: 'Selecione um curso' }),
  cursoOutro: z
    .string()
    .optional(),
  periodo: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
  experienciaprevia: z
    .string()
    .optional(),
}).refine(
  (data) => {
    if(data.curso === 'outros'){
      return data.cursoOutro && data.cursoOutro.trim() !== '';
    }
    return true;
  },
  {
    message: 'Informe o nome do curso',
    path: ['cursoOutro'],
  }
);

export default function Participante() {

  const [cursoSelecionado, setCursoSelecionado] = useState('');

  const{
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  function handleRegister(data: any){
    console.log(data);
  }

  function handleCursoChange(e: React.ChangeEvent<HTMLSelectElement>){
    setCursoSelecionado(e.target.value);
  }

  return (
    <main className='flex items-center justify-center bg-primary-4 min-h-svh p-4'>
      <div className="bg-secondary-2 w-full max-w-[966px] mt-[140px] rounded-2xl mx-auto pb-[10px]">
        <div className='flex flex-col bg-primary-2 w-full rounded-xl justify-center items-center relative px-4 sm:px-6 py-10'>
          
          <picture>
          <img 
            src="/images/logos/branca-com-preenchimento/branco-com-preenchimento-letreiro-horizontal.png" 
            alt="Logo Fábrica de Software"
            className='w-[335px] h-[127px] absolute top-0 left-1/2 -translate-x-1/2 '
           />
          </picture>

          <p 
            className='text-white font-louis-george-cafe whitespace-nowrap sm:text-[24px] max-w-[435px]  absolute top-[140px] left-1/2 -translate-x-1/2 text-center'
          >
            Venha participar do  processo de imersão
          </p>

          <div className="bg-white h-[1px] w-[90%] max-w-[503px] absolute top-[190px] left-1/2 -translate-x-1/2" />

          <form 
            className='grid md:grid-cols-2 gap-x-[80px] gap-y-6 w-full max-w-[750px] mt-[200px]'
            onSubmit={handleSubmit(handleRegister)}
          >
            <InputField
              id="nome"
              label="Nome completo"
              placeholder='Digite seu nome aqui...'
              register={register}
              error={errors.nome}
            />

            <InputField
              id="email"
              label="Email"
              placeholder='Digite seu email aqui...'
              register={register}
              error={errors.email}
            />

            <InputField
              id="cpf"
              label="CPF"
              placeholder='Digite seu cpf aqui...'
              register={register}
              error={errors.cpf}
            />

            <InputField
              id="matricula"
              label="Matricula"
              placeholder='Digite sua matricula aqui...'
              register={register}
              error={errors.matricula}
            />

            <InputField
              id="telefone"
              label="Telefone"
              placeholder='Digite seu telefone aqui...'
              register={register}
              error={errors.telefone}
            />

            <InputField
                id="periodo"
                label="Periodo"
                placeholder='Digite seu período aqui...'
                register={register}
                error={errors.periodo}
            />

            <SelectField
              id = "curso"
              label = "Curso"
              register={register}
              error = {errors.curso}
              defaultValue = ""
              options = {[
                {value: "ads", label: "Análise e Desenvolvimento de Sistemas"},
                {value: "cienccomp", label: "Ciência da Computação"},
                {value: "ciencdados", label: "Ciência de Dados"},
                {value: "gti", label: "Gestão da Tecnologia da Informação"},
                {value: "redescomp", label: "Redes de Computadores"},
                {value: "spi", label: "Sistemas para Internet"},
                {value: "outros", label: "Outro"}
              ]}
              onChange={handleCursoChange}
            />

            {cursoSelecionado === 'outros' && (
              <div className="col-span-2 md:col-span-1 w-full">
               <InputField
                id="cursoOutro"
                label= "Informe seu curso"
                placeholder='Digite o nome do curso'
                register={register}
                error={errors.cursoOutro}
               />
              </div>
            )}

            <div className='md:col-span-2'>
            <TextareaField
              id="experienciaprevia"
              label="Experiência Prévia"
              placeholder="Insira aqui sua experiência prévia"
              register={register}
            />
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