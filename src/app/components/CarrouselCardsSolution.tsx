'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
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

  // FUNÇÃO DOS BOTÕES PARA ROLAR AS IMAGENS
  const [currentItem, setCurrentItem] = useState(0);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const element = imageRefs.current[currentItem];
  if (scrollContainer.current && element) {
    scrollContainer.current.scrollTo({
      left:
        element.offsetLeft -
        scrollContainer.current.clientWidth / 2 +
        element.clientWidth / 2,
      behavior: "smooth",
    });
  }

  function scrollClick(btn: 'right' | 'left') {
      
    const totImgs = solutions.length
    setCurrentItem((prevItem) => {
      let newIndex = (btn === 'left' ? prevItem - 1 : prevItem + 1);
      if (newIndex >= totImgs) {newIndex = 0;}
      if (newIndex < 0) {newIndex = totImgs - 1;}
      return newIndex;
    });

    setIsAutoScroll(false)
  };

  // FUNÇÃO DE ROLAGEM QUE MANTÉM A IMAGEM ATUAL NO CENTRO DA TELA
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => {
    
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      if (scrollContainer.current) {
        setScrollPosition(scrollContainer.current.scrollLeft);
      }
    }, 200);
  }, []);

  useEffect(() => {
    let width = 0;
    let gap = 0;
    
    if(imageRefs.current[0] && scrollContainer.current){
      width = imageRefs.current[0].clientWidth;
      gap = parseInt(window.getComputedStyle(scrollContainer.current).gap);
    }
    
    width += gap;
    
    let inteiro = Math.floor(scrollPosition / width);
    const parte = scrollPosition / width - inteiro;

    if (parte >= 0.5) {
      inteiro++;
    }

    setCurrentItem(inteiro);
    
  }, [scrollPosition]);

  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout
    const tot = solutions.length
    
      if (isAutoScroll) {

        intervalId = setInterval(() => {
          setCurrentItem((prevItem) => {
            let newIndex = prevItem + 1;
            if (newIndex >= tot) {newIndex = 0;}
            if (newIndex < 0) {newIndex = tot - 1;}
            return newIndex;
          });
        }, 2000);

      }else{

        intervalId = setInterval(() => {
          if(!isMouseEnter){
            setIsAutoScroll(true);
          }
        }, 2000);

      }

    return () => {
      clearInterval(intervalId);
    };
  
  }, [isAutoScroll, isMouseEnter]);

  function handleMouseEnter() {
    setIsAutoScroll(false);
    setIsMouseEnter(true);
  }

  function handleMouseLeave () {
    setIsMouseEnter(false);
  }
  
  return (
    <div
      className='relative overflow-hidden'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="group absolute z-1 top-0 bottom-0 left-0 bg-gradient-to-l from-transparent to-primary-1 hover:cursor-pointer outline-none"
        aria-label="Previous image"
        onClick={() => scrollClick('left')}
      >
        <BsChevronCompactLeft
          className='w-16 sm:w-23 h-16 sm:h-23 text-white drop-shadow-[2px_2px_0px] drop-shadow-secondary-1 group-hover:text-secondary-1 transition group-hover:drop-shadow-white'
        />
      </button>
      <button
        className="group absolute z-1 top-0 bottom-0 right-0 bg-gradient-to-r from-transparent to-primary-1 hover:cursor-pointer outline-none"
        aria-label="Next Image"
        onClick={() => scrollClick('right')}
      >
        <BsChevronCompactRight
          className='w-16 sm:w-23 h-16 sm:h-23 text-white drop-shadow-[2px_2px_0px] drop-shadow-secondary-1 group-hover:text-secondary-1 transition group-hover:drop-shadow-white'
        />
      </button>

      <div
        className='flex items-center gap-6 sm:gap-24 justify-between overflow-x-auto py-4 scrollbar-none'
        ref={scrollContainer}
        onScroll={handleScroll}
      >
        <div className='min-w-[calc(((100%-240px)/2)-24px)] sm:min-w-[calc(((100%-240px)/2)-96px)] xl:min-w-[calc(((100%-324px)/2)-96px)]'/>
        {solutions.map((solution, index) => (
          <CardSolution
            key={index}
            {...solution}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
          />
        ))}
        <div className='min-w-[calc(((100%-240px)/2)-24px)] sm:min-w-[calc(((100%-240px)/2)-96px)] xl:min-w-[calc(((100%-324px)/2)-96px)]'/>
      </div>
    </div>
  )
}
