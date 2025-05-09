'use client'

import React from 'react'
import ButtonTooltip from '../shared/ButtonTooltip'
import { HiOutlineMenu } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { LiaUserCircle } from "react-icons/lia";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useControlSidebar } from '@/app/context/useControlSidebar';
import { NavigationType } from '@/app/types/MenuTypes/NavigationType';
import NavList from '../navigation/NavList';
import MobileSidebar from '../navigation/mobile/MobileSidebar';
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from '@/app/context/useAuth';
import { DecodeToken } from '@/app/utils/DecodeToken';
import { twMerge } from 'tailwind-merge';

export default function Header({navigation}: {navigation: NavigationType}) {

  const theme = useTheme()
  const breakPointMd = useMediaQuery(theme.breakpoints.up('md'));
  const { setIsCollapse, setIsOpen } = useControlSidebar()
  const router = useRouter();

  const {auth} = useAuth()
  const tokenDecoded = auth?.access ? DecodeToken(auth.access) : undefined

  const path = '/' + usePathname().split('/')[1]
  
  return (
    <nav className='bg-primary-5 flex items-center py-2 px-2 drop-shadow-[0px_2px_4px] drop-shadow-black/75 h-18'>
      
      <div className='flex gap-1'>
        <ButtonTooltip
          tooltipTitle='Menu'
          icon={HiOutlineMenu}
          onClick={breakPointMd ? setIsCollapse : setIsOpen}
          classNameIcon='text-white w-8 h-8'
        />
      </div>

      <div className='grow'>
        {breakPointMd &&
          <NavList navigation={navigation}/>
        }
      </div>

      <div className='flex gap-1'>
        
        <ButtonTooltip
          tooltipTitle='Notificações'
          icon={IoMdNotificationsOutline}
          onClick={() => {}}
          classNameIcon='text-white w-8 h-8'
        />

        <div>
          <ButtonTooltip
            tooltipTitle='Usuário'
            icon={LiaUserCircle}
            onClick={() => {router.push('/perfil-usuario')}}
            className={twMerge(
              'flex items-center gap-2.5 text-white',
              'hover:bg-secondary-1',
              path === '/perfil-usuario' && 'text-primary-5 bg-secondary-2 font-bold'
            )}
            classNameIcon='w-8 h-8'
          >
            <span className='font-louis-george-cafe text-xl'>{tokenDecoded?.nome.split(' ')[0]}</span>
          </ButtonTooltip>
          
        </div>

        {!breakPointMd &&
          <MobileSidebar navigation={navigation}/>
        }
      </div>
      
    </nav>
  )
}
