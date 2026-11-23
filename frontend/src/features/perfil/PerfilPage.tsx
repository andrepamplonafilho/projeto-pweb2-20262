import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAppSelector } from '../../app/hooks'
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  Pagination,
  Spinner,
} from '../../components/ui'
import type { PageSize } from '../../components/ui/Pagination'
import { api } from '../../shared/api/client'
import type { PaginaAnuncioResumo } from '../../shared/api/tipos'
import { usePerfil } from './usePerfil'
import styles from './PerfilPage.module.css'

interface ResultadoBuscaAnuncios {
  chave: string
  dados?: PaginaAnuncioResumo
  erro?: string
}

export default function PerfilPage() {
  const navigate = useNavigate()
  const usuario = useAppSelector((state) => state.auth.usuario)

  const {
    perfil,
    carregando: carregandoPerfil,
    erro: erroPerfil,
    recarregar: recarregarPerfil,
  } = usePerfil(usuario?.id)

  const [pagina, setPagina] = useState(1)
  const [tamanho, setTamanho] = useState<PageSize>(10)
  const [tentativa, setTentativa] = useState(0)
  const [resultado, setResultado] = useState<ResultadoBuscaAnuncios | null>(null)

  // Chave única para identificar se o resultado que temos em mãos corresponde à busca atual
  const chaveRequisicao = `${usuario?.id}:${pagina}:${tamanho}:${tentativa}`

  const recarregarAnuncios = useCallback(() => {
    setTentativa((t) => t + 1)
  }, [])

  useEffect(() => {
    if (!usuario?.id) return

    const controller = new AbortController()
    const params = new URLSearchParams({
      pagina: String(pagina),
      tamanho: String(tamanho),
    })

    api<PaginaAnuncioResumo>(`/usuarios/${usuario.id}/anuncios?${params.toString()}`, {
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
  }, [usuario?.id, pagina, tamanho, chaveRequisicao])

  // Estados derivados: sem nenhum setState síncrono dentro do effect!
  const carregandoAnuncios = Boolean(usuario?.id) && resultado?.chave !== chaveRequisicao
  const resultadoAtual = resultado?.chave === chaveRequisicao ? resultado : null
  const anunciosData = resultadoAtual?.dados ?? null
  const erroAnuncios = resultadoAtual?.erro ?? null

  if (carregandoPerfil) {
    return (
      <div className={styles.loading}>
        <Spinner label="Carregando dados do perfil..." />
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
    return (
      <div className={styles.loading}>
        <Spinner label="Carregando dados do perfil..." />
      </div>
    )
  }

  const temAnuncios = (anunciosData?.itens.length ?? 0) > 0
  const precisaPaginacao = (anunciosData?.totalPaginas ?? 0) > 1

  return (
    <div className={styles.container}>
      <header className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <Avatar name={perfil.nome} src={perfil.fotoUrl} size="xl" />

          <div className={styles.details}>
            <h1 className={styles.name}>{perfil.nome}</h1>
            <p className={styles.course}>{perfil.curso.nome}</p>
            <p className={styles.contact}>Contato: {perfil.telefone ?? 'Não informado'}</p>
          </div>
        </div>

        <Link to="/perfil/editar">
          <Button variant="secondary">Editar perfil</Button>
        </Link>
      </header>

      <section className={styles.anunciosSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Meus Anúncios</h2>
          <span className={styles.anunciosCount}>
            {anunciosData ? `${anunciosData.total} anúncio(s)` : ''}
          </span>
        </div>

        {carregandoAnuncios && (
          <div className={styles.loading}>
            <Spinner label="Carregando anúncios..." />
          </div>
        )}

        {!carregandoAnuncios && erroAnuncios && (
          <ErrorMessage
            title="Não foi possível carregar seus anúncios"
            message={erroAnuncios}
            onRetry={recarregarAnuncios}
          />
        )}

        {!carregandoAnuncios && !erroAnuncios && !temAnuncios && (
          <EmptyState
            title="Nenhum anúncio publicado"
            description="Você ainda não publicou nenhuma aula, paga ou gratuita."
            actionLabel="Criar anúncio"
            onAction={() => navigate('/anuncios/novo')}
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
