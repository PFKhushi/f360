import React from 'react'
import { twMerge } from 'tailwind-merge'
import { CircularProgress } from '@mui/material'

export default function ButtonSubmit({isLoading, label, className}: {isLoading: boolean, label: string, className?: string}) {
  return (
    <button 
      type="submit"
      className={twMerge(
        "flex justify-center items-center text-white text-[18px] md:text-xl bg-secondary-2 hover:bg-secondary-1 rounded-2xl w-40 h-15",
        "drop-shadow-[3px_3px_1px] drop-shadow-white rounded-[20px] transition active:translate-[3px] active:drop-shadow-[0px_0px_0px] active:inset-shadow-[3px_3px_6px] active:inset-shadow-black/70 text-shadow-2xs",
        className
      )} 
      disabled={isLoading}
    >
      {isLoading ? (
        <CircularProgress
          color='inherit'
          size={30}
        />
      ) : (
        <>{label}</>
      )}
    </button>
  )
}
