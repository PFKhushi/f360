'use client'

import React, { useState } from 'react'
import ButtonTooltip from '../shared/ButtonTooltip'
// import { IconPower } from '@tabler/icons-react'
import { IoPower } from "react-icons/io5";
import ModalBase from '../shared/ModalBase'
// import { useAuth } from '@/app/context/useAuth'
import { useRouter } from 'next/navigation'

export default function ButtonLogout() {

  const [openModal, setOpenModal] = useState<boolean>(false)

  // const { clearAuth } = useAuth()
  const router = useRouter()
    

  function handleOnClick(){
    setOpenModal(true)
  }

  function Logout(){
    // clearAuth();
    //router.push('/sign-in');
    return router.refresh();
  }

  return (
    <>
      <ButtonTooltip
        tooltipTitle='Sair do Sistema'
        icon={IoPower}
        onClick={handleOnClick}
        size={24}
        className='hover:text-tertiary'
      />

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
              className='bg-quinary text-primary px-4 py-2 w-26 cursor-pointer rounded-bl-xl rounded-tr-xl hover:bg-primary hover:text-quinary transition font-semibold shadow-[2px_2px_3px_rgb(0,0,0,0.2)]'
            >
              Cancelar
            </button>
            <button
              onClick={Logout}
              className='bg-quinary text-tertiary px-4 py-2 w-26 cursor-pointer rounded-bl-xl rounded-tr-xl hover:bg-tertiary hover:text-quinary transition font-semibold shadow-[2px_2px_3px_rgb(0,0,0,0.2)]'
            >
              Sair
            </button>
          </div>
        </div>
      </ModalBase>
    </>
  )
}
