'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {

  const [isDark, setIsDark] = useState(false);

    const handleScroll = () => {
      document.body.style.overflow = "auto";
      if (window.scrollY > 500) {
        return setIsDark(true);
      }
      return setIsDark(false);
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => {
        window.removeEventListener("scroll", handleScroll);
        };
    }, []);


  return (
    <>
      <nav className={twMerge(
        "fixed top-0 py-5 px-5 w-full mx-auto z-10 transition",
        isDark ? 'bg-primary-5' : 'bg-primary-5/50'
      )}>
        <div className="flex justify-between text-white max-w-360 mx-auto">
          
          <div className="flex items-center gap-10">
            <Link href={'/'}>
              <picture>
                <img
                  className="max-w-50"
                  src="/images/logos/branca-sem-preenchimento/LOGO S_ PREENCHIMENTO-LETREIRO-HORIZONTAL.png"
                  alt="Logo Fábrica de Software"
                />
              </picture>
            </Link>

            <ul className="flex gap-2 text-xl *:hover:text-secondary-1">
              {/* <Link href={'/'}>
                <li>
                  Home
                </li>
              </Link>
              <Link href={'/estrutura-e-equipes'}>
                <li>
                  Estrutura e Equipes
                </li>
              </Link>
              <Link href={'/projetos'}>
                <li>
                  Projetos
                </li>
              </Link>
              <Link href={'/como-participar'}>
                <li>
                  Como Participar
                </li>
              </Link>
              <Link href={'/sobre'}>
                <li>
                  Sobre nós
                </li>
              </Link> */}
            </ul>
          </div>

          <ul className="flex items-center gap-10">
            <Link href={'/sign-in'}>
              <li className="text-2xl">
                Entrar
              </li>
            </Link>
            <Link href={'/register'}>
              <li className="bg-secondary-2 hover:bg-secondary-1 transition px-5 py-3 text-xl rounded-2xl shadow-[2px_2px_1px]">
                Cadastre-se
              </li>
            </Link>
          </ul>
          
        </div>
      </nav>

      <main className="bg-primary-4 overflow-auto">
        {children}
      </main>
    </>
  );
}