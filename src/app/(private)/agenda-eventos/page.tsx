'use client'

import { Calendar, Messages, momentLocalizer, NavigateAction, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import ModalBase from '@/app/components/shared/ModalBase'

const localizer = momentLocalizer(moment)

type EventProps = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  desc: string;
  color: string;
  tipo: string;
}

export default function AgendaEventos() {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [events, setEvents] = useState<EventProps[]>([
    {
      id: 1,
      title: 'Palestra',
      start: new Date(2025,4,16,10,0),
      end: new Date(2025,4,16,12,0),
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id varius enim. Nullam faucibus purus eu ipsum sagittis, nec vulputate nisl auctor. Morbi et sodales arcu. Donec sodales accumsan mauris eget fermentum. Phasellus nec odio tortor. Duis congue condimentum nunc, a convallis ex condimentum id. Cras risus velit, bibendum id sollicitudin vel, egestas ac ligula. Praesent a placerat nibh. Quisque iaculis eu dolor feugiat eleifend. Aliquam erat volutpat. Donec odio nisi, consequat at ligula eget, commodo tristique lorem. Maecenas fringilla aliquam eleifend.',
      color: '#A742FF80',
      tipo: 'palestra'
    },
    {
      id: 2,
      title: 'Workshop',
      start: new Date(2025,4,19,13,0),
      end: new Date(2025,4,23,17,0),
      desc: 'Um workshop',
      color: '#35F8FF80',
      tipo: 'workshop'
    },
    {
      id: 3,
      title: 'Projeto 1',
      start: new Date(2025,4,26,5,0),
      end: new Date(2025,4,30,9,0),
      desc: 'Um projeto',
      color: '#FFAD3BCC',
      tipo: 'projeto'
    },
    {
      id: 4,
      title: 'Projeto 2',
      start: new Date(2025,4,26,9,0),
      end: new Date(2025,4,30,13,0),
      desc: 'Outro projeto',
      color: '#FFAD3BCC',
      tipo: 'projeto'
    },
    {
      id: 4,
      title: 'Projeto 3',
      start: new Date(2025,4,26,9,0),
      end: new Date(2025,4,30,13,0),
      desc: 'Outro projeto',
      color: '#FFAD3BCC',
      tipo: 'projeto'
    },
    {
      id: 5,
      title: 'Projeto 4',
      start: new Date(2025,4,26,9,0),
      end: new Date(2025,4,30,13,0),
      desc: 'Outro projeto',
      color: '#FFAD3BCC',
      tipo: 'projeto'
    },
    {
      id: 6,
      title: 'Projeto 5',
      start: new Date(2025,4,26,9,0),
      end: new Date(2025,4,30,13,0),
      desc: 'Outro projeto',
      color: '#FFAD3BCC',
      tipo: 'projeto'
    }
  ])

  const [selectedEvent, setSelectedEvent] = useState<EventProps | null>(null)
  const [openModal, setOpenModal] = useState<boolean>(false)

  const {defaultDate} = useMemo(() => ({
    defaultDate: moment().toDate()
  }), [])

  function handleClickEvent(event: EventProps | null){
    setSelectedEvent(event)
    setOpenModal(true)
  }

  function FormateDateHour(date: Date){
    const dateFormated = new Intl.DateTimeFormat('pt-BR').format(date)
    const hourFormated = new Intl.DateTimeFormat('pt-BR', {timeStyle:'short'}).format(date)
    return {date: dateFormated, hour: hourFormated}
  }

  // Solução paleativa para bug de não funcionamento dos controles ao vir de navegação
  const [currentView, setCurrentView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);
  // FIM Solução paleativa

  return (
    <div className="min-h-[calc(100dvh-72px)] p-2 sm:p-6 bg-gradient-to-b from-primary-5 to-[#411CCF]">
      <Calendar
        views={{
          agenda: false,
          day: true,
          month: true,
          week: false,
          work_week: false
        }}
        components={{
          toolbar: CustomToolbar
        }}
        onSelectEvent={handleClickEvent}
        culture='pt-br'
        defaultDate={defaultDate}
        localizer={localizer}
        events={events}
        className={twMerge('max-w-[1024px] min-h-[750px] mx-auto', currentView === 'month' && 'max-h-[1024px]')}
        startAccessor="start"
        endAccessor="end"
        messages={{
          today: 'Hoje',
          previous: 'Anterior',
          next: 'Próximo',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          agenda: 'Agenda',
          work_week: 'Semana de Trabalho',
          showMore: (total) => `+${total} eventos`,
          date: 'Data',
          time: 'Hora',
          event: 'Evento',
          tomorrow: 'Amanhã',
          yesterday: 'Ontem',
          allDay: 'todo o dia',
        }}
        eventPropGetter={(event) => ({
          style:{
            backgroundColor: event.color,
          },
        })}
        tooltipAccessor={(event) => {

          const start = FormateDateHour(event.start)
          const end = FormateDateHour(event.end)
    
          return (`\nInício: ${start.date} às ${start.hour}\nFim: ${end.date} às ${end.hour}\n\nDescrição:\n${event.desc}`)
        }}
        // Solução paleativa para bug de não funcionamento dos controles ao vir de navegação
        onView={setCurrentView}
        view={currentView}
        date={currentDate}
        onNavigate={date => {
          setCurrentDate(date);
        }}
        // FIM Solução paleativa
      />
      <ModalBase
        openModal={openModal}
        setOpenModal={setOpenModal}
        className='bg-primary-1 text-white max-w-[500px]'
      >
        <div>
          <h1
            style={{backgroundColor: selectedEvent?.color}}
            className='text-xl w-fit mx-auto px-6 py-1 rounded-full'
          >
            {selectedEvent?.title}
          </h1>
          <div className='mt-6'>
            <div className='flex flex-col items-center'>
              <label className='text-secondary-2 font-bold'>Tipo:</label>
              <p className='text-justify'>{selectedEvent?.tipo}</p>
            </div>
            <div className='flex flex-col items-center mt-4'>
              <label className='text-secondary-2 font-bold'>Início:</label>
              <p>{selectedEvent && FormateDateHour(selectedEvent.start).date} às {selectedEvent && FormateDateHour(selectedEvent.start).hour }</p>
            </div>
            <div className='flex flex-col items-center'>
              <label className='text-secondary-2 font-bold'>Fim:</label>
              <p>{selectedEvent && FormateDateHour(selectedEvent.end).date} às {selectedEvent && FormateDateHour(selectedEvent.end).hour }</p>
            </div>
            <div className='flex flex-col items-center mt-4'>
              <label className='text-secondary-2 font-bold'>Descrição:</label>
              <p className='text-justify'>{selectedEvent?.desc}</p>
            </div>
          </div>
        </div>
      </ModalBase>
    </div>
  );
}

