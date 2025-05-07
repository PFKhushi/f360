import { MenuTreeType } from '@/app/types/MenuTypes/MenuTreeType'
import Link from 'next/link'
import React from 'react'

export default function NavItem({href, title}: MenuTreeType) {
  return (
    <Link href={href}>
      <li className='flex justify-between items-center transition text-white hover:bg-secondary-2 px-3 py-2'>
        <div className='overflow-hidden text-ellipsis text-nowrap'>
          {title}
        </div>
      </li>
    </Link>
  )
}
