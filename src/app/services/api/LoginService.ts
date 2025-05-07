import { ApiResponse } from "@/app/types/ApiTypes/ApiResponseType"
import { apiInstance } from "./apiInstance"
import { AxiosError, AxiosResponse } from "axios"

type DataProps = {
  username: string,
  password: string
}

type ResultadoProps = {
  access: string,
  refresh: string
}


export class LoginService {

  constructor(){}
  
  public async login(data: DataProps): Promise<ApiResponse<ResultadoProps> | null>{
    try {
      const response: AxiosResponse<ApiResponse<ResultadoProps>> = await apiInstance.post('/login/', data)
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