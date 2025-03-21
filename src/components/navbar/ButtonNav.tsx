'use client'
import Link from 'next/link'
import React from 'react'

export type Props = {
  click: boolean

  closeNav: () => void
  title: string
  icon: React.ReactNode
  href: string
}

export default function ButtonNav({
  click,
  closeNav,
  title,
  href,
  icon,
}: Props) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center p-2 text-white hover:text-light-grey font-bold rounded-lg hover:bg-light-purple group transition-all delay-100"
        onClick={closeNav}
      >
        {icon}
        <span
          className={`flex-1 ml-3 whitespace-nowrap  ${click ? '' : 'hidden'}`}
        >
          {title}
        </span>
      </Link>
    </li>
  )
}
