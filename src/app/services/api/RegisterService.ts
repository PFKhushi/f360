import { ApiResponse } from "@/app/types/ApiTypes/ApiResponseType"
import { apiInstance } from "./apiInstance"
import { AxiosError, AxiosResponse } from "axios"

type DataProps = {
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

type ResultadoProps = {
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


export class RegisterService {

  constructor(){}
  
  public async registerParticipante(data: DataProps): Promise<ApiResponse<ResultadoProps> | null>{
    try {
      const response: AxiosResponse<ApiResponse<ResultadoProps>> = await apiInstance.post('/participante/', data)
      if(response){
        return {
          ...response.data
        }
      }
      return null
    } catch (error) {
      if(error instanceof AxiosError){
        const errorData = error.response?.data as ApiResponse<ResultadoProps>
        return {
          ...errorData
        }
      }
      return null
    } 
  }
  
}