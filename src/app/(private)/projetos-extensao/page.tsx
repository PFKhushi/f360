'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const projetosDisponiveis = [
  {
    titulo: 'Projeto IASS',
    descricao: 'Desenvolvimento de um Website para atendimento ao público.',
    imagem: '/images/partners/iass.png',
  },
  {
    titulo: 'Projeto Btor',
    descricao: 'Desenvolvimento de um aplicativo Mobile para a empresa..',
    imagem: '/images/partners/btor.png',
  },
  {
    titulo: 'Projeto Justiça Federal',
    descricao: 'Desenvolvimento de um aplicativo Mobile para atendimento ao público.',
    imagem: '/images/partners/jfpb.svg',
  },
  {
    titulo: 'Projeto Conte',
    descricao: 'Desenvolvimento de um aplicativo Mobile para a empresa.',
    imagem: '/images/partners/conte.svg',
  }
]

export default function ProjetosExtensao() {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsVisiveis, setCardsVisiveis] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const largura = window.innerWidth;

      if (largura >= 1024) setCardsVisiveis(3);
      else if (largura >= 640) setCardsVisiveis(2);
      else setCardsVisiveis(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = () => {
    if (startIndex + cardsVisiveis < projetosPessoais.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const visiveis = projetosPessoais.slice(startIndex, startIndex + cardsVisiveis);

  return (
    <main className="h-full bg-gradient-to-b from-[#17113A] to-[#411CCF] py-6">
      <div className="flex flex-col items-center gap-10 max-w-[1200px] mx-auto">
        <h1 className="text-white text-[32px] md:text-[40px] font-coolvetica">
          Meus Projetos
        </h1>

        <div className="relative flex items-center justify-center w-full px-4">

          {/* Botão esquerdo */}
          <button
            onClick={prev}
            disabled={startIndex === 0}
            className="absolute left-0 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition disabled:opacity-30"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Carrossel dos Cards */}
          <div className="flex gap-6 justify-center w-full overflow-hidden">
            {visiveis.map((projeto, i) => (
              <div
                key={i}
                className="flex flex-col bg-primary-1 min-h-[300px] rounded-[20px] gap-6 p-4 w-full max-w-[350px] flex-shrink-0"
              >
                <picture>
                  <img
                    src={projeto.imagem}
                    alt={`Logo ${projeto.titulo}`}
                    className="w-full h-full object-contain max-w-[60px]"
                  />
                </picture>

                <h1 className="text-white text-[22px] font-roboto">
                  {projeto.titulo}
                </h1>

                <p className="text-white text-[16px] font-roboto text-justify">
                  {projeto.descricao}
                </p>

                <div
                  className={`w-full max-w-[150px] min-h-[35px] rounded-[8px] 
                  ${ projeto.status === 'Em andamento' ? 'bg-secondary-3' : 'bg-secondary-4'}`}
                >
                  <p
                    className={`text-[18px] font-louis-george-cafe text-center p-1 italic 
                    ${ projeto.status === 'Em andamento' ? 'text-[#FFEA74]' : 'text-[#C3FFCE]'}`}
                  >
                    {projeto.status}
                  </p>
                </div>

              </div>
            ))}
          </div>

          {/* Botão direito */}
          <button
            onClick={next}
            disabled={startIndex + cardsVisiveis >= projetosPessoais.length}
            className="absolute right-0 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition disabled:opacity-30"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        <div className="bg-secondary-1 h-[5px] w-[200px] md:w-[275px] rounded-[5px] mx-auto" />

        {/* Seção Projetos Disponíveis */}
        <div className='flex flex-col items-center gap-10 max-w-[1200px] mx-auto'>

          <h1 className="text-white text-[32px] md:text-[34px] font-coolvetica">
            Projetos Disponíveis
          </h1>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {projetosDisponiveis.map((projeto, index) => (
              <div
                key={index}
                className='flex flex-col bg-primary-1 min-h-[300px] max-w-[350px] rounded-[20px] gap-6 p-4'
              >
                
                <div className="h-[60px] flex items-center ">
                    <img 
                    src={projeto.imagem}
                    alt={`Logo ${projeto.titulo}`} 
                    className='w-full h-full max-w-[60px]'
                    />
                </div>

                <h1 className="text-white text-[22px] font-roboto">
                {projeto.titulo}
                </h1>

                <p className="text-white text-[16px] font-roboto text-justify">
                {projeto.descricao}
                </p>

                <div className='w-full max-w-[150px] min-h-[45px] rounded-[20px] bg-secondary-2'>
                <p className='text-white text-[18px] text-center font-roboto text-decoration-line: underline p-2'>
                  Saiba mais
                </p>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </main>
  );
}
