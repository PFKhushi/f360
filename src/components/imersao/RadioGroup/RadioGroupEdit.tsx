/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import RadioGroupOption from './RadioGroupOption'
import { Experiencia } from '@/@types'
import { habilidadesGet } from '@/hook/habilidadesGet'
import { IoClose } from 'react-icons/io5'
import { DeleteData, PatchData } from '@/services/axios'
import toast from 'react-hot-toast'

interface RadioGroupProps {
  experiencia: Experiencia
  experienceRefetch: () => void
}

export default function RadioGroupEdit({
  experiencia,
  experienceRefetch,
}: RadioGroupProps) {
  const [plan, setPlan] = useState(experiencia.senioridade)
  const [error, setError] = useState(false)
  const [range] = useState([
    { value: 'Trainee', text: 'Trainee' },
    { value: 'Júnior', text: 'Júnior' },
    { value: 'Pleno', text: 'Pleno' },
    { value: 'Sênior', text: 'Sênior' },
  ])

  const { habilidades } = habilidadesGet()

  function setRadio(e: any) {
    setPlan(e)

    PatchData({
      url: `/usuario/experiencias/${experiencia.id}/`,
      data: {
        senioridade: e,
      },
      onSuccess: () => {
        toast.success('Habilidade atualizada com sucesso')
        experienceRefetch()
      },
      onError: () => {
        setError(true)
      },
    })
  }

  function handleDelete() {
    DeleteData({
      url: `/usuario/experiencias/${experiencia.id}/`,
      onSuccess: () => {
        toast.success('Experiência excluída com sucesso')
        experienceRefetch()
      },
      onError: () => {
        setError(true)
      },
    })
  }

  return (
    <div className="py-2 w-full">
      <RadioGroup
        value={plan}
        onChange={(e) => setRadio(e)}
        className="flex flex-col gap-2"
      >
        <RadioGroup.Label className="text-accent text-xl md:text-xl font-semibold">
          {habilidades.find((h) => h.id === experiencia.tecnologias)?.nome}
        </RadioGroup.Label>
        <div className="flex justify-center">
          <div className="grid grid-cols-4 gap-x-1 py-4  md:gap-x-10 text-xs md:text-xl text-white">
            {range.map((item, index) => (
              <RadioGroupOption
                key={index}
                value={item.value}
                text={item.text}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center">
          {error && (
            <span className="text-red-500 text-sm font-semibold ml-1">
              Algo ocorreu errado ao adicionar a habilidade
            </span>
          )}
        </div>
      </RadioGroup>
      <button className="text-white absolute right-2 top-2" type="button">
        <IoClose
          className="text-white bg-red-700 rounded-full h-7 w-7"
          onClick={handleDelete}
        />
      </button>
    </div>
  )
}
