import { Button } from '../Button'
import { Select } from '../Select'
import styles from './Pagination.module.css'

const TAMANHOS_PADRAO = [5, 10, 25, 50]

type PaginaVisivel = number | 'reticencias'

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  pageSizeOptions?: readonly number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

function paginasVisiveis(paginaAtual: number, totalPaginas: number): PaginaVisivel[] {
  const paginas = new Set([1, totalPaginas])
  for (let pagina = paginaAtual - 1; pagina <= paginaAtual + 1; pagina += 1) {
    if (pagina > 1 && pagina < totalPaginas) paginas.add(pagina)
  }

  const ordenadas = [...paginas].sort((a, b) => a - b)
  const resultado: PaginaVisivel[] = []

  for (const [indice, pagina] of ordenadas.entries()) {
    if (indice > 0 && pagina - ordenadas[indice - 1] > 1) {
      resultado.push('reticencias')
    }
    resultado.push(pagina)
  }

  return resultado
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions = TAMANHOS_PADRAO,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const temPaginas = totalPages > 1

  return (
    <div className={styles.container}>
      {temPaginas && (
        <nav className={styles.navigation} aria-label="Paginação">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Anterior
          </Button>

          <ol className={styles.pages}>
            {paginasVisiveis(currentPage, totalPages).map((pagina, indice) =>
              pagina === 'reticencias' ? (
                <li key={`reticencias-${indice}`} aria-hidden="true" className={styles.ellipsis}>
                  …
                </li>
              ) : (
                <li key={pagina}>
                  <Button
                    variant={pagina === currentPage ? 'primary' : 'secondary'}
                    size="sm"
                    aria-label={`Página ${pagina}`}
                    aria-current={pagina === currentPage ? 'page' : undefined}
                    onClick={() => onPageChange(pagina)}
                  >
                    {pagina}
                  </Button>
                </li>
              ),
            )}
          </ol>

          <span className={styles.pageStatus} aria-live="polite">
            Página {currentPage} de {totalPages}
          </span>

          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Próxima
          </Button>
        </nav>
      )}

      <label className={styles.pageSize}>
        <span>Itens por página</span>
        <Select
          aria-label="Itens por página"
          value={String(pageSize)}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </label>
    </div>
  )
}
