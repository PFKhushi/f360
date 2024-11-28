'use client'
import { DialogTitle } from '@headlessui/react'
import { Dispatch, SetStateAction, useState } from 'react'
import { PatchData } from '@/services/axios'
import toast from 'react-hot-toast'
import { User } from '@/@types'

interface BlockModalProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>
  userRefetch: () => void
  user?: User
}

export default function BlockUser({
  setIsOpen,
  userRefetch,
  user,
}: BlockModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  const handleBlock = () => {
    setIsLoading(true)
    PatchData({
      url: `/usuario/usuarios/${user?.id}/`,
      data: { is_active: !user?.is_active },
      onSuccess: () => {
        toast.success(
          `Usuário ${user?.is_active ? 'bloqueado' : 'desbloqueado'} com sucesso`,
        )
        userRefetch()
        closeModal()
      },
      onError: (error) => {
        toast.error(
          `Erro ao ${user?.is_active ? 'bloquear' : 'desbloquear'} usuário`,
        )
        console.error(
          `Erro ao ${user?.is_active ? 'bloquear' : 'desbloquear'} usuário`,
          error,
        )
      },
    })
    setIsLoading(false)
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
        <div>
          <h2 className="text-3xl font-semibold py-5 text-white mt-10 px-10 text-center">
            Deseja mesmo {user?.is_active ? 'bloquear' : 'desbloquear'} o
            usuário {user?.nome}?
          </h2>
          <div className="text-start flex flex-col justify-end items-center gap-x-10 mt-8">
            <div className="w-full flex flex-wrap gap-4 justify-center items-center mt-7">
              <button
                onClick={closeModal}
                className="bg-light-grey py-4 px-10 xl:px-12  text-lg whitespace-nowrap text-dark-purple font-extrabold rounded-md shadow-md duration-200"
              >
                CANCELAR
              </button>
              <button
                onClick={handleBlock}
                className={`${!user?.is_active ? 'bg-green-500' : 'bg-red-500'} py-4 px-10 xl:px-12 text-lg whitespace-nowrap text-white font-extrabold rounded-md shadow-md hover:text-white duration-200`}
              >
                {isLoading
                  ? 'PROCESSANDO...'
                  : user?.is_active
                    ? 'BLOQUEAR'
                    : 'DESBLOQUEAR'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
