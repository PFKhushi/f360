
export type ApiResponse<T> = {
  sucesso: boolean,
  resultado: T | null,
  erro: string,
  detalhes: string []
}