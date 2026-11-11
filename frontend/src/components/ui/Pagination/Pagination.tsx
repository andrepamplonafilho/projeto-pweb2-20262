import { Button } from '../Button'
import { Select } from '../Select'
import styles from './Pagination.module.css'

export type PageSize = 5 | 10 | 25 | 50

const TAMANHOS_PADRAO: PageSize[] = [5, 10, 25, 50]

type PaginaVisivel = number | 'reticencias'

function ehTamanhoPagina(valor: number): valor is PageSize {
  return TAMANHOS_PADRAO.some((tamanho) => tamanho === valor)
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: PageSize
  pageSizeOptions?: readonly PageSize[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: PageSize) => void
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
  const paginaAtualVisivel =
    totalPages > 0 ? Math.min(Math.max(currentPage, 1), totalPages) : currentPage

  return (
    <div className={styles.container}>
      {temPaginas && (
        <nav className={styles.navigation} aria-label="Paginação">
          <Button
            variant="secondary"
            size="sm"
            disabled={paginaAtualVisivel <= 1}
            onClick={() => onPageChange(paginaAtualVisivel - 1)}
          >
            Anterior
          </Button>

          <ol className={styles.pages}>
            {paginasVisiveis(paginaAtualVisivel, totalPages).map((pagina, indice) =>
              pagina === 'reticencias' ? (
                <li key={`reticencias-${indice}`} aria-hidden="true" className={styles.ellipsis}>
                  …
                </li>
              ) : (
                <li key={pagina}>
                  <Button
                    variant={pagina === paginaAtualVisivel ? 'primary' : 'secondary'}
                    size="sm"
                    aria-label={`Página ${pagina}`}
                    aria-current={pagina === paginaAtualVisivel ? 'page' : undefined}
                    onClick={() => onPageChange(pagina)}
                  >
                    {pagina}
                  </Button>
                </li>
              ),
            )}
          </ol>

          <span className={styles.pageStatus} aria-live="polite">
            Página {paginaAtualVisivel} de {totalPages}
          </span>

          <Button
            variant="secondary"
            size="sm"
            disabled={paginaAtualVisivel >= totalPages}
            onClick={() => onPageChange(paginaAtualVisivel + 1)}
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
          onChange={(event) => {
            const tamanho = Number(event.target.value)
            if (ehTamanhoPagina(tamanho)) onPageSizeChange(tamanho)
          }}
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
