
import CarrouselMyProjects from '@/app/components/CarrouselMyProjects';

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
  
  return (
    <main className="bg-gradient-to-b from-[#17113A] to-[#411CCF] p-6">
      <div className="flex flex-col items-center-safe gap-10 max-w-[1024px] mx-auto">
        
        <h1 className="text-white text-[32px] md:text-[34px] font-coolvetica">
          Meus Projetos
        </h1>

        <CarrouselMyProjects/>

        <div className="bg-secondary-1 h-[5px] w-full max-w-[300px] rounded-[5px]" />

        {/* Seção Projetos Disponíveis */}
        <div className='flex flex-col items-center gap-10'>

          <h1 className="text-white text-[32px] md:text-[34px] font-coolvetica">
            Projetos Disponíveis
          </h1>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 sm:gap-y-18'>
            {projetosDisponiveis.map((projeto, index) => (
              <Project
                key={index}
                {...projeto}
              />
            ))}
          </div>

        </div>

      </div>
    </main>
  );
}

function Project({descricao, imagem, titulo}: {titulo: string, descricao: string, imagem: string;}){

  return(
    <div className='flex flex-col justify-between bg-primary-1 text-white min-h-[400px] max-w-[360px] rounded-[20px] gap-6 p-6 drop-shadow-[6px_6px_4px] drop-shadow-black/50'>

      <div className='flex flex-col gap-6'>
        <picture className='h-22 max-w-58 self-center sm:self-start'>
          <img 
            src={imagem}
            alt={`Logo ${titulo}`} 
            className='h-full w-full object-contain'
          />
        </picture>
        <h1 className="text-2xl sm:text-3xl text-center sm:text-left">
          {titulo}
        </h1>
        <p className="text-lg sm:text-xl font-light text-justify">
          {descricao}
        </p>
      </div>
      <div className='w-full max-w-[150px] px-5 py-4 rounded-[20px] bg-secondary-2 self-center sm:self-start'>
        <p className='text-[18px] text-center text-decoration-line: underline p-2'>
          Saiba mais
        </p>
      </div>

    </div>
  )
}
