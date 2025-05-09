'use client'

import React, { useEffect, useState } from 'react'
import {z} from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '@/app/components/InputField';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isValidCnpjFormat, isValidPhoneFormat } from '@/app/utils/InputValidators';
import { cleanMasksNumeralDocuments, maskCNPJ, maskPhone } from '@/app/utils/InputMasks';
import { RegisterService } from '@/app/services/api/RegisterService';
import { MessageService } from '@/app/services/message/MessageService';
import ButtonSubmit from '@/app/components/shared/ButtonSubmit';

const schema = z.object({
  nome: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
  username: z
    .string()
    .email({message: 'Digite um email válido'}),
  password: z
    .string()
    .min(1, {message: "Preenchimento obrigatório"})
    .max(30, {message: "O campo não deve ter mais que 30 caracteres"})
    .refine((value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value), {message: 'A senha deve conter pelo menos, 8 caracteres, uma letra minúscula, uma maiúscula e um número'}),
  confirmPassword: z
    .string()
    .min(1, {message: "Preenchimento obrigatório"})
    .max(30, {message: "O campo não deve ter mais que 30 caracteres"}),
  telefone: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val.trim() === '' || isValidPhoneFormat(val),
      { message: 'Formato de telefone inválido' }
    ),
  cnpj: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'})
    .refine(isValidCnpjFormat, {message: "XX.XXX.XXX/XXXX-XX"}),
  representante: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
})
.refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas devem ser iguais.',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>

export default function Empresa() {

  const{
    register,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [isloading, setIsLoading] = useState<boolean>(false)
  const router = useRouter();

  async function handleRegister (data: FormData){
    console.log(data);

    setIsLoading(true)
    const response = await new RegisterService().registerEmpresa({
      usuario: {
        nome: data.nome,
        username: data.username,
        password: data.password,
        telefone: data.telefone,
      },
      cnpj: cleanMasksNumeralDocuments(data.cnpj),
      representante: data.representante
    })
    setIsLoading(false)

    const message = new MessageService()
    
    if(response){

      if(response.sucesso){
        message.success('Cadastro realizado com sucesso!')
        return router.push("/sign-in");
      }

      return response.detalhes.map(detalhe => {
        message.error(detalhe)
      })
      
    }

    return message.error('Erro ao buscar os dados.')
  }

  useEffect(() => {
    if(watch().telefone === ''){
      clearErrors('telefone')
    }

  }, [watch().telefone])

  return (
    <main className='flex items-center-safe justify-center-safe bg-primary-4 min-h-svh p-4 pb-8'>
      <div className='flex flex-col gap-8 md:gap-14 w-full max-w-[850px] bg-primary-2 rounded-2xl justify-center items-center px-4 md:px-6 py-4 drop-shadow-[0px_10px_0px] drop-shadow-secondary-2'>
        
        <div className='flex flex-col items-center gap-4 w-full'>
          <Link
            href={'/'}
            className='w-full max-w-50 md:max-w-60'
          >
            <picture>
              <img 
                src="/images/logos/branca-com-preenchimento/branco-com-preenchimento-letreiro-horizontal.png" 
                alt="Logo Fábrica de Software"
                className='w-full h-full object-contain'
              />
            </picture>
          </Link>
          <p className='text-white font-louis-george-cafe text-xl md:text-2xl text-center'>
            Venha registrar as suas demandas
          </p>
          <div className="bg-white h-[1px] w-full max-w-[503px]" />
        </div>

        <form 
          className='grid md:grid-cols-2 gap-x-[80px] gap-y-4 w-full max-w-[750px]'
          onSubmit={handleSubmit(handleRegister)}
        >

          <InputField
            id="nome"
            label="Nome da Empresa"
            placeholder='Digite o nome da empresa...'
            register={register('nome')}
            error={errors.nome}
          />

          <InputField
            id="cnpj"
            label="CNPJ"
            placeholder='Digite seu cpf aqui...'
            register={register('cnpj', {onChange(event) {
              setValue('cnpj', maskCNPJ(event.target.value))
            },})}
            error={errors.cnpj}
          />

          <InputField
            id="representante"
            label="Nome do representante"
            placeholder='Digite o nome aqui...'
            register={register('representante')}
            error={errors.representante}
          />

          <InputField
            id="email"
            label="Email (Login)"
            placeholder='Digite seu email (login) aqui...'
            register={register('username')}
            error={errors.username}
          />

          <div className='col-span-2 flex'>
            <div className='w-full max-w-[335px]'>
              <InputField
                id="telefone"
                label="Telefone"
                placeholder='Digite seu telefone aqui...'
                register={register('telefone', {onChange(event) {
                  setValue('telefone', maskPhone(event.target.value))
                },})}
                error={errors.telefone}
              />
            </div>
          </div>

          <InputField
            id="password"
            type='password'
            label= "Senha"
            placeholder='Digite uma senha...'
            register={register('password')}
            error={errors.password}
          />

          <InputField
            id="confirmPassword"
            type='password'
            label= "Confirmar Senha"
            placeholder='Confirme a senha...'
            register={register('confirmPassword')}
            error={errors.confirmPassword}
          />

          <div className="col-span-2 flex flex-col items-center gap-4 mt-6">
            <ButtonSubmit
              isLoading={isloading}
              label='Cadastrar-se'
            />
            <Link
              href={'/sign-in'}
              className="text-white font-light text-base md:text-[18px] underline"
            >
              Já é cadastrado? Entre aqui
            </Link>
          </div>

        </form>

      </div>
    </main>
  )
}