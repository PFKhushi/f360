import React from 'react'
import InputText from '../Inputs/InputText'

const MyProfile = () => {
  return (
    <div className="w-full md:p-4 flex flex-col justify-center items-center bg-dark-purple rounded-xl text-white">
      <h1 className='md:text-3xl mb-8 mt-8'>Editar Perfil</h1>
      <div className="flex flex-col md:grid grid-cols-2 justify-center items-center gap-4 md:gap-12">
        <div>
          <InputText
            label="RGM"
            placeholder="Insira seu RGM"
            type="text"
          />
        </div>
        <div>
          <InputText
            label="CPF"
            placeholder="Insira seu CPF"
            type="text"
          />
        </div>
        <div>
          <InputText
            label="CPF"
            placeholder="Insira seu CPF"
            type="text"
          />
        </div>
        <div>
          <InputText
            label="CPF"
            placeholder="Insira seu CPF"
            type="text"
          />
        </div>
      </div>
      <button
          type="submit"
          className="text-secondary font-bold text-xl bg-light-grey flex items-center justify-center m-auto p-4 rounded-md mt-12 md:mt-28 md:w-60"
        >
          ATUALIZAR
        </button>
    </div>
  )
}

export default MyProfile