import React, { ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

type CardPillarProps = {
  srcImage: string,
  altImage: string,
  title: string,
  children: ReactElement | ReactElement[]
  className?: string,
  classNameImage?: string
}

export default function CardPillar({srcImage, altImage, title, children, className, classNameImage}: CardPillarProps) {
  return (
    <div className={twMerge(
      'flex flex-col items-center max-w-100',
      className
    )}>

      <picture className={twMerge(
        'w-60 xl:w-80 h-60 xl:h-80 rounded-3xl overflow-hidden drop-shadow-[10px_10px_4px] drop-shadow-black/50',
        classNameImage
      )}>
        <img
          src={srcImage}
          alt={altImage}
          className='w-full h-full object-cover'
        />
      </picture>

      <div className='flex flex-col gap-6 lg:gap-10 text-xl lg:text-2xl xl:text-3xl text-white text-center font-light'>
        <p className='font-medium pt-8 pb-0 lg:py-8 text-2xl xl:text-3xl'>{title}</p>
        {children}
      </div>

    </div>
  )
}
