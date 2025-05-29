import React from 'react'
import ButtonSubscribe from './shared/ButtonSubscribe'

type CardAvailableImmersionProps = {
  title: string,
  date: string,
  presenceState: string,
  status: string
}

export default function CardAvailableImmersion({ title, date, presenceState, status }: CardAvailableImmersionProps){
  return (
    <main className='xl:min-w-[480px] h-[254px] min-w-[320px] bg-primary-1 rounded-[20px] text-white drop-shadow-[10px_10px_4px] drop-shadow-black/25'>
        <header className='bg-primary-4 rounded-[20px] py-4 px-6'>
          <div className='flex justify-end xl:pb-0 pb-2'>
            <ButtonSubscribe status={status}/>
          </div>
          <div className='xl:text-[24px] text-[20px] xl:pb-1 max-w-[320px]'>
            {title}
          </div>
        </header>
        <article className='flex flex-col justify-around h-[100px] px-6'>
          <p className='xl:text-[20px]'>{date}</p>
          <div className='bg-white w-full h-[1px]'/>
          <p>
            Status de presença: 
            <span className={`${presenceState === "Em andamento" ? 'bg-[#D0A30F]/81 text-[#FFEA74]' : 'bg-[#aca5a5]/71'} p-1.5 xl:px-7 xl:ml-6 rounded-[6px]`}>
              {presenceState}
            </span>
          </p>
        </article>
    </main>
  )
}
