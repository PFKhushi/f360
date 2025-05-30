'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LuCircleChevronLeft, LuCircleChevronRight } from "react-icons/lu";
import { twMerge } from 'tailwind-merge';

export default function CarrouselMyProjects({autoScroll = false}:{autoScroll?: boolean}) {

  const projetosPessoais = [
    {
      titulo: 'Projeto F360',
      descricao: 'Desenvolvimento de um Website da própria Fábrica de Software',
      status: 'Em andamento',
      imagem: '/images/logos/branca-com-preenchimento/branco-com-preenchimento.png',
    },
    {
      titulo: 'Projeto Polícia Militar',
      descricao: 'Desenvolvimento de um aplicativo Mobile de comunicação policial',
      status: 'Concluído',
      imagem: '/images/partners/pmpb-seeklogo.png',
    }
  ];

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
      
    const totImgs = projetosPessoais.length
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

  const [isAutoScroll, setIsAutoScroll] = useState(autoScroll);
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const touchedTimeout = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout
    const tot = projetosPessoais.length
    
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
          if(!isMouseEnter && !isTouched && autoScroll){
            setIsAutoScroll(true);
          }
        }, 2000);

      }

    return () => {
      clearInterval(intervalId);
    };
  
  }, [isAutoScroll, isMouseEnter, isTouched, autoScroll]);

  function handleMouseEnter() {
    setIsAutoScroll(false);
    setIsMouseEnter(true);
  }

  function handleMouseLeave () {
    setIsMouseEnter(false);
  }

  const handleTouch = useCallback(() => {
    setIsAutoScroll(false);
    setIsTouched(true);

    if (touchedTimeout.current) {
      clearTimeout(touchedTimeout.current);
    }
  
    touchedTimeout.current = setTimeout(() => {
      setIsTouched(false);
    }, 2000);
  }, []);
  
  return (
    <div
      className='relative w-full @container'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onTouchEnd={handleTouch}
    >
      <button
        className="group absolute z-1 top-0 bottom-0 -left-4 sm:left-0 hover:cursor-pointer outline-none"
        aria-label="Previous image"
        onClick={() => scrollClick('left')}
      >
        <LuCircleChevronLeft
          className='w-12 sm:w-16 h-12 sm:h-16 text-white group-hover:text-secondary-1 transition'
        />
      </button>
      <button
        className="group absolute z-1 top-0 bottom-0 -right-4 sm:right-0 hover:cursor-pointer outline-none"
        aria-label="Next Image"
        onClick={() => scrollClick('right')}
      >
        <LuCircleChevronRight
          className='w-12 sm:w-16 h-12 sm:h-16 text-white group-hover:text-secondary-1 transition'
        />
      </button>

      <div
        className='flex items-center gap-6 sm:gap-10 w-full overflow-x-auto py-4 px-6 sm:px-10 scrollbar-none'
        ref={scrollContainer}
        onScroll={handleScroll}
      >
        <div className='min-w-[calc(((100%-250px)/2)-24px)] sm:min-w-[calc(((100%-350px)/2)-40px)]'/>
        {projetosPessoais.map((projeto, index) => (
          <div
            key={index}
            className={twMerge(
              "flex flex-col justify-between self-stretch max-h-[390px] bg-primary-1 text-white rounded-[20px] gap-6 p-6 w-full min-w-[250px] sm:min-w-[350px] drop-shadow-[6px_6px_4px] drop-shadow-black/50",
            )}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
          >
            <div className='flex flex-col gap-6'>
              <picture className='h-22 max-w-58 self-start'>
                <img
                  src={projeto.imagem}
                  alt={`Logo ${projeto.titulo}`}
                  className="w-full h-full object-contain"
                />
              </picture>

              <h1 className="text-2xl sm:text-3xl">
                {projeto.titulo}
              </h1>

              <p className="text-lg sm:text-xl font-light text-justify line-clamp-3">
                {projeto.descricao}
              </p>
            </div>

            <div className={twMerge(
              'rounded-[8px] w-fit py-2 px-6',
              projeto.status === 'Em andamento' ? 'bg-secondary-3/81' : 'bg-secondary-4/70'
            )}>
              <p className='text-lg font-louis-george-cafe text-center italic'>
                {projeto.status}
              </p>
            </div>

          </div>
        ))}
        <div className='min-w-[calc(((100%-250px)/2)-24px)] sm:min-w-[calc(((100%-350px)/2)-40px)]'/>
      </div>
    </div>
  )
}
