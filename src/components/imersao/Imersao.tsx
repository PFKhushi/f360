'use client'
import { Path, PathValue } from 'react-hook-form'
import Radio from './RadioGroup/RadioGroup'
import Image from 'next/image'

export default function Imersao() {
  return (
    <div className='pb-12'>
    <div className='pt-8'>
      <Image
          src="/img/LOGO-ROXA-LETREIRO-HORIZONTAL1.png"
          alt="Logo"
          width={320}
          height={147}
          className="m-auto mt-8 "
      />  
      </div>
      <div>
        <div className='flex flex-col items-center justify-center space-y-8 md:space-x-28 lg:space-x-64 md:space-y-0 md:flex-row mt-12'>
          <div>
          <p className='font-bold text-xl md:text-2xl mb-3'>Função</p>
          <input type="text" placeholder=' Escolha sua função' className='w-80 md:w-72 lg:w-96 h-9 rounded-md text-black' />
          </div>
          <div>
            <p className='font-bold text-xl md:text-2xl mb-3' >Período</p>
            <input type="text" placeholder=' Escolha seu período' className='w-80 md:w-72 lg:w-96 h-9 rounded-md text-black' />
          </div>
        </div>
      </div>
      <h1 className='text-lg ml-[11%] md:ml-[11%] lg:ml-[16%] mt-8 mb-8'>Habilidades</h1>
      <div>
      <Radio
            label={'Next.js & React'}
            setValue={console.log}
            name={[]}
            errorText={''}
      ></Radio>
      <Radio
          label={'Python & Django'}
          setValue={console.log}
          name={[]}
          errorText={''}
       ></Radio>
      <Radio
          label={'Java & Spring'}
          setValue={console.log}
          name={[]}
          errorText={''}
      ></Radio>
      </div>
      <h1 className='text-secondary bg-light-grey flex items-center justify-center m-auto w-40 h-8 rounded-md mt-8'>INSCREVER-SE</h1> 
    </div>
  )
}
