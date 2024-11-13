'use client'
import Link from 'next/link'
import React from 'react'

interface Props {
  closeModal: () => void
  title: string
  href: string
  icon: React.ReactNode
}

export default function ButtonNavMobile({
  closeModal,
  title,
  href,
  icon,
}: Props) {
  return (
    <li className="w-full">
      <Link
        href={href}
        className="flex items-center p-2 text-white hover:text-light-grey font-bold rounded-lg hover:bg-light-purple group transition-all delay-100"
        onClick={closeModal}
      >
        {icon}
        <span className="flex-1 ml-3 whitespace-nowrap">{title}</span>
      </Link>
    </li>
  )
}
