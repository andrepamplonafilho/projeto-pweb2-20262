import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Button, ErrorMessage, ImageGallery, Select, Spinner } from '../../components/ui'
import type { EstadoAnuncio } from '../../shared/api/tipos'
import { alterarEstadoAnuncio, buscarAnuncio } from './anunciosSlice'
import styles from './AnuncioDetalhePage.module.css'

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const dataHora = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' })

function rotuloEstado(estado: EstadoAnuncio) {
  if (estado === 'concluido') return 'Concluído'
  if (estado === 'vendido') return 'Vendido'
  return estado.charAt(0).toUpperCase() + estado.slice(1)
}

export default function AnuncioDetalhePage() {
  const { id: idParam } = useParams()
  const id = Number(idParam)
  const dispatch = useAppDispatch()
  const anuncioRedux = useAppSelector((state) => state.anuncios.detalhe)
  const statusBusca = useAppSelector((state) => state.anuncios.busca.status)
  const erroBusca = useAppSelector((state) => state.anuncios.busca.erro)
  const alteracaoEstado = useAppSelector((state) => state.anuncios.alteracaoEstado)
  const usuario = useAppSelector((state) => state.auth.usuario)
  const statusAuth = useAppSelector((state) => state.auth.status)
  const anuncio = anuncioRedux?.id === id ? anuncioRedux : null
  const [fotoSelecionada, setFotoSelecionada] = useState<{ id: number; src: string } | null>(null)
  const [estadoSelecionado, setEstadoSelecionado] = useState<{
    id: number
    estado: EstadoAnuncio
  } | null>(null)

  useEffect(() => {
    if (!Number.isSafeInteger(id) || id < 1) return
    const requisicao = dispatch(buscarAnuncio(id))
    return () => requisicao.abort()
  }, [dispatch, id])

  if (!Number.isSafeInteger(id) || id < 1) {
    return (
      <ErrorMessage title="Anúncio inválido" message="O identificador do anúncio é inválido." />
    )
  }
  if (statusBusca === 'carregando' || (statusAuth === 'carregando' && !usuario)) {
    return (
      <div className={styles.loading}>
        <Spinner label="Carregando anúncio" />
      </div>
    )
  }
  if (statusBusca === 'erro') {
    return (
      <ErrorMessage
        title="Não foi possível carregar o anúncio"
        message={erroBusca ?? 'Tente novamente.'}
        onRetry={() => void dispatch(buscarAnuncio(id))}
      />
    )
  }
  if (!anuncio)
    return (
      <div className={styles.loading}>
        <Spinner label="Carregando anúncio" />
      </div>
    )

  const anunciante = usuario?.id === anuncio.anunciante.id
  const estadosDisponiveis: EstadoAnuncio[] = [
    'ativo',
    'pausado',
    'reservado',
    anuncio.modalidade === 'venda' ? 'vendido' : 'concluido',
  ]
  const fotoCapa = anuncio.fotos.find((foto) => foto.capa)?.url ?? anuncio.fotos[0]?.url ?? ''
  const fotoSelecionadaAtual =
    fotoSelecionada?.id === anuncio.id ? fotoSelecionada.src : fotoCapa
  const estadoSelecionadoAtual =
    estadoSelecionado?.id === anuncio.id ? estadoSelecionado.estado : anuncio.estado

  return (
    <article className={styles.page}>
      <Link
        to={anuncio.modalidade === 'venda' ? '/vendas' : '/doacoes'}
        className={styles.backLink}
      >
        ← Voltar para {anuncio.modalidade === 'venda' ? 'vendas' : 'doações'}
      </Link>
      <div className={styles.content}>
        <ImageGallery
          images={anuncio.fotos.map((foto) => ({ id: foto.id, src: foto.url }))}
          selectedSrc={fotoSelecionadaAtual}
          alt={anuncio.titulo}
          ariaLabel="Galeria de fotos"
          emptyMessage="Este anúncio não tem fotos"
          onSelect={(src) => setFotoSelecionada({ id: anuncio.id, src })}
        />

        <section className={styles.details}>
          <p className={styles.modality}>{anuncio.modalidade === 'venda' ? 'À venda' : 'Doação'}</p>
          <h1>{anuncio.titulo}</h1>
          {anuncio.modalidade === 'venda' && anuncio.preco !== null && (
            <p className={styles.price}>{moeda.format(anuncio.preco)}</p>
          )}
          <p className={styles.state}>{rotuloEstado(anuncio.estado)}</p>

          <dl className={styles.attributes}>
            <div>
              <dt>Categoria</dt>
              <dd>{anuncio.categoria.nome}</dd>
            </div>
            <div>
              <dt>Conservação</dt>
              <dd>{anuncio.estadoConservacao}</dd>
            </div>
            <div>
              <dt>Local de entrega</dt>
              <dd>{anuncio.localEntrega}</dd>
            </div>
            <div>
              <dt>Publicado em</dt>
              <dd>{dataHora.format(new Date(anuncio.publicadoEm))}</dd>
            </div>
          </dl>

          <section className={styles.description}>
            <h2>Descrição</h2>
            <p>{anuncio.descricao}</p>
          </section>

          <section className={styles.seller}>
            <h2>Anunciante</h2>
            <Link to={`/usuarios/${anuncio.anunciante.id}`} className={styles.sellerLink}>
              {anuncio.anunciante.nome}
            </Link>
          </section>

          <div className={styles.actions}>
            <Button type="button" disabled title="Disponível na Etapa 3">
              Tenho interesse
            </Button>
            <Button type="button" variant="secondary" disabled title="Disponível na Etapa 3">
              Negociar
            </Button>
          </div>

          {anunciante && (
            <section className={styles.ownerActions} aria-label="Ações do anunciante">
              <Link to={`/anuncios/${anuncio.id}/editar`} className={styles.editLink}>
                Editar anúncio
              </Link>
              <div className={styles.stateControls}>
                <Select
                  aria-label="Novo estado do anúncio"
                  value={estadoSelecionadoAtual}
                  onChange={(evento) =>
                    setEstadoSelecionado({
                      id: anuncio.id,
                      estado: evento.target.value as EstadoAnuncio,
                    })
                  }
                >
                  {estadosDisponiveis.map((estado) => (
                    <option key={estado} value={estado}>
                      {rotuloEstado(estado)}
                    </option>
                  ))}
                </Select>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={
                    estadoSelecionadoAtual === anuncio.estado ||
                    alteracaoEstado.status === 'carregando'
                  }
                  onClick={async () => {
                    if (estadoSelecionadoAtual !== anuncio.estado) {
                      const resultado = await dispatch(
                        alterarEstadoAnuncio({ id: anuncio.id, estado: estadoSelecionadoAtual }),
                      )
                      if (alterarEstadoAnuncio.fulfilled.match(resultado)) {
                        setEstadoSelecionado(null)
                      }
                    }
                  }}
                >
                  {alteracaoEstado.status === 'carregando' ? 'Salvando...' : 'Alterar estado'}
                </Button>
              </div>
              {alteracaoEstado.erro && (
                <p className={styles.error} role="alert">
                  {alteracaoEstado.erro}
                </p>
              )}
            </section>
          )}
        </section>
      </div>
    </article>
  )
}
