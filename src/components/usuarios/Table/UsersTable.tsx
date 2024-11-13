'use client'
import { User } from '@/@types'
import React, { useEffect, useState } from 'react'
import { BiSolidEdit } from 'react-icons/bi'
import { MdBlock } from 'react-icons/md'

interface UsersTableProps {
  users: User[]
}

export default function Manageusuario({ users }: UsersTableProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [nomeFiltro, setNomeFiltro] = useState('')
  const [periodoFiltro, setPeriodoFiltro] = useState('')
  const [cargoFiltro, setCargoFiltro] = useState('')
  const [projetosFiltro, setProjetosFiltro] = useState('')
  const [areaFiltro, setAreaFiltro] = useState('')
  const [especialidadeFiltro, setEspecialidadeFiltro] = useState('')

  console.log(users)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const usuarios = [
    {
      nome: 'Júlio César Carvalho Santos',
      periodo: '4',
      cargo: 'Veterano',
      projetos: ['Conte Cornetet', 'Fábrica 360'],
      area: 'FrontEnd',
      especialidade: 'Next.js',
    },
    {
      nome: 'Wallace Sartori Bonfim',
      periodo: 'N/A',
      cargo: 'Administrador',
      projetos: ['Conte Cornetet', 'Fábrica 360'],
      area: 'CEO',
      especialidade: 'N/A',
    },
    {
      nome: 'Alice da Silva',
      periodo: '2',
      cargo: 'Estagiária',
      projetos: ['Projeto Alpha', 'Inovação Beta'],
      area: 'BackEnd',
      especialidade: 'Node.js',
    },
    {
      nome: 'Bruno Oliveira',
      periodo: '6',
      cargo: 'Desenvolvedor',
      projetos: ['Fábrica 360', 'Projeto Gamma'],
      area: 'Mobile',
      especialidade: 'React Native',
    },
    {
      nome: 'Carla Souza',
      periodo: '3',
      cargo: 'Trainee',
      projetos: ['Projeto Delta'],
      area: 'UI/UX',
      especialidade: 'Figma',
    },
  ]

  const normalizeString = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  }

  const usuariosFiltrados = usuarios.filter((usuario) => {
    return (
      (nomeFiltro === '' ||
        normalizeString(usuario.nome).includes(normalizeString(nomeFiltro))) &&
      (periodoFiltro === '' ||
        normalizeString(usuario.periodo).includes(
          normalizeString(periodoFiltro),
        )) &&
      (cargoFiltro === '' ||
        normalizeString(usuario.cargo).includes(
          normalizeString(cargoFiltro),
        )) &&
      (projetosFiltro === '' ||
        usuario.projetos.some((projeto) =>
          normalizeString(projeto).includes(normalizeString(projetosFiltro)),
        )) &&
      (areaFiltro === '' ||
        normalizeString(usuario.area).includes(normalizeString(areaFiltro))) &&
      (especialidadeFiltro === '' ||
        normalizeString(usuario.especialidade).includes(
          normalizeString(especialidadeFiltro),
        ))
    )
  })

  return (
    <div className="w-full md:p-4 flex flex-col justify-center items-center bg-dark-purple rounded-xl">
      <div className="flex flex-col items-center w-full mb-1 md:justify-normal">
        <div className="w-full flex items-center justify-center md:justify-between md:flex-row md:gap-0 flex-col gap-4 p-4 rounded-lg bg-dark-purple">
          <h2 className="text-2xl md:text-4xl font-semibold mb-1 text-text-primary text-white">
            Gerenciar usuários
          </h2>
        </div>
        <div className="min-h-24 w-full bg-dark-blackpurple rounded-xl flex justify-evenly gap-4 flex-wrap py-4">
          <div className="flex flex-col justify-center items-center min-w-24">
            <label className="text-dark-yellow font-bold">Nome</label>
            <input
              name="nome"
              type="text"
              placeholder="Filtrar por nome"
              value={nomeFiltro}
              onChange={(e) => setNomeFiltro(e.target.value)}
              className="w-full bg-white text-black p-2 rounded-xl text-sm"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <label className="text-dark-yellow font-bold">Período</label>
            <select
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value)}
              className={`w-20 bg-white ${periodoFiltro !== '' ? 'text-black' : 'text-gray-500'} p-2 rounded-xl text-sm`}
            >
              <option value="" hidden>
                Filtrar
              </option>
              <option value="">Nenhum</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>
          </div>
          <div className="flex flex-col justify-center items-center">
            <label className="text-dark-yellow font-bold">Cargo</label>
            <input
              type="text"
              placeholder="Filtrar por cargo"
              value={cargoFiltro}
              onChange={(e) => setCargoFiltro(e.target.value)}
              className="w-full bg-white text-black p-2 rounded-xl text-sm"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <label className="text-dark-yellow font-bold">Projetos</label>
            <input
              type="text"
              placeholder="Filtrar por projetos"
              value={projetosFiltro}
              onChange={(e) => setProjetosFiltro(e.target.value)}
              className="w-full bg-white text-black p-2 rounded-xl text-sm"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <label className="text-dark-yellow font-bold">Área</label>
            <input
              type="text"
              placeholder="Filtrar por área"
              value={areaFiltro}
              onChange={(e) => setAreaFiltro(e.target.value)}
              className="w-full bg-white text-black p-2 rounded-xl text-sm"
            />
          </div>
          <div className="flex flex-col justify-center items-center">
            <label className="text-dark-yellow font-bold">Especialidade</label>
            <input
              type="text"
              placeholder="Filtrar por especialidade"
              value={especialidadeFiltro}
              onChange={(e) => setEspecialidadeFiltro(e.target.value)}
              className="w-full bg-white text-black p-2 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>

      {!isMobile ? (
        <div className="w-full max-h-[500px] overflow-y-scroll custom-white-scrollbar">
          <table className="w-full text-white lg:text-base text-sm">
            <thead className="sticky top-0 bg-[#3a2484] rounded-t-lg p-2 text-center text-gray-200">
              <tr>
                <th className="lg:p-2 p-1">Nome</th>
                <th className="lg:p-2 p-1">Período</th>
                <th className="lg:p-2 p-1">Cargo</th>
                <th className="lg:p-2 p-1">Projetos</th>
                <th className="lg:p-2 p-1">Área</th>
                <th className="lg:p-2 p-1">Especialidade</th>
                <th className="lg:p-2 p-1"></th>
              </tr>
            </thead>
            <tbody className="bg-light-purple rounded-b-lg">
              {usuariosFiltrados.map((usuario, index) => (
                <tr key={index} className="border-b-4 border-[#3a2484]">
                  <td className="lg:p-4 p-2 text-center">{usuario.nome}</td>
                  <td>
                    <p className="lg:p-4 p-2 text-center">
                      {usuario.periodo === 'N/A'
                        ? 'N/A'
                        : `${usuario.periodo}º`}
                    </p>
                  </td>
                  <td className="max-h-44">
                    <p className="lg:p-4 p-2 text-center">
                      {usuario.cargo === '' ? 'N/A' : usuario.cargo}
                    </p>
                  </td>
                  <td className="max-h-44">
                    <div className="max-h-40 overflow-y-scroll my-4 divide-y divide-white">
                      {usuario.projetos.map((projeto, index) => (
                        <p key={index} className="lg:p-4 p-2 text-center">
                          {projeto}
                        </p>
                      ))}
                    </div>
                  </td>

                  <td className="max-h-44">
                    <p className="lg:p-4 p-2 text-center">{usuario.area}</p>
                  </td>
                  <td>
                    <p className="lg:p-4 p-2 text-center">
                      {usuario.especialidade === ''
                        ? 'N/A'
                        : usuario.especialidade}
                    </p>
                  </td>
                  <td>
                    <div className="flex justify-center items-center gap-2">
                      <BiSolidEdit className="text-2xl" />
                      <MdBlock className="text-2xl" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 w-full px-6 pb-6">
          {usuariosFiltrados.map((usuario, index) => (
            <div
              className="w-full bg-light-purple rounded-lg shadow-2xl text-[#FFF] items-center flex flex-col"
              key={index}
            >
              <div className="gap-x-12 p-4 pl-4 items-center text-center w-full flex flex-col">
                <div className="items-center text-center w-full">
                  <p className="bg-dark-purple rounded-lg text-center self-center">
                    Nome
                  </p>
                  <p className="p-4">{usuario.nome}</p>
                </div>

                <div className="items-center text-center w-full">
                  <p className="bg-dark-purple rounded-lg w-full text-center self-center">
                    Período
                  </p>
                  <p className="p-4">
                    {usuario.periodo === 'N/A' ? 'N/A' : `${usuario.periodo}º`}
                  </p>
                </div>
                <div className="mb-2 max-h-56 overflow-y-scroll w-full">
                  <p className="bg-dark-purple rounded-lg w-full text-center self-center">
                    Cargo
                  </p>
                  <p className="p-4 w-full">
                    {usuario.cargo === '' ? 'N/A' : usuario.cargo}
                  </p>
                </div>

                <div className="w-full">
                  <p className="mb-2 bg-dark-purple rounded-lg w-full text-center self-center">
                    Projetos
                  </p>
                  <div className="p-4 w-full max-h-56 overflow-y-scroll">
                    {usuario.projetos.map((projeto, index) => (
                      <p key={index} className="text-center">
                        {projeto}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="w-full">
                  <p className="bg-dark-purple rounded-lg w-full text-center self-center">
                    Área
                  </p>
                  <p className="p-4 w-full">{usuario.area}</p>
                </div>
                <div className="w-full">
                  <p className="bg-dark-purple rounded-lg w-full text-center self-center">
                    Especialidade
                  </p>
                  <p className="p-4 w-full">{usuario.especialidade}</p>
                </div>

                <div className="flex items-center justify-end gap-3 px-10 py-4">
                  <BiSolidEdit className="text-2xl" />
                  <MdBlock className="text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
