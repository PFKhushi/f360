'use client'

import React, { useEffect, useState } from 'react'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import InputField from '@/app/components/InputField';
import SelectField from '@/app/components/SelectField';
// import TextareaField from '@/app/components/TextArea';
import Link from 'next/link';
import { cleanMasksNumeralDocuments, maskCPF, maskPhone, maskRGM } from '@/app/utils/InputMasks';
import { isValidCpfFormat, isValidPhoneFormat, isValidRGMFormat } from '@/app/utils/InputValidators';
import { RegisterService } from '@/app/services/api/RegisterService';
import { MessageService } from '@/app/services/message/MessageService';
import { useRouter } from 'next/navigation';
import ButtonSubmit from '@/app/components/shared/ButtonSubmit';

const schema = z.object({
  nome: z
    .string()
    .min(1, {message: 'Preenchimento obrigatório'}),
  username: z
    .string()
    .email({message: 'Digite um email válido'}),
  email_institucional: z
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
  cpf: z
    .string()
    .min(1, {message: 'Preenchimento Obrigatório'})
    .refine(isValidCpfFormat, {message: "XXX.XXX.XXX-XX"}),
  rgm: z
    .string()
    .refine(isValidRGMFormat, {message: 'RGM possui 8 dígitos'}),
    // .max(8, {message: 'RGM possui 8 números'}),
  curso: z
    .string()
    .min(1, { message: 'Selecione um curso' }),
  outro_curso: z
    .string()
    .optional(),
  periodo: z
    .string()
    .min(1, {message: 'Selecione um período'})
    .transform((num) => Number(num)),
  // experienciaprevia: z
  //   .string()
  //   .optional(),
})
.refine((data) => {
  if(data.curso === 'OTR'){
    return data.outro_curso && data.outro_curso.trim() !== '';
  }
  return true;
},{
  message: 'Informe o nome do curso',
  path: ['outro_curso'],
})
.refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas devem ser iguais.',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>

export default function Participante() {

  const{
    register,
    watch,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      outro_curso: ''
    }
  });

  const [isloading, setIsLoading] = useState<boolean>(false)
  const router = useRouter();

  async function handleRegister(data: FormData){
    
    setIsLoading(true)
    const response = await new RegisterService().registerParticipante({
      usuario: {
        nome: data.nome,
        username: data.username,
        password: data.password,
        telefone: data.telefone,
      },
      cpf: cleanMasksNumeralDocuments(data.cpf),
      rgm: data.rgm,
      curso: data.curso,
      outro_curso: data.outro_curso,
      periodo: data.periodo,
      email_institucional: data.email_institucional
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

    if(watch().curso !== 'OTR'){
      setValue('outro_curso', '')
    }
  }, [watch().telefone, watch().curso])

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
            Venha participar do  processo de imersão
          </p>
          <div className="bg-white h-[1px] w-full max-w-[503px]" />
        </div>

        <form 
          className='grid md:grid-cols-2 gap-x-[80px] gap-y-4 w-full max-w-[750px]'
          onSubmit={handleSubmit(handleRegister)}
        >
          <InputField
            id="nome"
            label="Nome completo"
            placeholder='Digite seu nome aqui...'
            register={register('nome')}
            error={errors.nome}
          />

          <InputField
            id="cpf"
            label="CPF"
            placeholder='Digite seu cpf aqui...'
            register={register('cpf', {onChange(event) {
              setValue('cpf', maskCPF(event.target.value))
            },})}
            error={errors.cpf}
          />

          <InputField
            id="email"
            label="Email (Login)"
            placeholder='Digite seu email (login) aqui...'
            register={register('username')}
            error={errors.username}
          />

          <InputField
            id="email_institucional"
            label="Email Institucional"
            placeholder='Digite seu email institucional aqui...'
            register={register('email_institucional')}
            error={errors.email_institucional}
          />

          <InputField
            id="rgm"
            label="Matricula (RGM)"
            placeholder='Digite sua matricula aqui...'
            register={register('rgm', {onChange(event) {
              setValue('rgm', maskRGM(event.target.value))
            },})}
            error={errors.rgm}
          />

          <InputField
            id="telefone"
            label="Telefone"
            placeholder='Digite seu telefone aqui...'
            register={register('telefone', {onChange(event) {
              setValue('telefone', maskPhone(event.target.value))
            },})}
            error={errors.telefone}
          />

          {/* <InputField
              id="periodo"
              label="Periodo"
              placeholder='Digite seu período aqui...'
              register={register('periodo')}
              error={errors.periodo}
          /> */}

          <SelectField
            id = "periodo"
            label = "Período"
            placeholder='Selecione um período...'
            register={register('periodo')}
            error = {errors.periodo}
            defaultValue = ""
            options = {[
              {value: 1, label: "1°"},
              {value: 2, label: "2º"},
              {value: 3, label: "3º"},
              {value: 4, label: "4º"},
              {value: 5, label: "5°"},
              {value: 6, label: "6°"},
              {value: 7, label: "7º"},
              {value: 8, label: "8º"}
            ]}
          />

          <SelectField
            id = "curso"
            label = "Curso"
            placeholder='Selecione um curso...'
            register={register('curso')}
            error = {errors.curso}
            defaultValue = ""
            options = {[
              {value: "ADS", label: "Análise e Desenvolvimento de Sistemas"},
              {value: "CC", label: "Ciência da Computação"},
              {value: "CD", label: "Ciência de Dados"},
              // {value: "gti", label: "Gestão da Tecnologia da Informação"},
              {value: "redescomp", label: "Redes de Computadores"},
              // {value: "SI", label: "Sistemas para Internet"},
              {value: "OTR", label: "Outro"}
            ]}
          />

          {watch().curso === 'OTR' && (
            <div className="col-span-2 md:col-span-1 w-full">
              <InputField
                id="outro_curso"
                label= "Informe seu curso"
                placeholder='Digite o nome do curso...'
                register={register('outro_curso')}
                error={errors.outro_curso}
              />
            </div>
          )}

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

          {/* <div className='md:col-span-2'>
          <TextareaField
            id="experienciaprevia"
            label="Experiência Prévia"
            placeholder="Insira aqui sua experiência prévia"
            register={register}
          />
          </div> */}

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