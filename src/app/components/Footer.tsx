import React from 'react'
import { FiMapPin, FiTwitter, FiInstagram, FiFacebook } from "react-icons/fi";
import { BsChatLeftText } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer className='bg-gradient-to-b from-primary-4 to-primary-6 py-20'>

      <div className='flex flex-col gap-20 md:flex-row justify-between max-w-360 px-5 mx-auto'>
        <picture className='self-center'>
          <img
            className='max-w-60 lg:max-w-80 xl:max-w-106 object-contain'
            src="/images/logos/branca-sem-preenchimento/LOGO S_ PREENCHIMENTO-LETREIRO-HORIZONTAL.png"
            alt="Logo Fábrica de Software" />
        </picture>

        <div className='flex flex-col gap-5 md:gap-15 lg:gap-18 xl:gap-21 text-white text-base md:text-xl lg:text-2xl xl:text-[28px]'>
          
          <div className='flex justify-center md:justify-end gap-5'>
            <p className='md:max-w-83.5 lg:max-w-100 xl:max-w-116.75 text-right'>BR-230 - Água Fria, João Pessoa - PB, 58053-000</p>
            <FiMapPin className='w-8 lg:w-10 xl:w-12 h-8 lg:h-10 xl:h-12' />
          </div>

          <div className='flex justify-center md:justify-end gap-5'>
            <p className='italic'>suporte@fabricadesoftware.com</p>
            <BsChatLeftText className='w-8 lg:w-10 xl:w-12 h-8 lg:h-10 xl:h-12' />
          </div>

          <div className='flex justify-center md:justify-end gap-5'>
            <p className='italic'>fabricadesoftwareunipe@gmail.com</p>
            <MdOutlineEmail className='w-8 lg:w-10 xl:w-12 h-8 lg:h-10 xl:h-12' />
          </div>

          <div className='flex justify-center md:justify-end gap-5'>
            <p className='italic'>@fabricadesoftware</p>
            <FiTwitter className='w-8 lg:w-10 xl:w-12 h-8 lg:h-10 xl:h-12' />
            <FiInstagram className='w-8 lg:w-10 xl:w-12 h-8 lg:h-10 xl:h-12' />
            <FiFacebook className='w-8 lg:w-10 xl:w-12 h-8 lg:h-10 xl:h-12' />
          </div>

        </div>

      </div>

    </footer>
  )
}
