import { RadioGroup } from '@headlessui/react'
import React from 'react'

interface RadioGroupOptionProps {
  value: string
  text: string
}

export default function RadioGroupOption({
  value,
  text,
}: RadioGroupOptionProps) {
  return (
    <RadioGroup.Option value={value}>
      {({ checked }) => (
        <span
          className={`border py-4 md:py-14 w-16 md:w-28 lg:w-44 h-16 rounded-md relative flex items-center justify-center  hover:bg-hover-primary cursor-pointer ${
            checked ? 'bg-light-purple' : ''
          }`}
        >
          {text}
        </span>
      )}
    </RadioGroup.Option>
  )
}
