import Image from "next/image";

export default function termoDeUso() {
  return (
   <div className="pb-12">
      <div className="pt-8">
        <Image
          src="/img/LOGO-ROXA-LETREIRO-HORIZONTAL1.png"
          alt="Logo"
          width={290}
          height={147}
          className="m-auto mt-8"
        />
      </div>
      <div className="flex flex-row justify-center mt-14 md:space-x-8 space-x-3  items-center">
        <p className="border-b-2 w-20 md:w-[29%]  "></p>
        <h1 className="md:text-3xl text-lg font-bold">Termos de Uso</h1>
        <p className="border-b-2 w-20 md:w-[29%] "></p>
      </div>
      <p className="text-center mt-3 md:text-2xl">Data da última atualização: 01/11/2024 </p>
      <div className="ml-8 md:ml-28 lg:ml-60  mt-8">
          <p className="text-1xl md:text-3xl font-bold"><span className="text-dark-yellow">1.</span> Aceitação dos Termos</p>
          <ul className="list-disc">
            <li className="ml-14  text-justify mt-3 text-sm md:text-xl w-56  md:w-[70%]">Ao prosseguir com o cadastro e fornecer informações adicionais como RGM, CPF e Telefone, você aceita e concorda com os Termos de Uso aqui descritos. Este documento detalha como os dados fornecidos serão utilizados e armazenados em conformidade com as leis de proteção de dados vigentes.</li>
          </ul>
          <p className="text-1xl md:text-3xl mt-8 font-bold"><span className="text-dark-yellow">2.</span> Coleta e Uso dos Dados</p>
          <ul className="list-disc">
            <li className="ml-14  text-justify mt-3 text-sm md:text-xl w-56  md:w-[70%]">
            Os dados adicionais coletados (RGM, CPF e Telefone) serão utilizados exclusivamente para:</li>
            <ol className="list-decimal mt-3 space-y-3">
              <li className="ml-20">Verificação da identidade do usuário.</li>
              <li className="ml-20">Fornecimento de serviços específicos, caso necessário.</li>
              <li className="ml-20">Garantir a segurança de acesso à plataforma.</li>
            </ol>
          </ul>
          <p className="text-1xl md:text-3xl font-bold mt-8"><span className="text-dark-yellow">3.</span> Armazenamento e Proteção de Dados</p>
          <ul className="list-disc">
            <li className="ml-14  text-justify mt-3 text-sm md:text-xl w-56  md:w-[70%]">Garantimos que as informações fornecidas serão armazenadas de forma segura e serão acessíveis apenas para a equipe responsável pela gestão da plataforma. Tomamos medidas técnicas e administrativas para proteger os dados contra acessos não autorizados e qualquer forma de uso indevido.</li>
          </ul>
          <p className="text-1xl md:text-3xl font-bold mt-8"><span className="text-dark-yellow">4.</span> Direitos dos Usuários</p>
          <ul className="list-disc">
            <li className="ml-14  text-justify mt-3 text-sm md:text-xl w-56  md:w-[70%]">Você tem o direito de acessar, corrigir e excluir as informações fornecidas a qualquer momento. Para isso, entre em contato com nossa equipe de suporte.</li>
          </ul>
          <p className="text-1xl md:text-3xl font-bold mt-8"><span className="text-dark-yellow">5.</span> Responsabilidades dos Usuários</p>
          <ul className="list-disc">
            <li className="ml-14  text-justify mt-3 text-sm md:text-xl w-56  md:w-[70%]">É de responsabilidade do usuário fornecer informações verdadeiras e atualizadas, bem como manter a segurança e confidencialidade de suas credenciais de acesso.</li>
          </ul>
          <p className="text-1xl md:text-3xl font-bold mt-8"><span className="text-dark-yellow">6.</span> Modificações nos Termos de Uso</p>
          <ul className="list-disc">
            <li className="ml-14  text-justify mt-3 text-sm md:text-xl w-56  md:w-[70%]">Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As atualizações serão informadas previamente e estarão disponíveis para consulta.</li>
          </ul>
          <p className="text-1xl md:text-3xl font-bold mt-8"><span className="text-dark-yellow">7.</span> Contato</p>
          <ul className="list-disc">
            <li className="ml-14 text-justify mt-3 text-sm md:text-xl w-56  md:w-[70%]">Caso tenha dúvidas sobre este Termo de Uso ou sobre o uso das suas informações, entre em contato com nossa equipe de suporte através do e-mail [email de contato].</li>
          </ul>
          




      </div>


   </div>
  )
}
