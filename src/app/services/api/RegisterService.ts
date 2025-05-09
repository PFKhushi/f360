import { ApiResponse } from "@/app/types/ApiTypes/ApiResponseType"
import { apiInstance } from "./apiInstance"
import { AxiosError, AxiosResponse } from "axios"

type DataPropsParticipante = {
  usuario: {
    nome: string,
    username: string,
    password: string,
    telefone?: string
  },
  cpf: string,
  rgm: string,
  curso: string,
  outro_curso?: string,
  periodo: number,
  email_institucional: string
}

type ResultadoPropsParticipante = {
  id: number,
  usuario: {
    id: number,
    nome: string,
    username: string,
    telefone?: string
  },
  cpf: string,
  rgm: string,
  curso: string,
  outro_curso?: string,
  periodo: number,
  email_institucional: string
  extensionista: boolean,
  imersionista: boolean
}

type DataPropsEmpresa = {
  usuario: {
    nome: string,
    username: string,
    password: string,
    telefone?: string
  },
  cnpj: string,
  representante: string,
}

type ResultadoPropsEmpresa = {
  id: number,
  usuario: {
    id: number,
    nome: string,
    username: string,
    telefone?: string
  },
  cnpj: string,
  representante: string,
}

export class RegisterService {

  constructor(){}
  
  public async registerParticipante(data: DataPropsParticipante): Promise<ApiResponse<ResultadoPropsParticipante> | null>{
    try {
      const response: AxiosResponse<ApiResponse<ResultadoPropsParticipante>> = await apiInstance.post('/participante/', data)
      if(response){
        return {
          ...response.data
        }
      }
      return null
    } catch (error) {
      if(error instanceof AxiosError){
        const errorData = error.response?.data as ApiResponse<ResultadoPropsParticipante>
        return {
          ...errorData
        }
      }
      return null
    } 
  }

  public async registerEmpresa(data: DataPropsEmpresa): Promise<ApiResponse<ResultadoPropsEmpresa> | null>{
    try {
      const response: AxiosResponse<ApiResponse<ResultadoPropsEmpresa>> = await apiInstance.post('/empresa/', data)
      console.log(response)
      if(response){
        return {
          ...response.data
        }
      }
      return null
    } catch (error) {
      if(error instanceof AxiosError){
        const errorData = error.response?.data as ApiResponse<ResultadoPropsEmpresa>
        console.log(errorData)
        return {
          ...errorData
        }
      }
      return null
    } 
  }
  
}