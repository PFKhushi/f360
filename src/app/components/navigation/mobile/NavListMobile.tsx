import { NavigationType } from '@/app/types/MenuTypes/NavigationType'
import React from 'react'
import NavItemMobile from './NavItemMobile'
import { twMerge } from 'tailwind-merge'

export default function NavListMobile({navigation, setOpenDrawer}: {navigation: NavigationType, setOpenDrawer: (open: boolean) => void}) {
  return (
    <nav className={twMerge(
      'h-full bg-primary-1 text-white overflow-y-auto',
      // 'scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full transition-colors scrollbar-thumb-primary hover:scrollbar-thumb-secondary',
    )}>
      <div className='flex flex-col px-2.5 py-2'>
        <span className='text-sm uppercase font-semibold py-2 text-center'>
          {navigation.menuTitle}
        </span>
        {navigation.menuTree.map((menu) => (
          <NavItemMobile
            key={menu.id}
            menu={menu}
            setOpenDrawer={setOpenDrawer}
          />
        ))}
      </div>
    </nav>
  )
}
