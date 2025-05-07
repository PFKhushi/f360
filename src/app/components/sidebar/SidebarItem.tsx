// import { MenuModulo } from '@/app/types/MenuTypes/MenuModuloType'
import Link from 'next/link'
import React from 'react'
import { twMerge } from 'tailwind-merge'
import { usePathname } from 'next/navigation'
import { IconType } from "react-icons/lib";

type MenuModulo = {
  id: string
  title: string
  href: string
  icon: IconType
}

type SidebarItemProps = {
  modulo: MenuModulo,
  breakpointScreen: boolean,
  hideMenu: boolean,
  setIsOpen: () => void,
  setIsSidebarHover: (isHover: boolean) => void,
}

export default function SidebarItem({ modulo, breakpointScreen, hideMenu, setIsOpen }: SidebarItemProps) {

  const Icon = modulo.icon
  const path = '/' + usePathname().split('/')[1]

  return (

      <Link
        key={modulo.id}
        href={modulo.href}
        onClick={!breakpointScreen ? setIsOpen : undefined} //() => setIsSidebarHover(false)
        className={twMerge(
          'flex items-center justify-between w-full h-16 px-3',
          'transition hover:bg-secondary-1 text-lg',
          (path === modulo.href) && 'bg-secondary-2 hover:bg-secondary-1 text-primary-1 font-bold'
        )}
      >
        <div className='flex flex-nowrap items-center gap-2.5'>
          <Icon className={twMerge(
            'w-8 h-8',
          )}/>
          <span className={twMerge(
            'text-nowrap',
            !hideMenu ? 'block' : 'hidden'
          )}>
            {modulo.title}
          </span>
        </div>
      </Link>
  )
}
