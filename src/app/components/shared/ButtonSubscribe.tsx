"use client";

import React, { useState } from "react";
import ModalBase from "./ModalBase";
import Logo from "../Logo";

export default function ButtonSubscribe({ status }: { status: string }) {
  const [openModal, setOpenModal] = useState(false);

  const changeModal = () => {
    if (status === "Inscrever-se") setOpenModal(true);
  };

  return (
    <div>
      <div className='xl:min-w-[120px]'>
        <button
          onClick={changeModal}
          className={`${
            status === "Inscrever-se"
              ? 'bg-secondary-2  cursor-pointer hover:bg-secondary-1'
              : 'bg-[#FFAD3BCF] italic'
          } w-full xl:py-2 xl:px-4 p-2 rounded-[15px] `}
        >
          {status}
        </button>
      </div>
      <ModalBase
        openModal={openModal}
        setOpenModal={setOpenModal}
        className='h-[310px] w-[500px] rounded-[10px] bg-primary-1 text-white'
        viewCloseButton={false}
      >
        <div className='px-5 flex flex-col gap-4'>
          <div className='pl-2'>
            <div className='w-20'>
              <Logo />
            </div>
          </div>
          <p className='text-[22px] pl-2'>Deseja se inscrever nessa imersão?</p>
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
    </div>
  );
}
