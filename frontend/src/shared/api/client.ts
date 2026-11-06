import { ApiError, mensagemPadrao, type CorpoErro } from './errors'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'
const TOKEN_KEY = 'token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

// O app registra aqui o que fazer quando a sessão expira (limpar o Redux e ir para /login).
// Assim o client não depende da store nem do router.
let aoExpirarSessao: (() => void) | null = null
export function definirAoExpirarSessao(fn: () => void) {
  aoExpirarSessao = fn
}

type Opcoes = Omit<RequestInit, 'body'> & { body?: unknown }

export async function api<T>(
  caminho: string,
  { body, headers: h, ...resto }: Opcoes = {},
): Promise<T> {
  const headers = new Headers(h)
  const token = tokenStorage.get()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let corpo: BodyInit | undefined
  if (body instanceof FormData) {
    corpo = body // o navegador define o Content-Type do upload
  } else if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
    corpo = JSON.stringify(body)
  }

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${caminho}`, { ...resto, headers, body: corpo })
  } catch {
    throw new ApiError(0, mensagemPadrao(0))
  }

  if (!res.ok) {
    const erro: Partial<CorpoErro> | null = await res.json().catch(() => null)
    // Só encerra a sessão se havia token: um 401 no login (senha errada) não deve deslogar.
    if (res.status === 401 && token) {
      tokenStorage.clear()
      aoExpirarSessao?.()
    }
    throw new ApiError(res.status, erro?.mensagem ?? mensagemPadrao(res.status), erro?.campos ?? {})
  }

  return res.status === 204 ? (undefined as T) : res.json()
}
