/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import RadioGroupOption from './RadioGroupOption'
import { UseFormSetValue } from 'react-hook-form'
import { imersaoFormSchemaType } from '../imersaoFormSchema'

interface RadioGroupProps {
  label: string
  setValue: UseFormSetValue<imersaoFormSchemaType>
  name: any
  nameTech: any
  error?: any
  tecnologia: number
}

export default function Radio({
  label,
  setValue,
  name,
  nameTech,
  error,
  tecnologia,
}: RadioGroupProps) {
  const [plan, setPlan] = useState('')
  const [range] = useState([
    { value: 'Trainee', text: 'Trainee' },
    { value: 'Júnior', text: 'Júnior' },
    { value: 'Pleno', text: 'Pleno' },
    { value: 'Sênior', text: 'Sênior' },
  ])

  function setRadio(e: any) {
    setPlan(e)
    setValue(name, String(e))
    setValue(nameTech, tecnologia)
  }

  return (
    <div className="py-2 w-full">
      <RadioGroup
        value={plan}
        onChange={(e) => setRadio(e)}
        className="flex flex-col gap-2"
      >
        <RadioGroup.Label className="text-accent text-xl md:text-xl font-semibold">
          {label}
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
    </div>
  )
}
