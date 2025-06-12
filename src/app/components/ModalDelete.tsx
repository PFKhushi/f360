import Logo from "./Logo";
import ModalBase from "./shared/ModalBase";

type ModalDeleteProps = {
  openModal: boolean,
  setOpenModal: (open: boolean) => void
  title: string
}

export default function ModalDelete({ openModal, setOpenModal, title }: ModalDeleteProps) {
  return (
    <ModalBase
      openModal={openModal}
      setOpenModal={setOpenModal}
      className='h-[310px] w-[500px] rounded-[10px] bg-[#2C2C2C] text-white'
      viewCloseButton={false}
    >
      <div className='px-5 flex flex-col gap-4'>
        <div className='pl-2'>
          <div className='w-20'>
            <Logo />
          </div>
        </div>
        <p className='text-[22px] pl-2'>{title}</p>
        <div className='bg-white h-[5px] w-full' />
        <div className='flex justify-end gap-4 pt-3 pr-2'>
          <button
            onClick={() => setOpenModal(false)}
            className='py-4 px-14 rounded-[20px] bg-secondary-2 hover:bg-secondary-1 cursor-pointer'
          >
            Não
          </button>
          <button className='py-4 px-14 rounded-[20px] bg-[#FFAD3B]/50 hover:bg-[#a57376] cursor-pointer'>
            Sim
          </button>
        </div>
      </div>
    </ModalBase>
  )
}