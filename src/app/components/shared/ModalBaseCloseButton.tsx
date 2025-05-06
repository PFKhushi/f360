import { Tooltip } from '@mui/material'
// import { IconX } from '@tabler/icons-react'
import { IoClose } from "react-icons/io5";
import React from 'react'

type ModalBaseCloseButtonProps = {
  titleTootip: string,
  setOpenModal: (open: boolean) => void,
}

export default function ModalBaseCloseButton({titleTootip, setOpenModal}: ModalBaseCloseButtonProps) {
  return (
    <Tooltip title={titleTootip} className='absolute top-2 right-2' placement='top' arrow>
      <button
        type='button'
        className='cursor-pointer text-tertiary bg-inherit rounded-full p-2 transition hover:text-quinary hover:bg-tertiary text-nowrap'
        onClick={() => setOpenModal(false)}
      >
        <div className='flex items-center gap-1 justify-center'>
          <IoClose />
        </div>
      </button>
    </Tooltip>
  )
}
