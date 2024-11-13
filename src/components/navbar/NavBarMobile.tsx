'use client'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { FaBars, FaUsers } from 'react-icons/fa'
import { HiOutlineHome } from 'react-icons/hi'
import { LuUserCircle2 } from 'react-icons/lu'
import { MdExitToApp } from 'react-icons/md'
import ButtonNavMobile from './ButtonNavMobile'
import { IoMdClose } from 'react-icons/io'
import { useRouter } from 'next/navigation'

export default function NavBarMobile() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  function singOutt() {
    signOut({
      redirect: false,
    })

    if (router) {
      router.push('/')
    }
  }

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className="inset-0 flex ">
        <button
          type="button"
          onClick={openModal}
          className="flex md:hidden items-center rounded-lg transition-all delay-100 mr-2 gap-12 p-6 text-white text-base font-semibold hover:bg-light-purple"
        >
          <FaBars className="w-5 h-5 text-white hover:text-light-grey" />
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#1D1D1B] bg-opacity-70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full mx-6 2xl:max-w-5xl xl:max-w-4xl lg:max-w-3xl md:max-w-xl max-w-lg transform overflow-hidden rounded-2xl bg-[#0B4279]  text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-3xl font-medium leading-6 text-white"
                  ></Dialog.Title>
                  <div className="flex  w-full">
                    <div className="w-full">
                      <div className="h-full flex flex-col px-2 py-4 overflow-y-auto bg-dark-blackpurple">
                        <ul className="space-y-2 font-medium flex w-full flex-col items-center pt-6 mt-2">
                          <li
                            onClick={closeModal}
                            className="absolute right-4 top-4 flex justify-center items-center text-red-600 font-bold text-xl cursor-pointer bg-white bg-opacity-90 h-8 w-8 rounded-md"
                          >
                            <IoMdClose />
                          </li>
                          <ButtonNavMobile
                            closeModal={closeModal}
                            title="Inicio"
                            href="/acesso/inicio"
                            icon={<HiOutlineHome className="w-5 h-5" />}
                          />
                          <ButtonNavMobile
                            closeModal={closeModal}
                            title="Usuários"
                            href="/acesso/usuarios"
                            icon={<FaUsers className="w-5 h-5" />}
                          />
                        </ul>

                        <ul className="space-y-2 font-medium border-t pt-2 mt-4 ">
                          <li>
                            <Link
                              href="/acesso/meu-perfil"
                              className="flex items-center p-2 text-white hover:text-light-grey font-bold rounded-lg hover:bg-light-purple group transition-all delay-100"
                            >
                              <LuUserCircle2 className=" w-5 h-5" />
                              <span className="flex-1 ml-1 whitespace-nowrap">
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
                              <span className="flex-1 ml-1 whitespace-nowrap">
                                Sair
                              </span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
