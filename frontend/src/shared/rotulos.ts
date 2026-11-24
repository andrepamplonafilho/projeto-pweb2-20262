import type { EstadoAnuncio, Nivel } from './api/tipos'

export const ROTULO_NIVEL: Record<Nivel, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

export const ROTULO_ESTADO: Record<EstadoAnuncio | 'removido', string> = {
  ativo: 'Ativo',
  pausado: 'Pausado',
  reservado: 'Reservado',
  vendido: 'Vendido',
  concluido: 'Concluído',
  removido: 'Removido',
}
