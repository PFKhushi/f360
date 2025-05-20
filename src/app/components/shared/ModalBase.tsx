import { Backdrop, Fade, Modal } from '@mui/material'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import ModalBaseCloseButton from './ModalBaseCloseButton'

type ModalBaseProps = {
  openModal: boolean,
  setOpenModal: (open: boolean) => void,
  children: React.ReactElement,
  titleTooltip?: string,
  className?: string,
  viewCloseButton?: boolean,
}

export default function ModalBase({openModal, setOpenModal, children, titleTooltip, className, viewCloseButton = true}: ModalBaseProps) {
  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 150,
        },
      }}
      className={twMerge(
        'flex p-4',
        'overflow-auto scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full',
        'transition scrollbar-thumb-primary-5 hover:scrollbar-thumb-primary-4 scrollbar-track-secondary-1/50 scrollbar-track-rounded-full',
      )}
    >
      <Fade in={openModal}>
        <div className={twMerge(
          "relative px-3 pb-3 pt-5 w-full max-w-3xl mx-auto my-auto bg-white rounded-2xl",
          className
        )}>
          {viewCloseButton && (
            <ModalBaseCloseButton
              titleTootip={titleTooltip ? titleTooltip : 'Fechar'}
              setOpenModal={setOpenModal}
            />
          )}
          {children}
        </div>
      </Fade>
    </Modal> 
  )
}