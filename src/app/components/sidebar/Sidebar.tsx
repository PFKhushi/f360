'use client'

import { Drawer } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useState } from 'react'
import { useControlSidebar } from '@/app/context/useControlSidebar'
import SidebarItems from './SidebarItems';
import { twMerge } from 'tailwind-merge';
import ButtonLogout from './ButtonLogout';
import Link from 'next/link';

export default function Sidebar() {

  const {isOpen, isCollapse, setIsOpen} = useControlSidebar();
  const theme = useTheme();
  const breakpointScreen = useMediaQuery(theme.breakpoints.up('md'));
  const [isSidebarHover, setIsSidebarHover] = useState<boolean>(false);
  
  const MIN_WIDTH = 65;
  const MAX_WIDTH = 250;
  const toggleWidth = (isCollapse && !isSidebarHover && breakpointScreen) ? MIN_WIDTH : MAX_WIDTH;

  function onHoverEnter() {
    if (isCollapse) {
      setIsSidebarHover(true)
    }
  };

  function onHoverLeave() {
    if (isCollapse) {
      setIsSidebarHover(false)
    }
  };

  return (
    <>
      <Drawer
        anchor='left'
        open={isOpen}
        onClose={setIsOpen}
        onMouseEnter={breakpointScreen ? onHoverEnter : undefined}
        onMouseLeave={breakpointScreen ? onHoverLeave : undefined}
        variant={breakpointScreen ? 'permanent' : 'temporary'}
        sx={{
          width: toggleWidth,
          flexShrink: 0,
          ...(isCollapse && {
            position: 'absolute'
          })
        }}
        slotProps={{
          paper: {
            sx: {
              transition: theme.transitions.create('width', {
                duration: theme.transitions.duration.shortest,
              }),
              width: toggleWidth,
              boxSizing: 'border-box',
              overflow: 'hidden',
              borderWidth: 0,
              boxShadow: '4px 2px 5px var(--tw-shadow-color, rgba(0,0,0,0.2))',
              backgroundColor: 'var(--color-primary-2)',
              borderRight: 8,
              borderColor: 'var(--color-secondary-2)'
            }
          }
        }}
      >
        <Link
          href={'/'}
          className={twMerge(
          'flex justify-center gap-1 h-18 w-[242px] p-2 bg-primary-2 drop-shadow-[0px_2px_4px] drop-shadow-black/25',
          toggleWidth === 65 && 'px-2 justify-start'
        )}>
          <picture>
            <img
              className="w-full h-full object-contain"
              src='/images/logos/branca-sem-preenchimento/LOGO S_ PREENCHIMENTO-LETREIRO-HORIZONTAL.png'
              alt="Logo OnliVendas"
            />
          </picture>
        </Link>
        
        <SidebarItems hideMenu={toggleWidth === 65} breakpointScreen={breakpointScreen} setIsSidebarHover={setIsSidebarHover}/>

        <ButtonLogout hideMenu={toggleWidth === 65}/>
          
      </Drawer>
      <div style={{
        minWidth: isCollapse && breakpointScreen ? MIN_WIDTH : 0,
        
      }}/>
    </>
  )
}
