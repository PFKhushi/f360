'use client'

import { User } from '@/@types'
import { DialogTitle } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'

interface UpdateModalProps {
  user: User | null
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export default function ChangeUser({ user, setIsOpen }: UpdateModalProps) {
  function closeModal() {
    setIsOpen(false)
  }

  return (
    <div>
      <DialogTitle>
        <div className="text-end text-lg font-medium leading-6 text-light-grey absolute right-4 top-4">
          <button
            type="button"
            className="mx-4 sm:mr-6 mt-7 2xl:mr-10 2xl:mt-10 inline-flex justify-center rounded-md border border-transparent bg-light-grey px-4 py-2 text-sm font-bold text-dark-purple hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={closeModal}
          >
            X
          </button>
        </div>
      </DialogTitle>
      <div className="mt-2">
        <div className="mx-auto sm:px-2 lg:py-2">
          <div className="mx-auto max-w-4xl">
            <div className="mb-16 mt-28 text-start md:flex md:flex-row items-center gap-x-10">
              <h2 className="max-[420px]:text-2xl font-semibold py-5 text-white text-3xl md:text-4xl -mt-10 md:-mt-20">
                Editar usuário {user?.nome}
              </h2>
            </div>

            <div className="rounded-x relative mt-1 w-full">
              <form>
                <div></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
