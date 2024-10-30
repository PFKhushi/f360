'use client'
import Image from 'next/image'

export default function Confirmacao() {
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
      <div className="flex flex-col md:flex-row items-center justify-center  ">
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
      <p className="text-center  md:text-xl font-semibold">
        Você está cadastrado na imersão da Fábrica de <br /> Software, acompanhe
        seu email para ficar por dentro <br /> das notícias.
      </p>
    </div>
  )
}
