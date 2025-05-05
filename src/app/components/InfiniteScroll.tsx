'use client'

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  duration: number,
  maskStart: number,
  maskEnd: number,
  classNameImg?: string
}

export default function InfiniteScroll({className, duration, maskStart, maskEnd, classNameImg, ...props}: InfiniteScrollProps){

  const imgs: {srcImagem: string, altImagem: string}[] = [
    {
      srcImagem: "/images/partners/conductor.svg",
      altImagem: "Logo Conductor"
    },
    {
      srcImagem: "/images/partners/dock.svg",
      altImagem: "Logo Dock"
    },
    {
      srcImagem: "/images/partners/conte.svg",
      altImagem: "Logo Conte"
    },
    {
      srcImagem: "/images/partners/jfpb.svg",
      altImagem: "Logo JFPB",
    },
    {
      srcImagem: "/images/partners/btor.png",
      altImagem: "Logo Btor",
    },
    {
      srcImagem: "/images/partners/iass.png",
      altImagem: "Logo IASS"
    },
    {
      srcImagem: "/images/partners/pmpb-seeklogo.png",
      altImagem: "Logo PMPB" },
    {
      srcImagem: "/images/partners/logo_hospital.png",
      altImagem: "Logo Hospital Napoleão Laureano",
    },
    {
      srcImagem: "/images/partners/procon-pb.png",
      altImagem: "Logo PROCON-PB",
    },
  ];

  const imageRefs = useRef<(HTMLElement | null)[]>([]);
  const [widthImg, setWidthImg] = useState(0)
  const [heightImg, setHeightImg] = useState(0)
  const [, setWidthScreen] = useState(0);

  useEffect(() => {

    function handleResize() {
      setWidthScreen(window.innerWidth);
    }

    if(imageRefs.current[0]){
      setWidthImg(imageRefs.current[0].clientWidth)
      setHeightImg(imageRefs.current[0].clientHeight)
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

  }, [imageRefs.current[0], imageRefs.current[0]?.getClientRects()])

  const totalItems = imgs.length;
  const leftCalc = (widthImg! * totalItems);
  const keyframes = 
  `@keyframes scrollLeft {
    to {
      left: ${widthImg! * -1}px;
    }
  }`;

  return(
    <div
      className={twMerge("relative flex items-center w-full overflow-hidden", className)}
      style={{
        height: heightImg!,
        maskImage:
        `linear-gradient(
          to right,
          rgba(0, 0, 0, 0),
          rgba(0, 0, 0, 1) ${maskStart}%,
          rgba(0, 0, 0, 1) ${maskEnd}%,
          rgba(0, 0, 0, 0)
        )`
      }}
      {...props}
    >
      <style>{keyframes}</style>
      {imgs.map((img, index) => {
          
        const scrollAnimation = `scrollLeft ${duration}s ${duration / totalItems * (totalItems - (index + 1)) * -1}s linear infinite`;

        return (
            <picture
              ref={(el) => {
                imageRefs.current[index] = el;
              }}
              key={index}
              className={twMerge(
                "absolute flex justify-center items-center w-75 h-50 px-0",
                classNameImg
              )} 
              style={{
                left: leftCalc,
                animation: scrollAnimation,
              }}
            >
              <img
                src={img.srcImagem}
                alt={img.altImagem}
                className="w-full h-full object-contain"
              />
            </picture>
        );

      })}
    </div>
  )
}