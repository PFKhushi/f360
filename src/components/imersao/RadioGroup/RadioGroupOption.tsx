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
          className={`border min-h-14 sm:min-h-none md:py-14 min-w-14 sm:w-16 md:w-28 lg:w-44 rounded-md relative flex items-center justify-center  hover:bg-hover-primary cursor-pointer ${
            checked ? 'bg-light-purple' : ''
          }`}
        >
          {text}
        </span>
      )}
    </RadioGroup.Option>
  )
}
