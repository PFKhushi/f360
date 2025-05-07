
export type ApiResponse<T> = {
  sucesso: boolean,
  resultado: T | string,
  erro: string,
  detalhes: string | string []
}