import { twMerge } from "tailwind-merge";

export default function Dashboard() {
  return (
    <main className="bg-primary-4 h-full py-6 px-6 sm:px-[24px]">
      <div className="flex flex-col w-full gap-10 max-w-[900px] mx-auto">

        <div className="flex flex-col gap-5 text-center sm:text-left">
          <h1 className="text-white text-[32px] sm:text-[40px] font-coolvetica">
            Conheça a Fábrica
          </h1>
          <p className="text-white text-[20px] sm:text-[24px] font-louis-george-cafe">
            Informações essenciais para a sua experiência
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-10">
          <Card
            title="Como funciona a imersão?"
            description="O processo imersionista inicia-se com uma semana de palestras e duas semanas de workshops."
          />
          <Card
            title="Quais são as funções que exercerei?"
            description="O aluno pode exercer as funções de Dev. Front End/Back End, Analista de Dados, Product Owner, Designer UX/UI, Dev. Mobile/Jogos"
          />
          <Card
            title="Existe a possibilidade de ser contratado pelas empresas parceiras?"
            description="Após certo tempo e experiência desenvolvendo software na Fábrica de Software, o aluno pode estagiar ou ser contratado para atuar nas empresas parceiras da Fábrica."
            className="sm:col-span-2 sm:min-h-[210px]"
          />
        </div>

      </div>
    </main>
  );
}

function Card({title, description, className}: {title: string, description: string, className?: string}){
  return(
    <div className={twMerge(
      "flex flex-col gap-7 bg-primary-1 text-white w-full min-h-[200px] sm:min-h-[240px] rounded-[20px] p-8 drop-shadow-[5px_5px_3px] drop-shadow-secondary-2",
      className
    )}>
      <div className="w-fit self-center">
        <h1 className="text-xl sm:text-2xl text-center">
          {title}
        </h1>
        <div className="bg-secondary-1 h-[5px] max-w-2/3 rounded-[5px] mt-3 mx-auto" />
      </div>
      <p className="text-lg sm:text-xl font-light text-justify">
        {description}
      </p>
    </div>
  )
}
