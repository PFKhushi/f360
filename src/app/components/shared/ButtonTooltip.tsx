import React from 'react'
// import { Icon, IconProps} from '@tabler/icons-react'
import { IconType } from "react-icons/lib";
import { twMerge } from 'tailwind-merge'
import { TooltipCustom } from './TooltipCustom'

interface ButtonHeaderProps {
  tooltipTitle: string,
  icon?: IconType
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  children?: React.ReactNode,
  className?: string,
  classNameIcon?: string
}

export default function ButtonHeader({tooltipTitle, icon: Icon, onClick, children, className, classNameIcon}: ButtonHeaderProps) {
  return (
    <TooltipCustom title={tooltipTitle} placement="top" arrow disableInteractive>
      <button
        className={twMerge(
          'cursor-pointer p-2 transition ',
          className
        )}
        onClick={onClick}
      >
        {Icon && <Icon className={classNameIcon}/>}
        {children}
      </button>
    </TooltipCustom>
  )
}
