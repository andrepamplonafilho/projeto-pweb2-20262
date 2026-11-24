import type { ReactNode } from 'react'
import { Card, ErrorMessage, Pagination, Spinner } from '../../components/ui'
import type { PageSize } from '../../components/ui/Pagination'
import type { PaginaAnuncioResumo } from '../../shared/api/tipos'
import styles from './ListaAnunciosPerfil.module.css'

interface ListaAnunciosPerfilProps {
  dados: PaginaAnuncioResumo | null
  erro: string | null
  carregando: boolean
  pagina: number
  tamanho: PageSize
  onPaginaChange: (pagina: number) => void
  onTamanhoChange: (tamanho: PageSize) => void
  onRetry: () => void
  rotuloCarregando: string
  tituloErro: string
  estadoVazio: ReactNode
}

export default function ListaAnunciosPerfil({
  dados,
  erro,
  carregando,
  pagina,
  tamanho,
  onPaginaChange,
  onTamanhoChange,
  onRetry,
  rotuloCarregando,
  tituloErro,
  estadoVazio,
}: ListaAnunciosPerfilProps) {
  if (carregando) {
    return (
      <div className={styles.loading}>
        <Spinner label={rotuloCarregando} />
      </div>
    )
  }

  if (erro) {
    return <ErrorMessage title={tituloErro} message={erro} onRetry={onRetry} />
  }

  if (!dados || dados.itens.length === 0) {
    return <>{estadoVazio}</>
  }

  return (
    <>
      <div className={styles.grid}>
        {dados.itens.map((anuncio) => (
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

      {dados.totalPaginas > 1 && (
        <div className={styles.pagination}>
          <Pagination
            currentPage={pagina}
            totalPages={dados.totalPaginas}
            pageSize={tamanho}
            onPageChange={onPaginaChange}
            onPageSizeChange={onTamanhoChange}
          />
        </div>
      )}
    </>
  )
}
