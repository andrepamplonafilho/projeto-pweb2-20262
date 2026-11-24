import { useEffect, useState } from 'react'
import { Field, Input, Select } from '../../components/ui'
import { api } from '../../shared/api/client'
import type { Categoria } from '../../shared/api/tipos'
import { useFiltrosBusca } from './useFiltrosBusca'
import type { ModalidadeBusca } from './useFiltrosBusca'
import styles from './FiltrosBusca.module.css'

type FiltrosBuscaProps = {
  modalidade: ModalidadeBusca
}

/**
 * Campos de filtro da busca (categoria, faixa de preço e ordenação).
 * Usado na barra lateral (desktop) e no menu do cabeçalho (celular).
 */
export function FiltrosBusca({ modalidade }: FiltrosBuscaProps) {
  const { filtros, atualizarFiltros } = useFiltrosBusca()
  const [categorias, setCategorias] = useState<Categoria[]>([])

  const faixaDePrecoInvalida =
    modalidade === 'venda' &&
    filtros.precoMin !== undefined &&
    filtros.precoMax !== undefined &&
    filtros.precoMin > filtros.precoMax
  const ordenarPor = `${filtros.ordem}-${filtros.direcao}`
  const ordenacaoAtual =
    modalidade === 'doacao' && filtros.ordem === 'preco' ? 'data-desc' : ordenarPor

  // F09: categorias não derrubam a busca se falharem
  useEffect(() => {
    const controller = new AbortController()

    api<Categoria[]>('/categorias', { signal: controller.signal })
      .then(setCategorias)
      .catch(() => {
        if (!controller.signal.aborted) setCategorias([])
      })

    return () => controller.abort()
  }, [])

  return (
    <div className={styles.filtros}>
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
              inputMode="decimal"
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
              faixaDePrecoInvalida ? 'O máximo deve ser igual ou maior que o mínimo.' : undefined
            }
          >
            <Input
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
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
    </div>
  )
}