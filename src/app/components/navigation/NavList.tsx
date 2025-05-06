'use client'

import React, { useEffect, useState } from 'react'
import { NavigationType } from '@/app/types/MenuTypes/NavigationType';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import { useControlSidebar } from '@/app/context/useControlSidebar';

export default function NavList({navigation}: {navigation: NavigationType}) {

  const [widthScreen, setWidthScreen] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);
  const {isCollapse} = useControlSidebar();

  useEffect(() => {
    const handleResize = () => setWidthScreen(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])
  
  return (
    <ul className='flex gap-0.75'>
      {navigation.menuTree.map((menu) => {

        if(menu.children) return (
          <NavCollapse
            key={menu.id}
            menu={menu}
            widthScreen={widthScreen}
            isCollapse={isCollapse}
          />
        )

        return (
          <NavItem
            key={menu.id}
            {...menu}
          />
        )
      })}
    </ul>
  )
}
