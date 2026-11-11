import { useSearchParams } from 'react-router-dom'

export type OrdemBusca = 'data' | 'preco'
export type DirecaoBusca = 'asc' | 'desc'
export type TamanhoPagina = 5 | 10 | 25 | 50

export interface FiltrosBusca {
  categoria?: string
  precoMin?: number
  precoMax?: number
  ordem: OrdemBusca
  direcao: DirecaoBusca
  pagina: number
  tamanho: TamanhoPagina
}

export type AtualizacaoFiltrosBusca = Partial<FiltrosBusca>

const TAMANHOS_PAGINA: TamanhoPagina[] = [5, 10, 25, 50]

function ehTamanhoPagina(tamanho: number): tamanho is TamanhoPagina {
  return TAMANHOS_PAGINA.some((opcao) => opcao === tamanho)
}

function lerNumeroNaoNegativo(valor: string | null): number | undefined {
  if (valor === null || valor.trim() === '') return undefined

  const numero = Number(valor)
  return Number.isFinite(numero) && numero >= 0 ? numero : undefined
}

function lerPagina(valor: string | null): number {
  if (valor === null || !/^[1-9]\d*$/.test(valor)) return 1

  const pagina = Number(valor)
  return Number.isSafeInteger(pagina) ? pagina : 1
}

function lerTamanho(valor: string | null): TamanhoPagina {
  const tamanho = Number(valor)
  return ehTamanhoPagina(tamanho) ? tamanho : 10
}

export function lerFiltrosBusca(params: URLSearchParams): FiltrosBusca {
  const categoria = params.get('categoria')?.trim()
  const ordem = params.get('ordem')
  const direcao = params.get('direcao')

  return {
    categoria: categoria || undefined,
    precoMin: lerNumeroNaoNegativo(params.get('precoMin')),
    precoMax: lerNumeroNaoNegativo(params.get('precoMax')),
    ordem: ordem === 'preco' ? 'preco' : 'data',
    direcao: direcao === 'asc' ? 'asc' : 'desc',
    pagina: lerPagina(params.get('pagina')),
    tamanho: lerTamanho(params.get('tamanho')),
  }
}

export function useFiltrosBusca() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filtros = lerFiltrosBusca(searchParams)

  function atualizarFiltros(atualizacao: AtualizacaoFiltrosBusca) {
    setSearchParams((atuais) => {
      const proximos = new URLSearchParams(atuais)

      for (const [chave, valor] of Object.entries(atualizacao)) {
        if (valor === undefined || valor === '') {
          proximos.delete(chave)
        } else {
          proximos.set(chave, String(valor))
        }
      }

      if (Object.keys(atualizacao).length > 0 && !Object.hasOwn(atualizacao, 'pagina')) {
        proximos.set('pagina', '1')
      }

      return proximos
    })
  }

  return { filtros, atualizarFiltros }
}
