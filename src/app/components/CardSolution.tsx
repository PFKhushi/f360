import Link from 'next/link'
import React from 'react'
import { FiExternalLink } from 'react-icons/fi'

type CardSolutionProps = {
  srcImage: string,
  altImage: string
  hrefLink: string
  title: string,
  ref?: React.Ref<HTMLDivElement>
}

export default function CardSolution({srcImage, altImage, hrefLink, title, ref}: CardSolutionProps) {
  return (
    <div
      className='flex flex-col items-center justify-between gap-6 xl:gap-10 min-w-60 xl:min-w-81 h-80 xl:h-100 p-6 xl:p-8 bg-primary-4 drop-shadow-[10px_10px_4px] drop-shadow-black/25 rounded-[20px]'
      ref={ref}
    >

      <picture className='flex justify-center p-4 w-full h-full max-h-35 xl:max-h-46'>
        <img
          src={srcImage}
          alt={altImage}
        />
      </picture>
      <Link
        href={hrefLink}
        className='relative flex items-center rounded-[20px] text-white text-lg xl:text-2xl min-h-22 w-full bg-secondary-2 px-2 py-3'
      >
        <span className='text-center w-full max-w-38 xl:max-w-50'>{title}</span>
        <FiExternalLink className='absolute right-2 w-7 h-7 xl:w-9 xl:h-9 stroke-[2.5px]'/>
      </Link>

    </div>
  )
}
