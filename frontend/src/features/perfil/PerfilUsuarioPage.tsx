import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Avatar, Card, EmptyState, ErrorMessage, Pagination, Spinner } from '../../components/ui'
import type { PageSize } from '../../components/ui/Pagination'
import { api } from '../../shared/api/client'
import type { PaginaAnuncioResumo } from '../../shared/api/tipos'
import { usePerfil } from './usePerfil'
import styles from './PerfilUsuarioPage.module.css'

interface ResultadoBuscaAnuncios {
  chave: string
  dados?: PaginaAnuncioResumo
  erro?: string
}

export default function PerfilUsuarioPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const usuarioId = Number(id)
  const idValido = Number.isSafeInteger(usuarioId) && usuarioId > 0

  const {
    perfil,
    carregando: carregandoPerfil,
    erro: erroPerfil,
    recarregar: recarregarPerfil,
  } = usePerfil(idValido ? usuarioId : undefined)

  const [pagina, setPagina] = useState(1)
  const [tamanho, setTamanho] = useState<PageSize>(10)
  const [tentativa, setTentativa] = useState(0)
  const [resultado, setResultado] = useState<ResultadoBuscaAnuncios | null>(null)

  const chaveRequisicao = `${usuarioId}:${pagina}:${tamanho}:${tentativa}`

  const recarregarAnuncios = useCallback(() => {
    setTentativa((t) => t + 1)
  }, [])

  useEffect(() => {
    if (!idValido) return

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
            erro instanceof Error ? erro.message : 'Não foi possível carregar os anúncios.'
          setResultado({ chave: chaveRequisicao, erro: mensagem })
        }
      })

    return () => {
      controller.abort()
    }
  }, [idValido, usuarioId, pagina, tamanho, chaveRequisicao])

  const carregandoAnuncios = idValido && resultado?.chave !== chaveRequisicao
  const resultadoAtual = resultado?.chave === chaveRequisicao ? resultado : null
  const anunciosData = resultadoAtual?.dados ?? null
  const erroAnuncios = resultadoAtual?.erro ?? null

  if (!idValido) {
    return (
      <ErrorMessage
        title="Usuário inválido"
        message="O identificador do estudante informado não é válido."
      />
    )
  }

  if (carregandoPerfil) {
    return (
      <div className={styles.loading}>
        <Spinner label="Carregando perfil do estudante..." />
      </div>
    )
  }

  if (erroPerfil) {
    return (
      <ErrorMessage
        title="Não foi possível carregar o perfil"
        message={erroPerfil}
        onRetry={recarregarPerfil}
      />
    )
  }

  if (!perfil) {
    return null
  }

  const temAnuncios = (anunciosData?.itens.length ?? 0) > 0
  const precisaPaginacao = (anunciosData?.totalPaginas ?? 0) > 1

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className={styles.backLink}
        aria-label="Voltar para a página anterior"
      >
        ← Voltar
      </button>

      <header className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <Avatar name={perfil.nome} src={perfil.fotoUrl} size="xl" />

          <div className={styles.details}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>{perfil.nome}</h1>
              <span className={styles.roleBadge}>Estudante</span>
            </div>
            <p className={styles.course}>{perfil.curso.nome}</p>
            <p className={styles.contact}>
              Contato:{' '}
              {perfil.telefone ? (
                <a
                  href={`https://wa.me/55${perfil.telefone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.contactLink}
                >
                  {perfil.telefone}
                </a>
              ) : (
                'Não informado'
              )}
            </p>
          </div>
        </div>
      </header>

      <section className={styles.anunciosSection} aria-label="Anúncios do estudante">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Anúncios publicados</h2>
          <span className={styles.anunciosCount}>
            {anunciosData ? `${anunciosData.total} anúncio(s) ativo(s)` : ''}
          </span>
        </div>

        {carregandoAnuncios && (
          <div className={styles.loading}>
            <Spinner label="Carregando anúncios do estudante..." />
          </div>
        )}

        {!carregandoAnuncios && erroAnuncios && (
          <ErrorMessage
            title="Não foi possível carregar os anúncios"
            message={erroAnuncios}
            onRetry={recarregarAnuncios}
          />
        )}

        {!carregandoAnuncios && !erroAnuncios && !temAnuncios && (
          <EmptyState
            title="Nenhum anúncio disponível"
            description="Este estudante não possui itens ativos para venda ou doação no momento."
          />
        )}

        {!carregandoAnuncios && !erroAnuncios && temAnuncios && anunciosData && (
          <>
            <div className={styles.grid}>
              {anunciosData.itens.map((anuncio) => (
                <Card
                  key={anuncio.id}
                  title={anuncio.titulo}
                  modality={anuncio.modalidade}
                  price={anuncio.preco ?? undefined}
                  coverUrl={anuncio.capaUrl}
                  status={anuncio.estado}
                  to={`/anuncios/${anuncio.id}`}
                />
              ))}
            </div>

            {precisaPaginacao && (
              <div className={styles.pagination}>
                <Pagination
                  currentPage={pagina}
                  totalPages={anunciosData.totalPaginas}
                  pageSize={tamanho}
                  onPageChange={(novaPagina) => setPagina(novaPagina)}
                  onPageSizeChange={(novoTamanho) => {
                    setTamanho(novoTamanho)
                    setPagina(1)
                  }}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
