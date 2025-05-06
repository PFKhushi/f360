import React from 'react'
import { MenuModulos } from '@/app/core/data/MenuModulos'
import { useControlSidebar } from '@/app/context/useControlSidebar'
import { twMerge } from 'tailwind-merge'
import SidebarItem from './SidebarItem'
// import { useAuth } from '@/app/context/useAuth'
// import { DecodeToken } from '@/app/utils/DecodeToken'
// import { AllowedModulesByProfiles } from '@/app/core/data/AllowedModulesByProfiles'

type SidebarItemsProps = {
  hideMenu: boolean,
  breakpointScreen: boolean,
  setIsSidebarHover: (isHover: boolean) => void,
}

export default function SidebarItems({hideMenu, breakpointScreen, setIsSidebarHover}: SidebarItemsProps) {

  const {setIsOpen} = useControlSidebar();
  // const {token} = useAuth();
  // const tokenDecoded = DecodeToken(token!)
  // const ALLOWED_MODULES_PROFILE = AllowedModulesByProfiles.filter(allowed => allowed.profile === tokenDecoded.Perfil)

  return (
    <aside className={twMerge(
      'h-full pb-2 space-y-0.5 overflow-y-auto overflow-x-hidden text-white',
      // 'scrollbar scrollbar-w-1.5 scrollbar-thumb-rounded-full scrollbar-thumb-primary hover:scrollbar-thumb-secondary',
    )}>
      {MenuModulos.map((menuModulo) => (
        <div key={menuModulo.groupId}>
          {/* <div className={twMerge(
            'text-center text-sm font-semibold uppercase text-nowrap py-2 pt-4',
            'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
          )}>
            {!hideMenu ? menuModulo.groupTitle : '...'}
          </div> */}
          <div className='flex flex-col my-2 flex-nowrap'>
            {menuModulo.groupMenus.map((modulo) => {

              // if(!ALLOWED_MODULES_PROFILE.find(module => module.modulesAllowed.includes(modulo.href))) {
              //   return
              // }
              
              return(
                <SidebarItem
                  key={modulo.id}
                  modulo={modulo}
                  breakpointScreen={breakpointScreen}
                  hideMenu={hideMenu}
                  setIsOpen={setIsOpen}
                  setIsSidebarHover={setIsSidebarHover}
                />
              )
            })}
          </div>
          
        </div>
      ))}
    </aside>
  )
}
