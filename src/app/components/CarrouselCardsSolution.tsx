'use client'

import React from 'react'
import CardSolution from './CardSolution'
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

export default function CarrouselCardsSolution() {

  const solutions = [
    {
      id: 1,
      srcImage: '/images/solutions/sistemas-georeferenciados.svg',
      altImage: 'Sistemas Georeferenciados',
      hrefLink:'/',
      title: 'Sistemas Georeferenciados'
    },
    {
      id: 2,
      srcImage:'/images/solutions/bots.svg',
      altImage:'Bots',
      hrefLink:'/',
      title:'Bots',
    },
    {
      id: 3,
      srcImage:'/images/solutions/sistemas-web.svg',
      altImage:'Sistemas Web',
      hrefLink:'/',
      title:'Sistemas Web',
    },
    {
      id: 4,
      srcImage:'/images/solutions/sistemas-analiticos.svg',
      altImage:'Sistemas Analíticos',
      hrefLink:'/',
      title:'Sistemas Analíticos',
    },
    {
      id: 5,
      srcImage:'/images/solutions/sistemas-mobile.svg',
      altImage:'Sistemas Mobile',
      hrefLink:'/',
      title:'Sistemas Mobile',
    },
    {
      id: 6,
      srcImage:'/images/solutions/ia.svg',
      altImage:'IA',
      hrefLink:'/',
      title:'IA',
    },
    {
      id: 7,
      srcImage:'/images/solutions/jogos.svg',
      altImage:'Jogos',
      hrefLink:'/',
      title:'Jogos',
    },
    {
      id: 8,
      srcImage:'/images/solutions/machine-learning.svg',
      altImage:'Machine Learning',
      hrefLink:'/',
      title:'Machine Learning',
    }
  ]

  

  return (
    <div className='relative overflow-hidden'>

      <button
        className="absolute z-1 top-0 bottom-0 -left-8 sm:left-0 bg-gradient-to-l from-transparent to-primary-1"
        aria-label="Previous image"
      >
        <BsChevronCompactLeft
          className='w-23 h-full text-white drop-shadow-[2px_2px_0px] drop-shadow-secondary-1 hover:text-secondary-1 transition hover:drop-shadow-white'
        />
      </button>
      <button
        className="absolute z-1 top-0 bottom-0 -right-8 sm:right-0 bg-gradient-to-r from-transparent to-primary-1"
        aria-label="Next Image"
      >
        <BsChevronCompactRight
          className='w-23 h-full text-white drop-shadow-[2px_2px_0px] drop-shadow-secondary-1 hover:text-secondary-1 transition hover:drop-shadow-white'
        />
      </button>

      <div
        className='flex items-center gap-6 sm:gap-24 justify-between overflow-x-auto py-4 scrollbar-none'
      >
        <div className='min-w-[calc(((100%-240px)/2)-24px)] sm:min-w-[calc(((100%-240px)/2)-96px)] xl:min-w-[calc(((100%-324px)/2)-96px)]'/>
        {solutions.map(solution => (
          <CardSolution
            key={solution.id}
            {...solution}
          />
        ))}
        <div className='min-w-[calc(((100%-240px)/2)-24px)] sm:min-w-[calc(((100%-240px)/2)-96px)] xl:min-w-[calc(((100%-324px)/2)-96px)]'/>
      </div>
    </div>
  )
}
