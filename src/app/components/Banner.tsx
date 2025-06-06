'use client'

import React, { useState } from 'react'
import LogoAnimationBanner from './LogoAnimationBanner'
import { ReactTyped } from 'react-typed'

export default function Banner() {

  const [start, setStart] = useState<boolean>(false)

  return (
    <section className="relative flex w-full h-140 md:h-160 bg-cover bg-center bg-[url('/images/banner.png')] pt-16 md:pt-24 overflow-hidden">
    
      <div className='absolute w-1/2 h-full top-0 bg-linear-to-r from-primary-5 to-transparent to-10%'/>
      <div className='absolute w-1/2 h-full top-0 right-0 bg-linear-to-l from-primary-5 to-transparent to-10%'/>
      <div className='absolute w-full h-full top-0 right-0 bg-linear-to-t from-primary-4 to-transparent to-5%'/>

      <div className='flex flex-col-reverse md:flex-row justify-center w-full max-w-360 h-full mx-auto z-1'>

        <div className='flex items-center justify-center md:w-1/2 md:h-full'>
          <div className='flex flex-col gap-6 md:gap-10 text-white text-center md:text-left max-w-100 md:max-w-85 px-2'>
            <p className='text-2xl md:text-4xl font-coolvetica'>Onde capacitam-se futuros profissionais de trabalho na Unipê</p>
            <div className='text-xl font-louis-george-cafe'>
              <ReactTyped
                className='mr-1'
                strings={['O futuro do trabalho é']}
                typeSpeed={30}
                onComplete={(self) => {
                  self.cursor.className = 'hidden'
                  setStart(true)
                }}
              />
              {start && (
                <ReactTyped
                  strings={['agora.', 'hoje.', 'sempre.']}
                  typeSpeed={30}
                  backDelay={3000}
                  backSpeed={20}
                  loop
                />
              )}
            </div>
            {/* <p className='text-xl font-louis-george-cafe'>O futuro do trabalho é agora.</p> */}
          </div>
        </div>

        <div className='flex justify-center items-center md:w-1/2 md:h-full'>
          <div className='max-w-60 md:max-w-110 w-full h-full'>
            <LogoAnimationBanner/>
          </div>
        </div>

      </div>

    </section>
  )
}