type CustomToolbarProps = {
  label: string,
  onView: (view: View) => void,
  onNavigate: (navigate: NavigateAction, date?: Date) => void,
  view: View,
  localizer: {
    messages: Messages<{
      id: number;
      title: string;
      start: Date;
      end: Date;
      desc: string;
      color: string;
      tipo: string;
    }>
  }
}

function CustomToolbar({label, onView, onNavigate, view, localizer}: CustomToolbarProps){
  
  const handleNavigate = (navigate: NavigateAction) => {
    onNavigate(navigate)
  }
  const handleView = (view: View) => {
    onView(view)
  }

  return(
    <div className='flex justify-between gap-2 items-center mb-2'>
      <label className='capitalize text-white text-lg sm:text-2xl'>{label}</label>
      <div className='flex gap-2 text-white text-sm sm:text-base'>
        <div className='flex border divide-x overflow-hidden rounded-lg *:cursor-pointer *:px-2 *:py-1 *:hover:bg-secondary-1 *:transition'>
          <button
            onClick={() => handleNavigate('TODAY')} 
          >
            {localizer.messages.today}
          </button>
          <button
            onClick={() => handleNavigate('PREV')}
          >
            <FaChevronLeft/>
          </button>
          <button
            onClick={() => handleNavigate('NEXT')}
          >
            <FaChevronRight/>
          </button>
        </div>
        <div className='flex text-white border divide-x overflow-hidden rounded-lg *:cursor-pointer *:px-2 *:py-1 *:hover:bg-secondary-1 *:transition'>
          <button
            onClick={() => handleView('month')}
            className={twMerge(view === 'month' && 'bg-secondary-2/75')}
          >
            {localizer.messages.month}
          </button>
          <button
            onClick={() => handleView('day')}
            className={twMerge(view === 'day' && 'bg-secondary-2/75')}
          >
            {localizer.messages.day}
          </button>
        </div>
      </div>
    </div>
  )
}