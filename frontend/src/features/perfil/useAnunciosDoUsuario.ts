import { useCallback, useEffect, useState } from 'react'
import type { PageSize } from '../../components/ui/Pagination'
import { api } from '../../shared/api/client'
import type { PaginaAnuncioResumo } from '../../shared/api/tipos'

interface ResultadoBuscaAnuncios {
  chave: string
  dados?: PaginaAnuncioResumo
  erro?: string
}

export function useAnunciosDoUsuario(usuarioId: number | undefined) {
  const [pagina, setPagina] = useState(1)
  const [tamanho, setTamanho] = useState<PageSize>(10)
  const [tentativa, setTentativa] = useState(0)
  const [resultado, setResultado] = useState<ResultadoBuscaAnuncios | null>(null)

  // Chave única para identificar se o resultado em mãos corresponde à busca atual
  const chaveRequisicao = `${usuarioId}:${pagina}:${tamanho}:${tentativa}`

  const recarregar = useCallback(() => {
    setTentativa((t) => t + 1)
  }, [])

  const alterarTamanho = useCallback((novoTamanho: PageSize) => {
    setTamanho(novoTamanho)
    setPagina(1)
  }, [])

  useEffect(() => {
    if (usuarioId === undefined) return

    const controller = new AbortController()
    const params = new URLSearchParams({
      pagina: String(pagina),
      tamanho: String(tamanho),
    })

    api<PaginaAnuncioResumo>(`/usuarios/${usuarioId}/anuncios?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((dados) => {
        setResultado({ chave: chaveRequisicao, dados })
      })
      .catch((erro: unknown) => {
        if (!controller.signal.aborted) {
          const mensagem =
            erro instanceof Error ? erro.message : 'Não foi possível carregar as aulas.'
          setResultado({ chave: chaveRequisicao, erro: mensagem })
        }
      })

    return () => {
      controller.abort()
    }
  }, [usuarioId, pagina, tamanho, chaveRequisicao])

  // Estados derivados: sem setState síncrono dentro do effect
  const resultadoAtual = resultado?.chave === chaveRequisicao ? resultado : null

  return {
    dados: resultadoAtual?.dados ?? null,
    erro: resultadoAtual?.erro ?? null,
    carregando: usuarioId !== undefined && resultado?.chave !== chaveRequisicao,
    pagina,
    tamanho,
    setPagina,
    alterarTamanho,
    recarregar,
  }
}
