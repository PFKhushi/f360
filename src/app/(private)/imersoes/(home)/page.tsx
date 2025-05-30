import CardAvailableImmersion from "@/app/components/CardAvailableImmersion";
import CardGeneralImmersion from "@/app/components/CardGeneralImmersion";

export default function Imersoes() {

  const availableImmersions = [
    {
      title: "Imersão Fábrica de Software 2025.2",
      date: "Data: 16/08/25 a 28/08/25",
      presenceState: "Sem registro",
      status: "Inscrever-se"
    },
    {
      title: "Imersão Fábrica de Software 2025.1",
      date: "Data: 16/02/25 a 28/02/25",
      presenceState: "Em andamento",
      status: "Inscrito"
    }
  ]

  const generalImmersions = [
    {
      title: "Imersão Fábrica de Software 2024.2",
      date: "Data: 16/08/24 a 28/08/24",
      status: "Presente"
    },
    {
      title: "Imersão Fábrica de Software 2024.1",
      date: "Data: 16/02/24 a 28/02/24",
      status: "Ausente"
    },
    {
      title: "Imersão Fábrica de Software 2023.2",
      date: "Data: 16/08/23 a 28/08/23",
      status: "Ausente"
    }, 
  ]

  return (
    <div className='h-full text-white bg-gradient-to-b from-primary-5 to-[#411ccf]'>

      <div className='flex flex-col items-center gap-4 pt-4 max-w-[1074px]'>
        <h1 className='text-[28px] font-coolvetica'>Imersões disponíveis</h1>
        <div className='flex justify-between gap-5 w-full px-12'>
          {availableImmersions.map((immersion, index) =>(
            <CardAvailableImmersion 
              key={index}
              title={immersion.title}
              date={immersion.date}
              presenceState={immersion.presenceState}
              status={immersion.status}
            />
          ))}
        </div>
      </div>

      <div className='px-10'>
        <h1 className='px-4 pb-1 pt-4 text-[28px] font-coolvetica'>Imersões gerais</h1>
        <div className='flex gap-5'>
          {generalImmersions.map((immersion, index) =>(
            <CardGeneralImmersion
              key={index}
              title={immersion.title}
              date={immersion.date}
              status={immersion.status}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
