import React from 'react'
import { LiaUserCircle } from 'react-icons/lia'

export default function PerfilUsuario() {
  return (
    <div className='h-screen px-[10px] bg-primary-4 flex md:items-center justify-center'>
      <main className='text-white max-h-[600px] md:bg-primary-1 max-w-[800px] md:min-w-[550px] rounded-[20px] drop-shadow-[10px_10px_4px] drop-shadow-black/25'>
        <header className='w-full md:bg-primary-3 h-[100px] rounded-[20px]'>
          <div className='pt-4 pl-4 md:pl-16 flex items-center gap-3 text-2xl font-bold'>
            <LiaUserCircle className='w-18 h-18'/>
            Aluno
          </div>
        </header>
        <article className='flex p-4 pl-8 md:pl-20'>
          <section className='flex flex-col justify-around w-[45%]'>
            <div>
              <h1 className='font-bold text-[18px]'>Email</h1>
              <p className='break-words'>aluno@gmail.com</p>
            </div>
            <div>
              <h1 className='font-bold text-[18px]'>Matrícula</h1>
              <p>123456789</p>
            </div>
            <div>
              <h1 className='font-bold text-[18px]'>Área da imersão</h1>
              <p>Dev. Frot End</p>
            </div>
          </section>
          <div className='flex justify-center w-[8%]'>
            <div className='h-[215px] mt-7 w-1 bg-secondary-1'></div>
          </div>
          <section className='flex flex-col justify-around w-[45%]'>
            <div>
              <h1 className='font-bold text-[18px]'>CPF</h1>
              <p>098.765.432-32</p>
            </div>
            <div>
              <h1 className='font-bold text-[18px]'>Telefone</h1>
              <p>(99)91111-1111</p>
            </div>
            <div>
              <h1 className='font-bold text-[18px]'>Status</h1>
              <p>Extensionista</p>
            </div>
          </section>
        </article>
        <div className='p-4 pl-8 md:pl-20 '>
          <h1 className='font-bold text-[18px]'>Experiência Prévia</h1>
          <p className='max-h-[100px] overflow-auto md:scrollbar-none text-justify pr-5'>Atuou como front end em certa empresa</p>
        </div>
        <div className='flex justify-center pb-5'>     
          <button className='bg-secondary-2 rounded-[10px] py-[10px] px-[60px]'>Editar</button>
        </div> 
      </main>
    </div>
  )
}