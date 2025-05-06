'use client'

import React from 'react'
import ButtonTooltip from '../shared/ButtonTooltip'
// import { IconMenu2 } from '@tabler/icons-react'
import { SlMenu } from "react-icons/sl";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useControlSidebar } from '@/app/context/useControlSidebar';
import { NavigationType } from '@/app/types/MenuTypes/NavigationType';
import NavList from '../navigation/NavList';
import MobileSidebar from '../navigation/mobile/MobileSidebar';
// import ButtonLogout from './ButtonLogout';

export default function Header({navigation}: {navigation: NavigationType}) {

  const theme = useTheme()
  const breakPointMd = useMediaQuery(theme.breakpoints.up('md'));
  const { setIsCollapse, setIsOpen } = useControlSidebar()
  
  return (
    <nav className='bg-primary-5 flex items-center py-2 px-2 shadow-[2px_2px_5px_rgba(0,0,0,0.2)]'>
      
      <div className='flex gap-1'>
        <ButtonTooltip
          tooltipTitle='Menu'
          icon={SlMenu}
          onClick={breakPointMd ? setIsCollapse : setIsOpen}
          classNameIcon='text-white w-8 h-8'
          // stroke={2.5}
        />
      </div>

      <div className='grow'>
        {breakPointMd &&
          <NavList navigation={navigation}/>
        }
      </div>

      <div className='flex gap-1'>
        {/* <ButtonLogout /> */}
        {!breakPointMd &&
          <MobileSidebar navigation={navigation}/>
        }
      </div>
      
    </nav>
  )
}
