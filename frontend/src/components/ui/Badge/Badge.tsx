import styles from './Badge.module.css'

export type BadgeStatus = 'ativo' | 'pausado' | 'reservado' | 'vendido' | 'concluido' | 'removido'

const labels: Record<BadgeStatus, string> = {
  ativo: 'Ativo',
  pausado: 'Pausado',
  reservado: 'Reservado',
  vendido: 'Vendido',
  concluido: 'Concluido',
  removido: 'Removido',
}

interface BadgeProps {
  status: BadgeStatus
}

export function Badge({ status }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[status]}`}>{labels[status]}</span>
}
