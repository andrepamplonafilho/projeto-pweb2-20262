import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import {
  Card,
  EmptyState,
  ErrorMessage,
  Field,
  Input,
  Pagination,
  Select,
  Spinner,
} from '../../components/ui'
import { api } from '../../shared/api/client'
import type { AnuncioResumo, Categoria, PaginaAnuncioResumo } from '../../shared/api/tipos'
import { useFiltrosBusca } from './useFiltrosBusca'
import styles from './BuscaPage.module.css'

type ModalidadeBusca = 'venda' | 'doacao'
type ResultadoBusca = {
  chave: string
  pagina?: PaginaAnuncioResumo
  erro?: string
}

function modalidadeDaRota(pathname: string): ModalidadeBusca {
  return pathname === '/doacoes' ? 'doacao' : 'venda'
}

function parametrosDaApi(
  modalidade: ModalidadeBusca,
  filtros: ReturnType<typeof useFiltrosBusca>['filtros'],
): URLSearchParams {
  const params = new URLSearchParams({ modalidade })

  if (filtros.categoria) params.set('categoria', filtros.categoria)
  if (modalidade === 'venda') {
    if (filtros.precoMin !== undefined) params.set('precoMin', String(filtros.precoMin))
    if (filtros.precoMax !== undefined) params.set('precoMax', String(filtros.precoMax))
    if (filtros.ordem === 'preco') {
      params.set('ordem', filtros.ordem)
      params.set('direcao', filtros.direcao)
    } else if (filtros.direcao !== 'desc') {
      params.set('ordem', filtros.ordem)
      params.set('direcao', filtros.direcao)
    }
  } else if (filtros.direcao !== 'desc') {
    params.set('ordem', 'data')
    params.set('direcao', filtros.direcao)
  }

  if (filtros.pagina !== 1) params.set('pagina', String(filtros.pagina))
  if (filtros.tamanho !== 10) params.set('tamanho', String(filtros.tamanho))
  return params
}

function mensagemDoErro(erro: unknown): string {
  return erro instanceof Error ? erro.message : 'Não foi possível carregar as aulas.'
}

