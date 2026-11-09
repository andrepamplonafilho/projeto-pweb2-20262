import { useCallback, useEffect, useState } from 'react'
import { api } from '../../shared/api/client'
import { ApiError } from '../../shared/api/errors'
import type { Perfil } from '../../shared/api/tipos'

type Resultado =
  | { id: number; tentativa: number; perfil: Perfil; erro: null }
  | { id: number; tentativa: number; perfil: null; erro: string }

const MENSAGEM_PADRAO = 'Erro inesperado. Tente novamente.'

export function usePerfil(id: number | undefined) {
  const [tentativa, setTentativa] = useState(0)
  const [resultado, setResultado] = useState<Resultado | null>(null)

  useEffect(() => {
    if (id === undefined) return

    let cancelado = false

    api<Perfil>(`/usuarios/${id}`)
      .then((perfil) => {
        if (!cancelado) {
          setResultado({ id, tentativa, perfil, erro: null })
        }
      })
      .catch((erro: unknown) => {
        if (!cancelado) {
          const mensagem = erro instanceof ApiError ? erro.message : MENSAGEM_PADRAO
          setResultado({ id, tentativa, perfil: null, erro: mensagem })
        }
      })

    return () => {
      cancelado = true
    }
  }, [id, tentativa])

  const atual =
    resultado && resultado.id === id && resultado.tentativa === tentativa ? resultado : null

  const recarregar = useCallback(() => setTentativa((t) => t + 1), [])

  return {
    perfil: atual?.perfil ?? null,
    erro: atual?.erro ?? null,
    carregando: id !== undefined && atual === null,
    recarregar,
  }
}
