/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import Image from 'next/image'

import NavBar from './NavBar'
import NavBarMobile from './NavBarMobile'

export default function Header(props: any) {
  const [click, setClick] = React.useState(false)

  function navbar() {
    setClick(!click)
  }

  function closeNav() {
    setClick(false)
  }
  return (
    <main className="relative">
      <nav className="z-10 fixed top-0 right-0 flex items-center justify-center w-full py-2 bg-background-primary bg-dark-blackpurple">
        <NavBarMobile />
        <div
          className={`text-center flex gap-8 py-1 items-center transition-all delay-100 ${
            click ? 'md:ml-60' : 'md:ml-16'
          }`}
        >
          <Image
            src="/img/LOGO-ROXA-LETREIRO-HORIZONTAL1.png"
            alt="Logo"
            width={200}
            height={72}
            className="object-contain"
          />
        </div>
      </nav>

      <NavBar click={click} navbar={navbar} closeNav={closeNav} />

      <div
        className={`px-4 py-10 bg-light-grey transition-all delay-100 ${
          click ? 'md:ml-[14.5rem]' : 'md:ml-16'
        }`}
      >
        <div className="mt-14">{props.children}</div>
      </div>
    </main>
  )
}
