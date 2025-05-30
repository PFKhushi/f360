'use client'

import { Calendar, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useMemo, useState } from 'react'

const localizer = momentLocalizer(moment)

export default function AgendaEventos() {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Palestra',
      start: new Date(2025,4,16,10,0,0,0),
      end: new Date(2025,4,16,12,0,0,0),
      desc: 'Uma palestra',
      color: '#A742FF80',
      tipo: 'palestra'
    },
    {
      id: 2,
      title: 'Workshop',
      start: new Date(2025,4,19,13,0,0,0),
      end: new Date(2025,4,23,17,0,0,0),
      desc: 'Um workshop',
      color: '#35F8FF80',
      tipo: 'workshop'
    },
    {
      id: 3,
      title: 'Projeto 1',
      start: new Date(2025,4,26,5,0,0,0),
      end: new Date(2025,4,30,9,0,0,0),
      desc: 'Um projeto',
      color: '#FFAD3BCC',
      tipo: 'projeto'
    },
    {
      id: 4,
      title: 'Projeto 2',
      start: new Date(2025,4,26,9,0,0,0),
      end: new Date(2025,4,30,13,0,0,0),
      desc: 'Outro projeto',
      color: '#FFAD3BCC',
      tipo: 'projeto'
    },
    {
      id: 4,
      title: 'Projeto 3',
      start: new Date(2025,4,26,9,0,0,0),
      end: new Date(2025,4,30,13,0,0,0),
      desc: 'Outro projeto',
      color: '#FFAD3BCC',
      tipo: 'projeto'
    },
    {
      id: 5,
      title: 'Projeto 4',
      start: new Date(2025,4,26,9,0,0,0),
      end: new Date(2025,4,30,13,0,0,0),
      desc: 'Outro projeto',
      color: '#FFAD3BCC',
      tipo: 'projeto'
    },
    {
      id: 6,
      title: 'Projeto 5',
      start: new Date(2025,4,26,9,0,0,0),
      end: new Date(2025,4,30,13,0,0,0),
      desc: 'Outro projeto',
      color: '#FFAD3BCC',
      tipo: 'projeto'
    }
  ])

  // Solução paleativa para bug de não funcionamento dos controles ao vir de navegação
  const [currentView, setCurrentView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);
  // FIM Solução paleativa

  const {defaultDate} = useMemo(() => ({
    defaultDate: moment().toDate()
  }), [])

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
        culture='pt-br'
        defaultDate={defaultDate}
        localizer={localizer}
        events={events}
        className='max-w-[1024px] min-h-[750px] max-h-[1024px] mx-auto'
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
        tooltipAccessor={(event) => (`${event.desc}`)}
        // Solução paleativa para bug de não funcionamento dos controles ao vir de navegação
        onView={setCurrentView}
        view={currentView}
        date={currentDate}
        onNavigate={date => {
          setCurrentDate(date);
        }}
        // FIM Solução paleativa
      />
    </div>
  );
}
