import React from 'react'
import LogoAnimationBanner from './LogoAnimationBanner'

export default function Banner() {
  return (
    <section className="relative flex w-full h-120 md:h-160 bg-cover bg-center bg-[url('/images/banner.png')] pt-24">
    
      <div className='absolute w-1/2 h-full top-0 bg-linear-to-r from-primary-5 to-transparent to-10%'/>
      <div className='absolute w-1/2 h-full top-0 right-0 bg-linear-to-l from-primary-5 to-transparent to-10%'/>
      <div className='absolute w-full h-full top-0 right-0 bg-linear-to-t from-primary-4 to-transparent to-5%'/>

      <div className='flex w-full max-w-360 h-full mx-auto z-1'>

        <div className='hidden lg:flex items-center justify-center w-1/2 h-full'>
          <div className='flex flex-col gap-10 text-white max-w-85'>
            <p className='text-4xl font-coolvetica'>Onde capacitam-se futuros profissionais de trabalho na Unipê</p>
            <p className='text-xl font-louis-george-cafe'>O futuro do trabalho é agora.</p>
          </div>
        </div>

        <div className='flex justify-center items-center w-full lg:w-1/2 h-full'>
          <div className='w-76 md:w-110 h-full'>
            <LogoAnimationBanner/>
          </div>
        </div>

      </div>

    </section>
  )
}
