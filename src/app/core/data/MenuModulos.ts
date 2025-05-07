// import { MenuModulosProps } from "@/app/types/MenuTypes/MenuModuloPropsType"

import { IconType } from "react-icons/lib";

import { LiaHomeSolid } from "react-icons/lia";
import { IoCalendarOutline } from "react-icons/io5";
import { RiFileList3Line } from "react-icons/ri";
import { BsGraphUpArrow } from "react-icons/bs";
import { TiMessages } from "react-icons/ti";

type MenuModulo = {
  id: string
  title: string
  href: string
  icon: IconType
}

type MenuModulosProps = {
  groupId: number
  groupTitle: string
  groupMenus: MenuModulo[]
}

export const MenuModulos: MenuModulosProps[] = [
  {
    groupId: 1,
    groupTitle: 'Módulos',
    groupMenus: [
      {
        id: 'M00',
        title: 'Início',
        href: '/dashboard',
        icon: LiaHomeSolid
      },
      {
        id: 'M01',
        title: 'Agenda de Eventos',
        href: '/agenda-eventos',
        icon: IoCalendarOutline
      },
      {
        id: 'M02',
        title: 'Imersões',
        href: '/imersoes',
        icon: RiFileList3Line
      },
      {
        id: 'M03',
        title: 'Projetos de Extensão',
        href: '/projetos-extensao',
        icon: BsGraphUpArrow
      },
      {
        id: 'M04',
        title: 'Contato',
        href: '/contato',
        icon: TiMessages
      },
    ]
  }
]