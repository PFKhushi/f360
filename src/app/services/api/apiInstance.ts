import axios, { AxiosError } from "axios";

const apiInstance = axios.create({
  baseURL: "https://f360-latest.onrender.com/api/",
});

apiInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<{message?: string, messages: string[]}>) => {

    if(error.code === 'ERR_NETWORK'){
      // new MessageService().error('Erro ao acessar o servidor de dados.')
      alert('Erro ao acessar o servidor de dados.')
    
      return null
    }

    if(error.status === 401 && error.response?.data.messages[0] !== "Login ou senha, estão incorretos !"){
      // new MessageService().error(error.message)
      alert(error.message)
    }

    return Promise.reject(error)
  }
)

export { apiInstance }