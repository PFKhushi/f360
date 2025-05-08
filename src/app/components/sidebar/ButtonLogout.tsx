'use client'

import React, { useState } from 'react'
import ButtonTooltip from '../shared/ButtonTooltip'
import ModalBase from '../shared/ModalBase'
// import { useAuth } from '@/app/context/useAuth'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge';
import { LuDoorOpen } from 'react-icons/lu';
import { useAuth } from '@/app/context/useAuth'

export default function ButtonLogout({hideMenu}: {hideMenu: boolean}) {

  const [openModal, setOpenModal] = useState<boolean>(false)

  const { clearAuth } = useAuth()
  const router = useRouter()
    

  function handleOnClick(){
    setOpenModal(true)
  }

  function Logout(){
    clearAuth();
    router.push('/sign-in');
    return router.refresh();
  }

  return (
    <>
      <ButtonTooltip
        tooltipTitle=''
        onClick={handleOnClick}
        icon={LuDoorOpen}
        className='flex items-center gap-2.5 text-xl text-white hover:bg-secondary-1 h-18 px-3 bg-primary-2 drop-shadow-[0px_-2px_4px] drop-shadow-black/25'
        classNameIcon='min-w-8 min-h-8'
      >
        <span className={twMerge(
          'text-nowrap',
          !hideMenu ? 'block' : 'hidden'
        )}>
          Sair
        </span>
      </ButtonTooltip>

      <ModalBase
        openModal={openModal}
        setOpenModal={setOpenModal}
        viewCloseButton={false}
        className='max-w-100'
      >
        <div className='flex flex-col gap-4 items-center w-full pb-3'>
          <span className='font-bold text-lg text-center'>Deseja sair do sistema?</span>
          <div className='flex justify-center flex-wrap gap-4'>
            <button
              onClick={() => setOpenModal(false)}
              className='bg-primary-1 text-white px-4 py-2 w-26 cursor-pointer rounded-xl hover:bg-primary-3 transition font-semibold shadow-[2px_2px_3px_rgb(0,0,0,0.2)]'
            >
              Cancelar
            </button>
            <button
              onClick={Logout}
              className='bg-secondary-2 text-red-800 px-4 py-2 w-26 cursor-pointer rounded-xl hover:bg-secondary-1 transition font-semibold shadow-[2px_2px_3px_rgb(0,0,0,0.2)]'
            >
              Sair
            </button>
          </div>
        </div>
      </ModalBase>
    </>
  )
}