export default function BuscaPage() {
  const location = useLocation()
  const modalidade = modalidadeDaRota(location.pathname)
  const { filtros, atualizarFiltros } = useFiltrosBusca()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [resultadoBusca, setResultadoBusca] = useState<ResultadoBusca | null>(null)
  const [tentativa, setTentativa] = useState(0)

  const faixaDePrecoInvalida =
    modalidade === 'venda' &&
    filtros.precoMin !== undefined &&
    filtros.precoMax !== undefined &&
    filtros.precoMin > filtros.precoMax
  const parametrosDaBusca = parametrosDaApi(modalidade, filtros).toString()
  const chaveRequisicao = `${parametrosDaBusca}#${tentativa}`

  // F09: categorias são buscadas uma única vez e não derrubam a busca se falharem
  useEffect(() => {
    const controller = new AbortController()

    api<Categoria[]>('/categorias', { signal: controller.signal })
      .then(setCategorias)
      .catch(() => {
        if (!controller.signal.aborted) setCategorias([])
      })

    return () => controller.abort()
  }, [])

  // Busca de aulas: refaz quando filtros mudam ou quando o usuário clica em "Tentar novamente"
  useEffect(() => {
    if (faixaDePrecoInvalida) return

    const controller = new AbortController()
    const params = new URLSearchParams(parametrosDaBusca)

    api<PaginaAnuncioResumo>(`/anuncios?${params.toString()}`, { signal: controller.signal })
      .then((resultado) => {
        setResultadoBusca({ chave: chaveRequisicao, pagina: resultado })
      })
      .catch((erroDaBusca: unknown) => {
        if (!controller.signal.aborted) {
          setResultadoBusca({ chave: chaveRequisicao, erro: mensagemDoErro(erroDaBusca) })
        }
      })

    return () => controller.abort()
  }, [parametrosDaBusca, faixaDePrecoInvalida, chaveRequisicao])

  const resultadoAtual = resultadoBusca?.chave === chaveRequisicao ? resultadoBusca : null
  const paginaAnuncios = resultadoAtual?.pagina
  const erro = resultadoAtual?.erro

  // F08: página fora do intervalo (ex.: ?pagina=99) volta para a última página existente
  const ultimaPagina = paginaAnuncios?.totalPaginas ?? 0
  const redirecionando =
    paginaAnuncios !== undefined &&
    paginaAnuncios.itens.length === 0 &&
    paginaAnuncios.total > 0 &&
    ultimaPagina >= 1 &&
    ultimaPagina < filtros.pagina

  useEffect(() => {
    if (redirecionando) {
      atualizarFiltros({ pagina: ultimaPagina }, { replace: true })
    }
  }, [redirecionando, ultimaPagina, atualizarFiltros])

  const carregando =
    !faixaDePrecoInvalida && (resultadoBusca?.chave !== chaveRequisicao || redirecionando)
  const ordenarPor = `${filtros.ordem}-${filtros.direcao}`
  const ordenacaoAtual =
    modalidade === 'doacao' && filtros.ordem === 'preco' ? 'data-desc' : ordenarPor

  return (
    <section className={styles.page} aria-labelledby="busca-titulo">
      <header className={styles.header}>
        <h1 id="busca-titulo">{modalidade === 'venda' ? 'Aulas pagas' : 'Aulas gratuitas'}</h1>
        <p>Encontre aulas disponíveis publicadas por estudantes.</p>
      </header>

      <div className={styles.content}>
        <aside className={styles.filters} aria-label="Filtros da busca">
          <h2>Filtros</h2>
          <Field label="Categoria">
            <Select
              value={filtros.categoria ?? ''}
              onChange={(event) => atualizarFiltros({ categoria: event.target.value || undefined })}
            >
              <option value="">Todas as categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.slug}>
                  {categoria.nome}
                </option>
              ))}
            </Select>
          </Field>

          {modalidade === 'venda' && (
            <div className={styles.priceFields}>
              <Field label="Preço mínimo (R$)">
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={filtros.precoMin ?? ''}
                  onChange={(event) =>
                    atualizarFiltros({
                      precoMin: event.target.value === '' ? undefined : Number(event.target.value),
                    })
                  }
                />
              </Field>
              <Field
                label="Preço máximo (R$)"
                error={
                  faixaDePrecoInvalida
                    ? 'O máximo deve ser igual ou maior que o mínimo.'
                    : undefined
                }
              >
                <Input
                  type="number"
                  min="0"
                  step="any"
                  value={filtros.precoMax ?? ''}
                  onChange={(event) =>
                    atualizarFiltros({
                      precoMax: event.target.value === '' ? undefined : Number(event.target.value),
                    })
                  }
                />
              </Field>
            </div>
          )}

          <Field label="Ordenar por">
            <Select
              value={ordenacaoAtual}
              onChange={(event) => {
                const [ordem, direcao] = event.target.value.split('-') as [
                  'data' | 'preco',
                  'asc' | 'desc',
                ]
                atualizarFiltros({ ordem, direcao })
              }}
            >
              <option value="data-desc">Mais recentes</option>
              <option value="data-asc">Mais antigos</option>
              {modalidade === 'venda' && (
                <>
                  <option value="preco-asc">Menor preço</option>
                  <option value="preco-desc">Maior preço</option>
                </>
              )}
            </Select>
          </Field>
        </aside>

        <div className={styles.results}>
          <div className={styles.resultsHeader}>
            <h2>
              {paginaAnuncios
                ? `${paginaAnuncios.total} ${paginaAnuncios.total === 1 ? 'aula' : 'aulas'}`
                : 'Aulas'}
            </h2>
          </div>

          <>
            {faixaDePrecoInvalida ? (
              <p className={styles.validationMessage} role="status">
                Corrija a faixa de preço para buscar aulas.
              </p>
            ) : carregando ? (
              <div className={styles.status}>
                <Spinner label="Carregando aulas" />
              </div>
            ) : erro ? (
              <ErrorMessage message={erro} onRetry={() => setTentativa((t) => t + 1)} />
            ) : paginaAnuncios?.itens.length ? (
              <div className={styles.grid}>
                {paginaAnuncios.itens.map((anuncio: AnuncioResumo) => (
                  <Card
                    key={anuncio.id}
                    title={anuncio.titulo}
                    modality={anuncio.modalidade}
                    price={anuncio.preco ?? undefined}
                    coverUrl={anuncio.capaUrl}
                    to={`/anuncios/${anuncio.id}`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhuma aula encontrada"
                description="Tente mudar os filtros para encontrar outras aulas."
              />
            )}

            {paginaAnuncios && !faixaDePrecoInvalida && !erro && !redirecionando && (
              <div className={styles.pagination}>
                <Pagination
                  currentPage={filtros.pagina}
                  totalPages={paginaAnuncios.totalPaginas}
                  pageSize={filtros.tamanho}
                  onPageChange={(pagina) => atualizarFiltros({ pagina })}
                  onPageSizeChange={(tamanho) => atualizarFiltros({ tamanho })}
                />
              </div>
            )}
          </>
        </div>
      </div>
    </section>
  )
}
