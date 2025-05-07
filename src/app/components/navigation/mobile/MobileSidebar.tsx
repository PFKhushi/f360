'use client'

import React, { useState } from 'react'
import ButtonTooltip from '../../shared/ButtonTooltip';
// import { IconGridDots } from '@tabler/icons-react';
import { TbGridDots } from "react-icons/tb";
import { Drawer } from '@mui/material';
import { NavigationType } from '@/app/types/MenuTypes/NavigationType';
import NavListMobile from './NavListMobile';

export default function MobileSidebar({navigation}: {navigation: NavigationType}) {

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  
  return (
    <>
      <ButtonTooltip
        tooltipTitle='Menu Módulo'
        icon={TbGridDots}
        onClick={() => setOpenDrawer(true)}
        classNameIcon='text-white w-7 h-7'
      />
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        slotProps={{
          paper:{
            sx: {
              width: '240px'
            }
          }
        }}
      >
        <NavListMobile
          navigation={navigation}
          setOpenDrawer={setOpenDrawer}
        />
      </Drawer>
      
    </>
  )
}
