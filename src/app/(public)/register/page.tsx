import React from 'react'
import Link from 'next/link'

export default function Register(){
  return (
    <div className='min-h-dvh flex justify-center items-center bg-gradient-to-b from-primary-1 to-primary-5 py-4'>
      <div className='flex flex-col items-center gap-10 md:bg-primary-4 drop-shadow-[10px_10px_4px] drop-shadow-black/25 rounded-[20px] text-white md:py-9 px-4 md:px-14'>
        
        <div className='flex flex-col items-center gap-8'>
          <Link
            className='max-w-84'
            href={'/'}
          >
            <picture>
              <img
                src="images/logos/branca-com-preenchimento/branco-com-preenchimento-letreiro-horizontal.png"
                alt="Logo Fábrica de Software"
                className='w-full h-full object-contain' 
              />
            </picture>
          </Link>
          <p className='text-center font-louis-george-cafe text-xl md:text-[24px]'>Seja bem-vindo à Fábrica de Software</p>
          <div className='w-full max-w-[503px] h-[1px] bg-white' />
          <p className='text-center text-xl md:text-[24px]'>Qual a classificação do seu perfil?</p>
        </div>
       
        <div className='text-xl md:text-[24px] flex flex-col md:flex-row gap-[50px] pb-10'>
          <Link href={'/register/participante'}>
            <div className='flex justify-center items-center bg-primary-1 w-44 md:w-55 h-24 md:h-30 drop-shadow-[5px_5px_4px] drop-shadow-secondary-2 rounded-[20px] transition duration-300 active:translate-[3px] active:drop-shadow-[1px_1px_4px]'>
                Participante
            </div>
          </Link>
          <Link href={'/register/empresa'}>
            <div className='flex justify-center items-center bg-primary-1 w-44 md:w-55 h-24 md:h-30 drop-shadow-[5px_5px_4px] drop-shadow-secondary-2 rounded-[20px] transition duration-300 active:translate-[3px] active:drop-shadow-[1px_1px_4px]'>
                Empresa
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
