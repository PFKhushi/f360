'use client'
import Link from 'next/link'
import React from 'react'
import { FaBars, FaUsers } from 'react-icons/fa'
import { HiOutlineHome } from 'react-icons/hi'
import { LuUserCircle2 } from 'react-icons/lu'
import { MdExitToApp } from 'react-icons/md'
import { signOut, useSession } from 'next-auth/react'
import ButtonNav from './ButtonNav'
import { useRouter } from 'next/navigation'

type PropsNavBar = {
  click: boolean
  navbar: () => void
  closeNav: () => void
}

export default function NavBar({ click, navbar, closeNav }: PropsNavBar) {
  const router = useRouter()

  function singOutt() {
    signOut({
      redirect: false,
    })

    if (router) {
      router.push('/')
    }
  }

  const session = useSession()
  const cargo = session?.data?.user?.cargo

  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-10 h-screen -translate-x-full md:translate-x-0 transition-all delay-75  scale-x-100 ${
        click ? 'w-[14.5rem]' : 'w-16 '
      } text-sm bg-dark-blackpurple cursor-pointer`}
      aria-label="Sidebar"
    >
      <div className="h-full flex flex-col justify-between px-2 py-4 overflow-y-auto bg-dark-blackpurple">
        <ul
          className={`space-y-2 font-medium ${
            click ? '' : 'flex flex-col items-center'
          }`}
        >
          <li onClick={navbar} className={`${click ? 'flex justify-end' : ''}`}>
            <FaBars className="w-5 h-5 text-white hover:text-light-grey" />
          </li>

          <ButtonNav
            click={click}
            closeNav={closeNav}
            title="Inicio"
            href="/acesso/inicio"
            icon={<HiOutlineHome className="w-5 h-5" />}
          />

          {cargo === 'GESTOR' && (
            <ButtonNav
              click={click}
              closeNav={closeNav}
              title="Usuários"
              href="/acesso/usuarios"
              icon={<FaUsers className="w-5 h-5" />}
            />
          )}
        </ul>

        <ul
          className={`space-y-2 font-medium border-t pt-2  mt-4 ${
            click ? '' : 'flex flex-col items-center'
          }`}
        >
          <li>
            <Link
              href="/acesso/meu-perfil"
              className="flex items-center p-2 text-white hover:text-light-grey font-bold rounded-lg hover:bg-light-purple group transition-all delay-100"
            >
              <LuUserCircle2 className=" w-5 h-5" />
              <span
                className={`flex-1 ml-1 whitespace-nowrap  ${
                  click ? '' : 'hidden'
                }`}
              >
                Meu Perfil
              </span>
            </Link>
          </li>

          <li>
            <button
              onClick={singOutt}
              className="flex items-center p-2 text-white hover:text-light-grey font-bold rounded-lg hover:bg-light-purple group transition-all delay-100"
            >
              <MdExitToApp className=" w-5 h-5" />
              <span
                className={`flex-1 ml-1 whitespace-nowrap  ${
                  click ? '' : 'hidden'
                }`}
              >
                Sair
              </span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  )
}
