import React, { ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

type CardHistoryProps = {
  srcImage: string,
  altImage: string,
  positionImage?: 'left' | 'right',
  children: ReactElement | ReactElement[],
  className?: string,
  classNameImage?: string,
  classNameDescription?: string,
}

export default function CardHistory({srcImage, altImage, positionImage = 'left', children, className, classNameImage, classNameDescription}: CardHistoryProps) {
  return (
    <div className={twMerge(
      'flex flex-col lg:flex-row justify-center items-center gap-8',
      positionImage === 'right' && 'lg:flex-row-reverse',
      className
    )}>
          
      <picture className={twMerge(
        'rounded-3xl overflow-hidden max-w-125 xl:max-w-150',
        classNameImage
      )}>
        <img
          src={srcImage}
          alt={altImage}
          className='w-full h-full object-cover'
        />
      </picture>

      <div className={twMerge(
        'flex flex-col gap-10 text-white w-full max-w-152 text-lg lg:text-xl xl:text-2xl text-justify font-light',
        classNameDescription
      )}>
        {children}
      </div>

    </div>
  )
}
