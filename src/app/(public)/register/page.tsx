import React from 'react'
import Link from 'next/link'

export default function Register(){
  return (
    <div className='h-screen flex justify-center items-center bg-gradient-to-b from-primary-1 to-primary-5'>
      <div className='flex flex-col items-center justify-between md:bg-primary-4 h-screen md:w-[669px] md:h-[552px] drop-shadow-[10px_10px_4px] drop-shadow-black/25 rounded-[20px] text-white p-[20px]'>
        <picture>
          <img
            src="images/logos/branca-com-preenchimento/branco-com-preenchimento-letreiro-horizontal.png"
            alt="Logo Fábrica de Software"
            className='w-[335px] h-[127px]' 
          />
        </picture>
        <p className='text-center font-louis-george-cafe text-[24px]'>Seja bem-vindo à Fábrica de Software</p>
        <div className='w-[300px] sm:w-[503px] h-[1px] bg-white' />
        <p className='text-center font-roboto text-[24px]'>Qual a classificação do seu perfil?</p>
        <div className='font-roboto pb-[35px] text-[24px] flex flex-col md:flex-row md:pt-[15px] gap-[50px]'>
          <Link href={'/register/participante'}>
            <div className='flex justify-center items-center bg-primary-1 w-[220px] h-[120px] drop-shadow-[5px_5px_4px] drop-shadow-secondary-2 rounded-[20px] transition duration-300 active:translate-x-[3px] active:translate-y-[3px] active:drop-shadow-[1px_1px_4px]'>
                Participante
            </div>
          </Link>
          <Link href={'/register/empresa'}>
            <div className='flex justify-center items-center bg-primary-1 w-[220px] h-[120px] drop-shadow-[5px_5px_4px] drop-shadow-secondary-2 rounded-[20px] transition duration-300 active:translate-x-[3px] active:translate-y-[3px] active:drop-shadow-[1px_1px_4px]'>
                Empresa
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
