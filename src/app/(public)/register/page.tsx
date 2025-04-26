'use client'

import Link from "next/link";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const schema = z.object({
  nome: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
  email: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
  cpf: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'})
    .max(14, {message: 'O CPF não deve ter mais que 14 caracteres'}),
  telefone: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'})
    .max(14, {message: 'O Número não deve ter mais que 14 caracteres'}),
  rgm: z
    .string()
    .min(8, {message: 'O RGM deve conter 8 dígitos'})
    .max(8, {message: 'O RGM deve conter 8 dígitos'}),
  periodo: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'})
    .max(2, {message: 'O Período não deve ter mais que 2 caracteres'}),
  curso: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
  area: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
})

type FormData = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  rgm: string;
  periodo: string;
  curso: string;
  area: string;
};

export default function Register() {

  const {
      register,
      handleSubmit,
      formState: {errors},
      watch,
      setValue,
  } = useForm<FormData>({
         resolver: zodResolver(schema),
  });

  const [showCursoInput, setShowCursoInput] = useState(false);

  function handleRegister(data: FormData){
    console.log(data)
  }

  function handleCursoChange(e: React.ChangeEvent<HTMLSelectElement>){
    const selectedValue = e.target.value;
    if(selectedValue === 'outros'){
      setShowCursoInput(true);
      setValue('curso', '');
    } else{
      setShowCursoInput(false);
      setValue('curso', selectedValue);
    }
  }

  return (
    <main className='flex bg-primary-4 min-h-svh'>

      <div className='relative flex flex-col justify-center items-center w-full'>

      <picture className='max-w-100 max-h-50 mt-20'>
          <img src="images/logos/branca-com-preenchimento/branco-com-preenchimento-letreiro-horizontal.png" alt="Logo Fábrica de Software" />
      </picture>

      <form 
          className='grid grid-cols-2 gap-x-30 gap-y-8 w-full max-w-[840px] mx-auto mt-20'
          onSubmit={handleSubmit(handleRegister)}
      >

        <div>
          <label className='text-white font-bold text-xl mb-1 block'>Nome completo</label>
          <input
            type="text"
            id='nome'
            placeholder='Insira aqui seu nome completo'
            className='peer text-white bg-transparent w-full py-3 rounded-full border transition-colors duration-200 ease-in-out border-gray-400 px-4  placeholder:text-sm placeholder-white focus:border-secondary-1 focus:outline-none'
            {...register('nome')}
          />
          {errors.nome && (
            <span
                className='text-secondary-1 text-right'>
                {errors.nome.message?.toString()}
            </span>
          )}
        </div>

        <div>
          <label className='text-white font-bold text-xl mb-1 block'>CPF</label>
          <input
            type="text"
            id='cpf'
            placeholder='Insira aqui seu cpf'
            className='peer text-white bg-transparent w-full py-3 rounded-full border transition-colors duration-200 ease-in-out border-gray-400 px-4  placeholder:text-sm placeholder-white focus:border-secondary-1 focus:outline-none'
            {...register('cpf')}
          />
          {errors.cpf && (
            <span 
                className='text-secondary-1 text-right'>
                {errors.cpf.message?.toString()}
            </span>
          )}
        </div>

        <div>
          <label className='text-white font-bold text-xl mb-1 block'>E-mail</label>
          <input
            type="text"
            id='email'
            placeholder='Insira aqui seu e-mail'
            className='peer text-white bg-transparent w-full py-3 rounded-full border transition-colors duration-200 ease-in-out border-gray-400 px-4  placeholder:text-sm placeholder-white  focus:border-secondary-1 focus:outline-none'
            {...register('email')}
          />
          {errors.email && (
            <span 
                className='text-secondary-1 text-right'>
                {errors.email.message?.toString()}
            </span>
          )}
        </div>

        <div>
          <label className='text-white font-bold text-xl mb-1 block'>Telefone</label>
          <input
            type="text"
            id='telefone'
            placeholder='Insira aqui seu telefone'
            className='peer text-white bg-transparent w-full py-3 rounded-full border transition-colors duration-200 ease-in-out border-gray-400 px-4  placeholder:text-sm placeholder-white  focus:border-secondary-1 focus:outline-none'
            {...register('telefone')}
          />
          {errors.telefone && (
            <span 
                className='text-secondary-1 text-right'>
                {errors.telefone.message?.toString()}
            </span>
          )}
        </div>

        <div>
          <label className='text-white font-bold text-xl mb-1 block'>Curso</label>
          <select 
            id="curso"
            className='peer text-white text-sm bg-primary-4 w-full py-3.5 rounded-full border border-gray-400 px-4  transition-colors duration-200 ease-in-out focus:border-secondary-1 focus:outline-none appearance-none relative'
            {...register('curso')}
            defaultValue=""
            onChange={handleCursoChange}
          >
              <option value="" disabled >Selecione seu curso</option>
              <option value="ads">Análise e Desenvolvimento de Sistemas</option>
              <option value="ciencomp">Ciência da Computação</option>
              <option value="ciendados">Ciência de Dados</option>
              <option value="engsoft">Engenharia de Software</option>
              <option value="gesttecno">Gestão da Tecnologia da Informação</option>
              <option value="redescomp">Redes de Computadores</option>
              <option value="sistinternet">Sistemas para Internet</option>
              <option value="outros">Outro</option>
          </select>

          {showCursoInput && (
            <input 
              type="text" 
              placeholder="Digite o seu curso"
              className="mt-3 peer text-white bg-transparent w-full py-3 rounded-full border transition-colors duration-200 ease-in-out border-gray-400 px-4  placeholder:text-sm placeholder-white  focus:border-secondary-1 focus:outline-none"
              onChange={(e) => setValue('curso', e.target.value)}
            />
          )}

          {errors.curso && (
            <span 
              className="text-secondary-1 text-right">
              {errors.curso.message?.toString()}
            </span>
          )}
        </div>

        <div>
          <label className='text-white font-bold text-xl mb-1 block'>RGM</label>
          <input
            type="text"
            id='rgm'
            placeholder='Insira aqui seu RGM'
            className='peer text-white bg-transparent w-full py-3 rounded-full border transition-colors duration-200 ease-in-out border-gray-400 px-4  placeholder:text-sm placeholder-white  focus:border-secondary-1 focus:outline-none'
            {...register('rgm')}
          />
          {errors.rgm && (
            <span 
                className='text-secondary-1 text-right'>
                {errors.rgm.message?.toString()}
            </span>
          )}
        </div>

        <div>
          <label className='text-white font-bold text-xl mb-1 block'>Periodo</label>
          <input
            type="text"
            id='periodo'
            placeholder='Insira aqui seu período'
            className='peer text-white bg-transparent w-full py-3 rounded-full border transition-colors duration-200 ease-in-out border-gray-400 px-4  placeholder:text-sm placeholder-white  focus:border-secondary-1 focus:outline-none'
            {...register('periodo')}
          />
        {errors.periodo && (
          <span 
              className='text-secondary-1 text-right'>
              {errors.periodo.message?.toString()}
          </span>
        )}
        </div>

        <div>
          <label className='text-white font-bold text-xl mb-1 block'>Área de Interesse</label>
          <select 
            id="area"
            className='peer text-white text-sm bg-primary-4 w-full py-3.5 rounded-full border border-gray-400 px-4  transition-colors duration-200 ease-in-out focus:border-secondary-1 focus:outline-none appearance-none relative'
            {...register('area')}
            defaultValue=""
          >
              <option value="" disabled >Selecione sua area</option>
              <option value="back">Back-end</option>
              <option value="dados">Dados</option>
              <option value="devops">DevOps</option>
              <option value="front">Front-end</option>
              <option value="mobile">Mobile</option>
              <option value="po">Product Owner (PO)</option>
              <option value="qa">Qualidade de Software (QA)</option>
              <option value="uidesigne">UI/Designer</option>
          </select>
          {errors.area && (
            <span 
              className="text-secondary-1 text-right">
              {errors.area.message?.toString()}
            </span>
          )}
        </div>

        <div>
          <label className='text-white font-bold text-xl mb-1 block'>Experiência Prévia</label>
          <textarea
            id='experienciaprevia'
            placeholder='Insira aqui sua experiência prévia'
            className='peer text-white bg-transparent w-full py-3 rounded-2xl border transition-colors duration-200 ease-in-out border-gray-400 px-4 placeholder:text-sm placeholder-white focus:border-secondary-1 focus:outline-none resize-none'
            rows={4} 
          />
        </div>

        <div className='col-span-2 flex flex-col justify-center items-center mt-2'> 
            <input 
              type="submit" 
              value="Cadastre-se"
              className='bg-secondary-1 text-white font-bold rounded-full px-25 py-3 text-2xl'
            />
            <p className='text-white mt-3'>Já possui uma conta? <Link className="text-secondary-2 font-bold underline" href={'/sign-in'}>Entre</Link></p>  
        </div>

      </form>

      </div>

    </main>
  )
}
