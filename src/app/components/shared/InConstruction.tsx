'use client'

import React from 'react'
import { IoIosConstruct } from "react-icons/io";
import { ReactTyped } from "react-typed";

export default function InConstruction() {
  return (
    <div className='flex justify-center items-center grow'>
      <div className='flex flex-col items-center gap-10 font-medium text-3xl text-primary-3 text-shadow-[2px_2px_4px] text-shadow-black/25'>
        <ReactTyped
        strings={['Página em construção']}
        typeSpeed={40}
      backSpeed={20}
      backDelay={3000}
      loop
        />
        
        {/* <h1>Página em construção</h1> */}
        <IoIosConstruct
          className='w-30 h-30 animate-bounce duration-500 drop-shadow-[4px_4px_3px] drop-shadow-black/50'
        />
      </div>
    </div>
  )
}
