import { Dialog, Transition } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'
import { Dispatch, Fragment, SetStateAction } from 'react'

type Props = {
  children: React.ReactNode
  isOpen: boolean
  setModalOpened: Dispatch<SetStateAction<boolean>>
  className?: string
}

export default function Modal({
  children,
  isOpen,
  setModalOpened,
  className,
}: Props) {
  function closeModal() {
    setModalOpened(false)
  }

  return (
    <>
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

          <div className="fixed inset-0 w-auto overflow-y-auto">
            <div className="flex min-h-full min-w-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={twMerge(
                    'w-full transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all bg-dark-purple',
                    className,
                  )}
                >
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
