'use client'

import ClientOnly from '@/app/ClientOnly';
import Link from "next/link";
import React, { useEffect } from 'react';
import {useState} from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Select from 'react-select';
import {GroupBase, StylesConfig, ActionMeta, SingleValue} from 'react-select';

type OptionType = { value: string; label: string}; //tipo personalizado em TypeScript

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
    .custom<OptionType | null>((val) => !!val && !!val.value && !!val.label, {
      message: 'Selecione um curso',
    }),
  area: z
    .custom<OptionType | null>((val) => !!val && !!val.value && !!val.label, {
      message: 'Selecione uma área de interesse',
    }),
})

type FormData = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  rgm: string;
  periodo: string;
  curso: OptionType | null;
  area: OptionType | null;
};

export default function Register() {

  const {
      register,
      handleSubmit,
      formState: {errors},
      setValue,
  } = useForm<FormData>({
        resolver: zodResolver(schema),
  });

  const [curso, setCurso] = useState<OptionType | null>(null); 
  const [area, setArea] = useState<OptionType | null>(null);
  //Pode ser uma opção válida (OptionType) Ou null (caso nada esteja selecionado no início)

  useEffect(() => {
            setValue('curso', curso);
  }, [curso, setValue]);

  useEffect(() => {
            setValue('area', area);
  }, [area, setValue]);

  function handleRegister(data: FormData){
    console.log(data)
  }

  const optionsCurso: OptionType[] = [
    { value: 'ads', label: 'Análise e Desenvolvimento de Sistemas' },
    { value: 'cc', label: 'Ciência da Computação' },
    { value: 'gti', label: 'Gestão da Tecnologia da Informação' },
    { value: 'si', label: 'Sistemas para Internet' },
    { value: 'cd', label: 'Ciência de Dados' },
    { value: 'engsoft', label: 'Engenharia de Software' },
    { value: 'redecomp', label: 'Rede de Computadores' }
  ];

  const optionsAreaDeInteresse: OptionType[] = [
    { value : 'backend', label: 'Back-end'},
    { value: 'dados', label: "Dados"},
    { value: 'devops', label: "DevOps"},
    { value: 'frontend', label: "Front-end"},
    { value: 'mobile', label: "Mobile"},
    { value: 'po', label: "Product Owner (PO)"},
    { value: 'qa', label: "QA"},
    {value: 'uidesigner', label: "UI/Designer"}
  ];

  // StylesConfig -> um "molde" que já vem da biblioteca react-select e tem três parâmetros genéricos
  // <OptionType>	-> Diz qual o tipo das opções do select
  // false ->	Diz que não é multi-select
  //GroupBase<OptionType>	-> Diz que as opções poderiam estar agrupadas
  const customStyles :  StylesConfig<OptionType, false, GroupBase<OptionType>> = {
    control: (base, state) => ({
      ...base,
      backgroundColor: '#210E69',
      borderRadius: '9999px',
      borderColor: state.isFocused ? '#FFC311' : '#99a1af',
      boxShadow: 'none', // sem glow
      padding: '0.375rem 0.75rem',
      color: 'white',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      '&:hover': {
        borderColor: state.isFocused ? '#FFC311' : '#99a1af', // mantém a cor no hover se estiver focado
      },
    }),
    valueContainer: (base) => ({ //container onde o texto selecionado aparece
      ...base,
      paddingLeft: '0rem', //Remove espaçamento à esquerda
    }),
    singleValue: (base) => ({ //texto do valor selecionado 
      ...base,
      color: 'white',
    }),
    placeholder: (base) => ({ //Estiliza o placeholder
      ...base,
      fontSize: '0.875rem',
      color: 'white',
    }),
    menu: (base) => ({ // Menu Dropdown
      ...base,
      backgroundColor: '#210E69',
      color: 'white',
    }),
    option: (base, { isFocused }) => ({ //Customiza cada opção individual dentro do menu
      ...base,
      backgroundColor: isFocused ? '#FFC311' : 'transparent',
      color: isFocused ? '#210E69' : 'white',
      padding: '0.5rem 1rem',
    }),
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
            <ClientOnly>
              <Select
                id="curso"
                name="curso"
                styles={customStyles}
                options={optionsCurso}
                placeholder="Selecione seu curso"
                value={curso}
                onChange={(selected) => setCurso(selected)} // guarda o valor selecionado no estado
                />
              </ClientOnly>
              {errors.curso && (
                <span 
                    className='text-secondary-1 text-left block'>
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
            <ClientOnly>
              <Select
                id="areadeinteresse"
                name="areadeinteresse"
                styles={customStyles}
                options={optionsAreaDeInteresse}
                placeholder="Selecione sua área de interesse"
                value={area}
                onChange={(selected) => setArea(selected)} // guarda o valor selecionado no estado
                />
            </ClientOnly>
            {errors.area && (
                <span 
                    className='text-secondary-1 text-left block'>
                    {errors.area.message?.toString()}
                </span>
              )}
        </div>

        <div>
          <label className='text-white font-bold text-xl mb-1 block'>Experiência Prévia</label>
          <input
            type="text"
            id='experienciaprevia'
            placeholder='Insira aqui sua experiência prévia'
            className='peer text-white bg-transparent w-full py-3 rounded-full border transition-colors duration-200 ease-in-out border-gray-400 px-4  placeholder:text-sm placeholder-white  focus:border-secondary-1 focus:outline-none'
          />
        </div>

        <div className='col-span-2 flex flex-col justify-center items-center mt-10'> 
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
