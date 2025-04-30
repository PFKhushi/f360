import React from 'react'
import { twMerge } from 'tailwind-merge'

type CardHistoryProps = {
  srcImage: string,
  altImage: string,
  positionImage?: 'left' | 'right',
  children: React.JSX.Element,
  className?: string,
  classNameImage?: string,
}

export default function CardHistory({srcImage, altImage, positionImage = 'left', children, className, classNameImage}: CardHistoryProps) {
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

      {children}

    </div>
  )
}
