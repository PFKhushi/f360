'use client'

import { MenuTreeType } from '@/app/types/MenuTypes/MenuTreeType'
import { Collapse } from '@mui/material';
// import { IconChevronUp } from '@tabler/icons-react';
import { FaChevronUp } from "react-icons/fa6";
import Link from 'next/link';
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge';

export default function NavItemMobile({menu, setOpenDrawer}: {menu: MenuTreeType, setOpenDrawer: (open: boolean) => void}) {

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  
  return (
    
    !menu.children ? (
      
      <Link
        className={twMerge(
          'flex justify-between items-center py-2 px-2 rounded-bl-xl rounded-tr-xl ',
          'hover:bg-secondary-2 transition'
        )}
        href={menu.href}
        onClick={() => setOpenDrawer(false)}
      >
        <div className='overflow-hidden text-ellipsis pl-3.5'>
          {menu.title}
        </div>
      </Link>
      
    ) : (
      
      <>
        <div
          onClick={handleClick}
          className={twMerge(
            'flex justify-between cursor-pointer py-2 rounded-bl-xl rounded-tr-xl',
            'hover:bg-secondary-2 transition'
          )}
        >
          <div
            className={twMerge(
              'flex items-center overflow-hidden text-ellipsis',
            )}
          >
            <FaChevronUp
              className={twMerge(
                'rotate-90 transition-transform',
                open && 'rotate-180',
              )}
              size="24"
              // stroke="2.5"
            />
            <span>{menu.title}</span>
          </div>
        </div>
        <Collapse
          in={open}
          timeout="auto"
          unmountOnExit
        >
          <div className='pl-4'>
            {menu.children.map((child) => (
              <NavItemMobile
                key={child.id}
                menu={child}
                setOpenDrawer={setOpenDrawer}
              />
            ))}
          </div>
        </Collapse>
      </>
      
    ) 
  )
}
