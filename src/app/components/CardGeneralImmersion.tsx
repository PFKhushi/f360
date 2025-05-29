import React from 'react'

type CardGeneralImmersionProps = {
  title: string,
  date: string,
  status: string
}

export default function CardGeneralImmersion({ title, date, status }: CardGeneralImmersionProps) {
  return (
    <main className='w-[310px] xl:w-[380px] h-[205px] bg-primary-1 rounded-[20px] text-white drop-shadow-[10px_10px_4px] drop-shadow-black/25'>
      <div className='p-4 flex flex-col justify-between h-full'>
        <header className='text-[24px] underline max-w-[320px]'>
          {title}
        </header>
          <p className='text-[20px]'>{date}</p>
          <div className='flex justify-center'>
            <div className='bg-white w-[260px] h-[1px]'/>
          </div>
          <p className='text-center'>
            Status de presença: 
            <span className={`${status === "Presente" ? 'bg-[#18A933]/70 text-[#C3FFCE]' : 'bg-[#D23418]/71 text-[#FFCECE]'} p-1.5 ml-1 rounded-[6px]`}>
              {status}
            </span>
          </p>
      </div>
    </main>
  )
}
