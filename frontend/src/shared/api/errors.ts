export type ErrosPorCampo = Record<string, string>

export interface CorpoErro {
  mensagem: string
  campos: ErrosPorCampo
}

export class ApiError extends Error {
  status: number
  campos: ErrosPorCampo

  constructor(status: number, mensagem: string, campos: ErrosPorCampo = {}) {
    super(mensagem)
    this.name = 'ApiError'
    this.status = status
    this.campos = campos
  }
}

const MENSAGENS: Record<number, string> = {
  0: 'Não foi possível conectar à API.',
  401: 'Sessão expirada ou credenciais inválidas.',
  403: 'Você não tem permissão para isso.',
  404: 'Recurso não encontrado.',
  500: 'Erro interno do servidor.',
}

export function mensagemPadrao(status: number): string {
  return MENSAGENS[status] ?? `Erro ${status}.`
}
