import { RadioGroup } from '@headlessui/react'
import React from 'react'

interface RadioGroupOptionProps {
  value: string
}

export default function RadioGroupOption({ value }: RadioGroupOptionProps) {
  return (
    <RadioGroup.Option value={value}>
      {({ checked }) => (
        <span
          className={`border py-4 md:py-14 rounded-md relative flex justify-center  hover:bg-hover-primary cursor-pointer ${
            checked ? 'bg-light-purple' : ''
          }`}
        >
          {value}
        </span>
      )}
    </RadioGroup.Option>
  )
}
