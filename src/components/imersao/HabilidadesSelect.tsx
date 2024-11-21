/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { habilidadesGet } from '@/hook/habilidadesGet'
import { Combobox } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import { FaCheck, FaPlus } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

interface HabilidadesSelectProps {
  label: string
  errors: any
  contentName: string
  setValue: any
  defaultRegioes?: number[]
  watch: any
}

export default function HabilidadesSelect({
  label,
  setValue,
  errors,
  contentName,
  defaultRegioes,
  watch,
}: HabilidadesSelectProps) {
  const { habilidades } = habilidadesGet()
  const [selectedHabilidadeId, setSelectedHabilidadeId] = useState<
    number | null
  >(0)
  const [query, setQuery] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])

  function setSelectedRegioes(selectedOptions: number[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setValue(contentName, selectedOptions)
  }

  useEffect(() => {
    if (defaultRegioes && defaultRegioes.length > 0) {
      setSelectedOptions(defaultRegioes)
      setSelectedRegioes(defaultRegioes)
    }
  }, [defaultRegioes])

  const handleAddOption = () => {
    if (
      selectedHabilidadeId &&
      !selectedOptions.includes(selectedHabilidadeId)
    ) {
      const updatedOptions = [...selectedOptions, selectedHabilidadeId]
      setSelectedOptions(updatedOptions)
      setValue('regiao', updatedOptions)
      setSelectedRegioes(updatedOptions)
    }
  }

  const handleRemoveOption = (regiaoId: number) => {
    const updatedOptions = selectedOptions.filter((id) => id !== regiaoId)
    setSelectedOptions(updatedOptions)
    setSelectedRegioes(updatedOptions)
  }

  console.log('selected', selectedOptions)
  console.log('default', defaultRegioes)
  console.log('zod', watch('regiao'))

  const filteredHabilidades =
    query === ''
      ? habilidades
      : habilidades.filter((habilidade) => {
          return habilidade.nome.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <div className="md:grid grid-cols-2">
      <div>
        <Combobox
          value={selectedHabilidadeId}
          onChange={setSelectedHabilidadeId}
        >
          <Combobox.Label>
            <p className="font-bold text-xl md:text-2xl">{label}</p>
          </Combobox.Label>
          <div className="flex justify-start items-center gap-2">
            <Combobox.Input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquise uma habilidade"
              displayValue={(selectedHabilidadeId: number) => {
                const selectedHabilidade = habilidades.find(
                  (habilidade) => habilidade.id === selectedHabilidadeId,
                )
                return selectedHabilidade ? selectedHabilidade.nome : ''
              }}
              className={` w-80 md:w-72 lg:w-96 h-9 rounded-md text-black p-2 border mt-2 ${
                errors
                  ? 'border-2 border-red-500 outline-red-600'
                  : 'border-bordercolor-input'
              }`}
            />
            <div>
              <button
                onClick={handleAddOption}
                type="button"
                className="bg-light-grey text-dark-purple rounded-md p-2 mt-2 flex items-center justify-center h-10 w-10"
              >
                <FaPlus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {errors && (
            <span className="text-red-500 xl:text-sm text-md font-semibold ml-1">
              {errors.message}
            </span>
          )}
          <div className="mt-1 overflow-y-scroll max-h-32">
            <Combobox.Options>
              {filteredHabilidades
                .filter(
                  (habilidade) => !selectedOptions.includes(habilidade.id),
                )
                .map((habilidade) => (
                  <Combobox.Option
                    key={habilidade.id}
                    value={habilidade.id}
                    as={Fragment}
                  >
                    {({ selected }) => (
                      <li
                        className={`flex flex-col gap-1 items-start font-semibold text-dark-purple bg-light-grey border rounded-md mb-1 p-2 w-full hover:text-hover-primary`}
                      >
                        {selected && <FaCheck />}
                        <p className="ml-1">{habilidade.nome}</p>
                      </li>
                    )}
                  </Combobox.Option>
                ))}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>

      <div className="mt-2 overflow-y-scroll max-h-64 col-span-2">
        <p className="mb-2 font-semibold">Suas habilidades:</p>
        <ul className="flex flex-wrap gap-4">
          {selectedOptions.map((option) => (
            <li
              key={option}
              className="text-dark-purple font-semibold md:p-2 p-1 bg-light-grey w-full rounded mb-1 flex justify-between"
            >
              {habilidades.map((habilidade) => {
                if (habilidade.id === option) {
                  return (
                    <p key={habilidade.id} className="md:p-0 p-1 text-md">
                      {habilidade.nome}
                    </p>
                  )
                }
                return null
              })}
              <button
                onClick={() => handleRemoveOption(option)}
                className="ml-2 text-white"
              >
                <IoClose className="text-white bg-red-700 rounded-full h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
