'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function Confirmacao() {
  return (
    <div className="pb-12 flex flex-col justify-center items-center">
      <div className="pt-8">
        <Image
          src="/img/LOGO-ROXA-LETREIRO-HORIZONTAL1.png"
          alt="Logo"
          width={320}
          height={147}
          className="m-auto mt-8 "
        />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <h1 className="text-accent font-bold text-5xl mt-14 md:mt-8 ">
          PARABÉNS!
        </h1>
        <Image
          src="/img/developer_male.png"
          alt="Logo"
          width={320}
          height={147}
          className="md:mt-8 "
        />
      </div>
      <p className="text-center  md:text-xl font-semibold max-w-96">
        Você está cadastrado na imersão da Fábrica de Software, acompanhe seu
        email para ficar por dentro das notícias.
      </p>

      <Link
        href={'/acesso/inicio/'}
        className="text-light-purple font-bold text-xl max-w-80 text-center bg-light-grey hover:text-white hover:bg-yellow-400 active:bg-yellow-500 transitions duration-200 flex items-center justify-center m-auto p-4 rounded-md mt-8"
      >
        VOLTAR PARA O INÍCIO
      </Link>
    </div>
  )
}
