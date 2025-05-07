'use client'

import { MenuTreeType } from '@/app/types/MenuTypes/MenuTreeType'
import React, { useEffect, useRef, useState } from 'react'
import NavItem from './NavItem';
import { twMerge } from 'tailwind-merge';
// import { IconChevronDown } from '@tabler/icons-react';
import { FaChevronDown } from "react-icons/fa6";

type NavCollapseProps = {
  menu: MenuTreeType
  level?: number
  left?: boolean
  widthScreen: number
  isCollapse: boolean
}

export default function NavCollapse({menu, level = 1, left, widthScreen, isCollapse}: NavCollapseProps) {

  const refDivContainer = useRef<HTMLDivElement>(null);
  const refDivRecursiv = useRef<HTMLDivElement>(null);
  const [leftMenu, setLeftMenu] = useState<boolean | undefined>(left);
  const [widthMenu, setWidthMenu] = useState<number | undefined>(undefined);
  const [leftMenuLevel1, setLeftMenuLevel1] = useState<boolean | undefined>(undefined);
  
  function getValues(){

    if(!refDivContainer.current) return;
    const rect = refDivContainer.current.getBoundingClientRect();
    setWidthMenu(rect.width)

    if(!refDivRecursiv.current) return;
    const rect2 = refDivRecursiv.current.getBoundingClientRect();
    const needsLeftMenu = (rect2.left + 12 + (rect2.width * 2)) > widthScreen;
    if (leftMenu !== needsLeftMenu) {
      setLeftMenu(needsLeftMenu);
    }
   
  }

  useEffect(() => {

    if(level === 1){
      const rect = refDivContainer.current?.getBoundingClientRect();

      if(widthScreen - rect!.left < 250){
        return setLeftMenuLevel1(true)
      }
      
      return setLeftMenuLevel1(false)
    }
    
  }, [widthScreen, isCollapse, level])
  
  return (
    <div
      ref={refDivContainer}
      onMouseEnter={getValues}
      className={twMerge(
        'relative flex items-center gap-1 py-2 px-3 text-white hover:bg-primary-3 rounded-bl-xl rounded-tr-xl',
        left ? (level > 1 && 'rounded-tl-xl') : (level > 1 && 'rounded-br-xl'),
        level === 1 && "group/1",
        level === 2 && "group/2",
        level === 3 && "group/3",
        level === 4 && "group/4",
        level === 5 && "group/5",
      )}
    >
      
      <FaChevronDown
        className={twMerge(
          'transition -rotate-180',
          level === 1 && "group-hover/1:rotate-0",
          level === 2 && (left ? "group-hover/2:-rotate-270" : "group-hover/2:-rotate-90"),
          level === 3 && (left ? "group-hover/3:-rotate-270" : "group-hover/3:-rotate-90"),
          level === 4 && (left ? "group-hover/4:-rotate-270" : "group-hover/4:-rotate-90"),
          level === 5 && (left ? "group-hover/5:-rotate-270" : "group-hover/5:-rotate-90"),
        )}
        size="1rem"
        // stroke={3}
      />
      
      <span className='text-nowrap'>{menu.title}</span>

      <div className={twMerge(
        'hidden absolute flex-col top-10 left-0',
        (level === 1 && leftMenuLevel1) && 'right-0 left-auto',
        level === 1 && "group-hover/1:flex",
        level === 2 && "group-hover/2:flex",
        level === 3 && "group-hover/3:flex",
        level === 4 && "group-hover/4:flex",
        level === 5 && "group-hover/5:flex",
        level > 1 && "flex-row top-0 left-60",
        left && "flex-row-reverse left-auto right-60",
      )}>

        <div
          className={twMerge(
            'relative flex justify-center items-center self-start',
            leftMenuLevel1 && 'self-end',
          )}
          style={{
            width: level > 1 ? "12px" : widthMenu,
            height: level > 1 ? "40px" : "12px"
          }}
        >
          <div className={twMerge(
            'absolute w-6.5 h-full bg-primary-3 scale-150 rounded-full clip-path-triangule -z-10',
            level === 1 && "-top-1",
            level > 1 && "-rotate-90 h-3 -right-0.75",
            left && "rotate-90 right-auto -left-0.75"
          )}/>
        </div>

        <div
          className={twMerge(
            'bg-primary w-60 z-10 rounded-b-xl rounded-tr-xl',
            level === 1 && "drop-shadow-[3px_3px_2px_rgba(0,0,0,0.2)]",
          )}
        >
          {menu.children?.map((menu) => (
            menu.children ? (
              <div
                key={menu.id}
                ref={refDivRecursiv}
              >
                <NavCollapse
                  menu={menu}
                  level={level + 1}
                  left={leftMenu}
                  widthScreen={widthScreen}
                  isCollapse={isCollapse}
                />
              </div>
            ) : (
              <NavItem
                key={menu.id}
                {...menu}
              />
            )
          ))}
        </div>

      </div>
    </div>
  )
}
