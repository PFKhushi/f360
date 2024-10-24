/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import RadioGroupOption from './RadioGroupOption'
import { FieldErrors, UseFormSetValue } from 'react-hook-form'
import { imersaoFormSchemaType } from '../imersaoFormSchema'

interface RadioGroupProps {
  label: string
  setValue: UseFormSetValue<imersaoFormSchemaType>
  name: keyof imersaoFormSchemaType
  error?: FieldErrors<imersaoFormSchemaType>
  errorText: string
}

export default function Radio({
  label,
  setValue,
  name,
  error,
  errorText,
}: RadioGroupProps) {
  const [plan, setPlan] = useState('')
  const [range] = useState([
    { id: 1, value: '0', text: 'Nenhuma' },
    { id: 2, value: '1', text: 'Trainee' },
    { id: 3, value: '2', text: 'Junior' },
    { id: 4, value: '3', text: 'Pleno' },
    { id: 5, value: '4', text: 'Senior' },
  ])

  function setRadio(e: any) {
    setPlan(e)
    setValue(name, String(e))
  }

  return (
    <div className="py-2">
      <RadioGroup value={plan} onChange={(e) => setRadio(e)}>
        <RadioGroup.Label className="text-white">{label}</RadioGroup.Label>
        <div className="grid grid-cols-5 gap-x-1 py-4 text-white md:gap-x-10">
          {range.map((item) => (
            <RadioGroupOption
              key={item.id}
              value={item.value}
              text={item.text}
            />
          ))}
        </div>
        {error && <span className="text-red-400">{errorText}</span>}
      </RadioGroup>
    </div>
  )
}
