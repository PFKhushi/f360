/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { habilidadesGet } from '@/hook/habilidadesGet'
import { Combobox } from '@headlessui/react'
import React, { Fragment, useEffect, useState } from 'react'
import { FaCheck, FaPlus } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import Radio from './RadioGroup/RadioGroup'

interface HabilidadesSelectProps {
  label: string
  errors: any
  contentName: string
  setValue: any
  defaultHabilidades?: number[]
  watch: any
  fields: any
  append: any
  remove: any
}

export default function HabilidadesSelect({
  label,
  setValue,
  errors,
  contentName,
  defaultHabilidades,
  fields,
  append,
  remove,
}: HabilidadesSelectProps) {
  const { habilidades } = habilidadesGet()
  const [selectedHabilidadeId, setSelectedHabilidadeId] = useState<
    number | null
  >(0)
  const [query, setQuery] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])

  function setSelectedHabilidades(selectedOptions: number[]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setValue(contentName, selectedOptions)
  }

  useEffect(() => {
    if (defaultHabilidades && defaultHabilidades.length > 0) {
      setSelectedOptions(defaultHabilidades)
      setSelectedHabilidades(defaultHabilidades)
    }
  }, [defaultHabilidades])

  useEffect(() => {
    fields.forEach((field: any, index: number) => remove(index))

    // Adiciona novos campos baseados em selectedOptions
    selectedOptions.forEach((optionId) => {
      const habilidade = habilidades.find((h) => h.id === optionId)
      if (habilidade) {
        append({
          id: optionId,
          senioridade: '', // Inicializa como vazio
          tecnologias: optionId, // Ou qualquer valor relevante
        })
      }
    })
  }, [selectedOptions])

  const handleAddOption = () => {
    if (
      selectedHabilidadeId &&
      !selectedOptions.includes(selectedHabilidadeId)
    ) {
      const updatedOptions = [...selectedOptions, selectedHabilidadeId]
      setSelectedOptions(updatedOptions)
      setValue('regiao', updatedOptions)
      setSelectedHabilidades(updatedOptions)
    }
  }

  const handleRemoveOption = (habilidadeId: number) => {
    // Remova a habilidade do array de opções selecionadas
    const updatedOptions = selectedOptions.filter((id) => id !== habilidadeId)
    setSelectedOptions(updatedOptions)
    setSelectedHabilidades(updatedOptions)

    // Encontre o índice do campo correspondente no array de campos
    const indexToRemove = fields.findIndex(
      (field: any) => field.tecnologias === habilidadeId,
    )
    if (indexToRemove !== -1) {
      remove(indexToRemove)
    }
  }

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
              className={` w-80 md:w-72 lg:w-96 h-9 rounded-md text-black p-2 border mt-2`}
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

      <div className="mt-2 col-span-2">
        <p className="mb-2 font-semibold">Suas habilidades:</p>
        <div className="col-span-2 p-4 bg-light-purple rounded-md">
          <h3 className="text-lg font-bold mb-2 text-dark-yellow">
            Níveis de Senioridade
          </h3>
          <ul className="list-disc list-inside text-white">
            <li>
              <strong>TRAINEE</strong>: Menos de 3 meses de experiência
            </li>
            <li>
              <strong>JÚNIOR</strong>: Menos de 1 ano de experiência
            </li>
            <li>
              <strong>PLENO</strong>: De 1 a 3 anos de experiência
            </li>
            <li>
              <strong>SÊNIOR</strong>: Mais de 3 anos de experiência
            </li>
          </ul>
        </div>
        <div className="text-dark-purple font-semibold md:p-2 p-1 w-full rounded mb-1 flex flex-col mt-4 gap-4 justify-between">
          {fields.map((field: any, index: number) => {
            const habilidade = habilidades.find(
              (h) => h.id === field.tecnologias,
            )
            if (habilidade) {
              return (
                <li
                  key={field.id}
                  className="border-2 border-dashed border-white font-semibold p-4 w-full rounded mb-1 flex items-start justify-between relative"
                >
                  <Radio
                    key={index}
                    label={habilidade.nome}
                    setValue={setValue}
                    name={`habilidades.${index}.senioridade`}
                    nameTech={`habilidades.${index}.tecnologias`}
                    error={errors.habilidades?.[index]?.senioridade}
                    tecnologia={habilidade.id}
                  />

                  <button
                    onClick={() => handleRemoveOption(habilidade.id)}
                    className="text-white absolute right-2 top-2"
                    type="button"
                  >
                    <IoClose className="text-white bg-red-700 rounded-full h-7 w-7" />
                  </button>
                </li>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}
