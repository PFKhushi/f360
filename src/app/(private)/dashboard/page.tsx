export default function Dashboard() {
  return (
    <main className=" bg-primary-4 h-full py-6 px-6 md:px-[24px]">

      <div className="flex flex-col w-full gap-10 max-w-[780px] mx-auto">

      <div className="flex flex-col gap-5 text-center md:text-left w-full">
        <h1 className="text-white text-[32px] md:text-[40px] font-coolvetica">
          Conheça a Fábrica
        </h1>
        <p className="text-white text-[20px] md:text-[24px] font-louis-george-cafe">
          Informações essenciais para a sua experiência
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-center">
        
        {/* Card 1 */}
        <div className=" w-full max-w-[370px]">
          {/* <div className="absolute bg-secondary-1 w-full h-[240px] rounded-[20px] ml-2 mt-1"></div> */}
          <div className=" bg-primary-1 w-full min-h-[240px] rounded-[20px] drop-shadow-[4px_4px_0px] drop-shadow-secondary-1">
            <h1 className="text-white text-[22px] font-roboto px-6 py-4 text-center">
              Como funciona a imersão?
            </h1>
            <div className="bg-secondary-1 h-[5px] w-[140px] rounded-[5px] mx-auto" />
            <p className="text-white text-[18px] font-roboto text-justify px-6 py-6">
              A jornada começa com uma semana de palestras, seguida por duas semanas intensas de workshops.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="w-full max-w-[370px]">
          {/* <div className="absolute bg-secondary-1 w-full h-[240px] rounded-[20px] ml-2 mt-1"></div> */}
          <div className=" bg-primary-1 w-full min-h-[240px] rounded-[20px] drop-shadow-[4px_4px_0px] drop-shadow-secondary-1">
            <h1 className="text-white text-[22px] font-roboto px-6 py-4 text-center">
              Quais são as funções que exercerei?
            </h1>
            <div className="bg-secondary-1 h-[5px] w-[140px] rounded-[5px] mx-auto" />
            <p className="text-white text-[18px] font-roboto text-justify px-6 py-6">
              Você poderá atuar como Dev Front/Back End, PO, UX/UI, Analista de Dados ou Dev Mobile/Jogos.
            </p>
          </div>
        </div>

      </div>

      {/* Card Extra */}
      <div className="w-full md:h-[200px] h-auto ">
        {/* <div className="absolute bg-secondary-1 w-full h-full rounded-[20px] ml-2 mt-1"></div> */}
        <div className=" bg-primary-1 w-full h-full rounded-[20px] py-6 px-6 md:px-10 md:py-0 flex flex-col justify-center drop-shadow-[4px_4px_0px] drop-shadow-secondary-1">
          <h1 className="text-white text-[22px] md:text-[22px] font-roboto text-center">
            Existe a possibilidade de ser contratado pelas empresas parceiras?
          </h1>
          <div className="bg-secondary-1 h-[5px] w-[200px] md:w-[275px] rounded-[5px] mt-2 mb-4 mx-auto" />
          <p className="text-white text-[18px] md:text-[18px] font-roboto text-justify max-w-[550px] mx-auto">
            Após certo tempo e experiência desenvolvendo software na Fábrica 
            de Software, o aluno pode estagiar ou ser contratado para atuar 
            nas empresas parceiras da Fábrica.
          </p>
        </div>
      </div>

      </div>

    </main>
  );
}
