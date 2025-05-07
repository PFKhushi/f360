import { apiInstance } from "./apiInstance"
import { AxiosError, AxiosResponse } from "axios"

type LoginProps = {
  username: string,
  password: string
}

type LoginResponseProps = {
  access: string | null,
  refresh: string | null,
  error: boolean,
  message: string,
}

export class LoginService {

  constructor(){}
  
  public async login(data: LoginProps): Promise<LoginResponseProps | null>{
    try {
      const response: AxiosResponse = await apiInstance.post('/login/', data)
      if(response){
        console.log(response)
        return {
          access: response.data.access,
          refresh: response.data.refresh,
          error: false,
          message: '',
        }
      }
      return null
    } catch (error) {
      if(error instanceof AxiosError){
        // const errorData = error.response?.data as LoginResponse
        return {
          access: null,
          refresh: null,
          error: true,
          message: 'erro ao realizar login',
        }
      }
      return null
    } 
  }
  
}