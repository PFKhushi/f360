'use client'
import { FiChevronDown } from 'react-icons/fi'
import Radio from './RadioGroup/RadioGroup'
import Image from 'next/image'
import InputText from '../Inputs/InputText'
import InputSelect from '../Inputs/InputSelect'

export default function Imersao() {
  return (
    <div className="pb-12">
      <div className="pt-8">
        <Image
          src="/img/LOGO-ROXA-LETREIRO-HORIZONTAL1.png"
          alt="Logo"
          width={320}
          height={147}
          className="m-auto mt-8 "
        />
      </div>
      <div className="flex justify-center items-center">
        <div className="flex flex-col items-center justify-center md:grid grid-cols-2 md:gap-8 mt-12">
          <InputText
            label="Função"
            placeholder="Escolha sua função"
            type="text"
          />
          <InputText
            label="Período"
            placeholder="Escolha sua período"
            type="text"
          />
          <InputSelect label="Função">
            <option value="Back-End">Back-End</option>
            <option value="Front-End">Front-End</option>
            <option value="Dados">Dados</option>
            <option value="Dados">PO</option>
          </InputSelect>
        </div>
      </div>
      <div className="flex items-center">
        <h1 className="  text-lg ml-[11%] md:ml-[11%] lg:ml-[16%] mt-8 mb-8 font-bold">
          Habilidades
        </h1>
        <FiChevronDown className="ml-2 h-8 w-8 transform scale-125 " />
      </div>
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
      <button className="text-secondary font-bold text-xl bg-light-grey flex items-center justify-center m-auto p-4 rounded-md mt-8">
        INSCREVER-SE
      </button>
    </div>
  )
}
