import React from 'react'

export default function LandingPage() {
  return (
    <>
      <section className='flex w-full h-160'>
        <div className='hidden lg:flex items-center justify-center bg-gradient-to-r from-primary-5 from-35% via-primary-4 via-75% to-primary-3 w-1/2'>

          <div className='flex flex-col gap-10 text-white max-w-85'>
            <p className='text-4xl font-coolvetica'>Onde capacitam-se futuros profissionais de trabalho na Unipê</p>
            <p className='text-xl font-louis-george-cafe'>O futuro do trabalho é agora.</p>
          </div>

        </div>

        <div className='relative lg:w-1/2'>
          <div
            className='hidden lg:block absolute w-10 h-full bg-gradient-to-r from-primary-3 to-transparent'
          />
          <picture>
            <img
              src="/images/logos/banner-fs-semfundo.png"
              alt="Banner Fábrica de Software"
              className='w-full h-full object-cover'
            />
          </picture>
        </div>
      </section>
      
      <section className='flex flex-col gap-25 w-full max-w-360 mx-auto p-15 my-10'>

        <div className='flex justify-center items-center gap-8'>
          
          <picture className='rounded-3xl overflow-hidden'>
            <img
              src="/images/cards/IMG-20240823-WA0031.jpg"
              alt="Turma de Extensionistas"
              className='w-150'
            />
          </picture>

          <div className='flex flex-col gap-10 text-white w-full max-w-152 text-2xl'>
            <div className='w-fit *:font-coolvetica *:text-3xl'>
              <p className='text-right'>História da</p>
              <p>Fábrica de Software</p>
              <div className='w-50 h-1 mt-4 rounded-full justify-self-center bg-secondary-1'/>
            </div>
            <div className='flex flex-col font-light gap-10 text-justify'>
              <p>
                A Fábrica de Software do Unipê foi idealizada e fundada por Walace Bonfim e vem transformando a realidade acadêmica a mais de 15 anos.
              </p>
              <p>
                Criada com o objetivo de aproximar os estudantes da vivência do mercado, a Fábrica atua como uma ponte entre o mundo universitário e o universo corporativo.
              </p>
            </div>
          </div>

        </div>

        <div className='flex flex-row-reverse justify-center items-center gap-8'>
          
          <picture className='rounded-3xl overflow-hidden'>
            <img
              src="/images/cards/sala-fabrica.jpg"
              alt="Sala da Fábrica de Software"
              className='w-150'
            />
          </picture>

          <div className='flex flex-col font-light gap-10 text-justify text-white w-full max-w-152 text-2xl'>
            <p>
              Ao longo dos anos, dezenas de projetos foram desenvolvidos com empresas reais, preparando centenas de alunos para o mercado de trabalho com uma experiência prática, dinâmica e enriquecedora.
            </p>
            <p>
              A Fábrica é hoje um dos pilares do aprendizado aplicado na Unipê, sendo reconhecida como um ambiente que simula uma empresa real dentro do contexto acadêmico.
            </p>
          </div>
          
        </div>

      </section>

      <section className='bg-primary-1 mx-auto p-8 my-10'>
        <div className='flex max-w-360 justify-between mx-auto'>

          <div className='flex gap-3 w-full max-w-90'>
            <picture className='flex bg-[#E8E8E8] px-10 py-8 rounded-3xl'>
              <img
                src="/images/icons/missão.svg"
                alt="Missão"
                className='min-w-12'
              />
            </picture>
            <div className='flex flex-col justify-between text-white'>
              <p className='font-coolvetica text-3xl'>Missão</p>
              <p className='font-louis-george-cafe text-xl'>Preparar os alunos da Unipê para o mercado de trabalho</p>
            </div>
          </div>

          <div className='flex gap-3 w-full max-w-90'>
            <picture className='flex bg-[#E8E8E8] px-10 py-8 rounded-3xl'>
              <img
                src="/images/icons/visão.svg"
                alt="Visão"
                className='min-w-17'
              />
            </picture>
            <div className='flex flex-col justify-between text-white'>
              <p className='font-coolvetica text-3xl'>Visão</p>
              <p className='font-louis-george-cafe text-xl'>Capacitar e mudar o mercado de tecnologia da cidade</p>
            </div>
          </div>

          <div className='flex gap-3 w-full max-w-90'>
            <picture className='flex bg-[#E8E8E8] px-10 py-8 rounded-3xl'>
              <img
                src="/images/icons/valores.svg"
                alt="Valores"
                className='min-w-12'
              />
            </picture>
            <div className='flex flex-col justify-between text-white'>
              <p className='font-coolvetica text-3xl'>Valores</p>
              <p className='font-louis-george-cafe text-xl'>Transformação e inovação</p>
            </div>
          </div>

        </div>
      </section>

      <section className='flex flex-col gap-25 w-full max-w-360 mx-auto p-15 my-10'>

        <div className='flex flex-col gap-2.5 place-self-center text-center text-white'>
          <p className='font-coolvetica text-4xl'>Pilares</p>
          <div className='w-50 h-1 rounded-full bg-secondary-1'/>
        </div>

        <div className='flex justify-between gap-10'>

          <div className='flex flex-col items-center max-w-100'>

            <picture className='w-80 h-80 rounded-3xl overflow-hidden drop-shadow-[10px_10px_4px] drop-shadow-black/50'>
              <img
                src="/images/cards/fusao-empresas-o-que-e.jpg.png"
                alt="Empresas Parceiras"
                className='w-full h-full object-cover'
              />
            </picture>

            <div className='flex flex-col gap-10 text-3xl text-white text-center font-light'>
              <p className='font-medium py-8'>Empresas Parceiras</p>
              <p>Organizações que se conectam com a Fábrica em busca de soluções tecnológicas para suas demandas.</p>
              <p>Essas parcerias fortalecem o elo entre o mercado e a academia.</p>
            </div>

          </div>

          <div className='flex flex-col items-center max-w-100'>

            <picture className='w-80 h-80 rounded-3xl overflow-hidden drop-shadow-[10px_10px_4px] drop-shadow-black/50'>
              <img
                src="/images/cards/jovens trabalhando.jpg"
                alt="Extensionistas"
                className='w-full h-full object-cover'
              />
            </picture>

            <div className='flex flex-col gap-10 text-3xl text-white text-center font-light'>
              <p className='font-medium py-8'>Extensionistas</p>
              <p>Alunos que, após um processo seletivo, são integrados às equipes de projetos.</p>
              <p>Cada extensionista atua em sua área de especialização, sob a supervisão de professores Tech Leads.</p>
            </div>

          </div>

          <div className='flex flex-col items-center max-w-100'>

            <picture className='w-80 h-80 rounded-3xl overflow-hidden drop-shadow-[10px_10px_4px] drop-shadow-black/50'>
              <img
                src="/images/cards/demandas.jpg"
                alt="Demandas de Projetos"
                className='w-full h-full object-cover'
              />
            </picture>

            <div className='flex flex-col gap-10 text-3xl text-white text-center font-light'>
              <p className='font-medium py-8'>Demandas de Projetos</p>
              <p>As necessidades levantadas pelas empresas são transformadas em projetos reais.</p>
              <p>Cada demanda se torna um aprendizado, com equipes formadas sob medida para atender requisitos da solução.</p>
            </div>

          </div>

        </div>
      </section>
    </>
  )
}
