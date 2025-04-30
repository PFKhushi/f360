import Banner from '@/app/components/Banner'
import CardHistory from '@/app/components/CardHistory'
import CardPillar from '@/app/components/CardPillar'
import CardValues from '@/app/components/CardValues'
import React from 'react'

export default function LandingPage() {
  return (
    <>
      <Banner/>
      
      <section className='flex flex-col gap-15 lg:gap-25 w-full max-w-360 mx-auto p-5 lg:p-15 my-10'>
        <CardHistory
          srcImage='/images/cards/IMG-20240823-WA0031.jpg'
          altImage='Turma de Extensionistas'
        >
          <div className='w-fit *:font-coolvetica *:text-3xl self-center lg:self-auto font-normal'>
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
        </CardHistory>
        <CardHistory
          srcImage='/images/cards/sala-fabrica.jpg'
          altImage='Sala da Fábrica de Software'
          positionImage='right'
        >
          <p>
            Ao longo dos anos, dezenas de projetos foram desenvolvidos com empresas reais, preparando centenas de alunos para o mercado de trabalho com uma experiência prática, dinâmica e enriquecedora.
          </p>
          <p>
            A Fábrica é hoje um dos pilares do aprendizado aplicado na Unipê, sendo reconhecida como um ambiente que simula uma empresa real dentro do contexto acadêmico.
          </p>
        </CardHistory>
      </section>

      <section className='bg-primary-1 mx-auto px-4 xl:px-8 py-8 my-10'>
        <div className='flex flex-col items-center lg:flex-row gap-10 lg:gap-4 max-w-360 justify-between mx-auto'>
          <CardValues
            srcImage='/images/icons/missão.svg'
            altImage='Missão'
            title='Missão'
            description='Preparar os alunos da Unipê para o mercado de trabalho'
          />
          <CardValues
            srcImage='/images/icons/visão.svg'
            altImage='Visão'
            title='Visão'
            description='Capacitar e mudar o mercado de tecnologia da cidade'
            className='px-8.5'
          />
          <CardValues
            srcImage='/images/icons/valores.svg'
            altImage='Valores'
            title='Valores'
            description='Transformação e inovação'
          />
        </div>
      </section>

      <section className='flex flex-col gap-25 w-full max-w-360 mx-auto px-5 py-15 lg:p-15 my-10'>

        <div className='flex flex-col gap-2.5 place-self-center text-center text-white'>
          <p className='font-coolvetica text-4xl'>Pilares</p>
          <div className='w-50 h-1 rounded-full bg-secondary-1'/>
        </div>

        <div className='flex flex-col lg:flex-row items-center lg:items-start justify-between gap-20 lg:gap-10'>
          <CardPillar
            srcImage='/images/cards/fusao-empresas-o-que-e.jpg.png'
            altImage='Empresas Parceiras'
            title='Empresas Parceiras'
          >
            <p>Organizações que se conectam com a Fábrica em busca de soluções tecnológicas para suas demandas.</p>
            <p>Essas parcerias fortalecem o elo entre o mercado e a academia.</p>
          </CardPillar>
          <CardPillar
            srcImage='/images/cards/jovens trabalhando.jpg'
            altImage='Extensionistas'
            title='Extensionistas'
          >
            <p>Alunos que, após um processo seletivo, são integrados às equipes de projetos.</p>
            <p>Cada extensionista atua em sua área de especialização, sob a supervisão de professores Tech Leads.</p>
          </CardPillar>
          <CardPillar
            srcImage='/images/cards/demandas.jpg'
            altImage='Demandas de Projetos'
            title='Demandas de Projetos'
          >
            <p>As necessidades levantadas pelas empresas são transformadas em projetos reais.</p>
            <p>Cada demanda se torna um aprendizado, com equipes formadas sob medida para atender requisitos da solução.</p>
          </CardPillar>
        </div>

      </section>
    </>
  )
}
