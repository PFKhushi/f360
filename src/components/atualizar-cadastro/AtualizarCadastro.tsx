import Image from 'next/image'
import InputText from '../Inputs/InputText'
export default function AtualizarCadastro() {
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
      <div className='flex flex-col md:flex-row justify-center items-center md:space-x-12 mt-14 space-y-16 md:space-y-0'>
        <InputText
            label="RGM"
            placeholder="Insira seu RGM"
            type="text"
         />
         <InputText
            label="CPF"
            placeholder="Insira seu CPF"
            type="text"
         />
      </div>
      <div className='flex flex-col md:flex-row justify-center items-center md:space-x-12 mt-14 space-y-16 md:space-y-0'>
        <InputText
            label="Telefone"
            placeholder="Insira seu telefone"
            type="text"
         />
         <InputText
            label="Curso"
            placeholder="Insira seu Curso"
            type="text"
         />
      </div>
      <button className="text-secondary font-bold text-xl bg-light-grey flex items-center justify-center m-auto p-4 rounded-md mt-28 md:w-60">
        ATUALIZAR
      </button>
    </div>
  )
}
