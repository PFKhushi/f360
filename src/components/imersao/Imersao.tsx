'use client'
import { Path, PathValue } from 'react-hook-form'
import Radio from './RadioGroup/RadioGroup'

export default function Imersao() {
  return (
    <div>
      <h1>INSCREVER-SE</h1>
      <Radio
        label={'teste'}
        setValue={console.log}
        name={[]}
        errorText={''}
      ></Radio>
    </div>
  )
}
