"use client";

import React, { useState } from "react";
import ModalForm from "../ModalForm";

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
      <ModalForm openModal={openModal} setOpenModal={setOpenModal}/>
    </div>
  );
}
