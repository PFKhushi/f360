import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="p-4">
      <div className="flex flex-col justify-center items-center py-20 gap-8">
        <Image
          src="/img/LOGO-ROXA-LETREIRO-HORIZONTAL.png"
          alt="Logo"
          width={400}
          height={147}
          className=""
        />
        <h1 className="text-4xl font-bold text-center text-dark-blackpurple">
          Bem-vindo ao Software Fábrica 360
        </h1>
        <div>
          <Link
            href="/acesso/usuarios"
            className="bg-light-purple py-5 px-12 xl:px-20 text-xl whitespace-nowrap text-white font-extrabold rounded-md shadow-md hover:text-white hover:bg-dark-purple active:bg-dark-purple duration-200"
          >
            Acessar Usuários
          </Link>
        </div>
      </div>
    </main>
  )
}
