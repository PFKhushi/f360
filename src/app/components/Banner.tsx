import React from 'react'

export default function Banner() {
  return (
    <section className='flex w-full h-120 md:h-160'>

      <div className='hidden lg:flex items-center justify-center bg-gradient-to-r from-primary-5 from-35% via-primary-4 via-75% to-primary-3 w-1/2'>
        <div className='flex flex-col gap-10 text-white max-w-85'>
          <p className='text-4xl font-coolvetica'>Onde capacitam-se futuros profissionais de trabalho na Unipê</p>
          <p className='text-xl font-louis-george-cafe'>O futuro do trabalho é agora.</p>
        </div>
      </div>

      <div className='relative lg:w-1/2'>
        <div
          className='hidden lg:block absolute w-10 h-full bg-gradient-to-r from-primary-3 to-transparent'
        />
        <picture>
          <img
            src="/images/logos/banner-fs-semfundo.png"
            alt="Banner Fábrica de Software"
            className='w-full h-full object-cover'
          />
        </picture>
      </div>

    </section>
  )
}
