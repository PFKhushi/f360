import React from 'react'
import { twMerge } from 'tailwind-merge'

type CardValuesProps = {
  srcImage: string,
  altImage: string,
  title: string,
  description: string,
  className?: string
}

export default function CardValues({srcImage, altImage, title, description, className}: CardValuesProps) {
  return (
    <div className='flex gap-3 w-full max-w-90'>
      <picture className={twMerge(
        'flex justify-center items-center self-center bg-[#E8E8E8] rounded-3xl min-w-34 h-34 px-10 py-8',
        className
      )}>
        <img
          src={srcImage}
          alt={altImage}
        />
      </picture>
      <div className='flex flex-col justify-between text-white'>
        <p className='font-coolvetica text-3xl'>{title}</p>
        <p className='font-louis-george-cafe text-xl'>{description}</p>
      </div>
    </div>
  )
}
