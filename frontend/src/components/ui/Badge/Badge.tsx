import { ROTULO_ESTADO } from '../../../shared/rotulos'
import styles from './Badge.module.css'

export type BadgeStatus = 'ativo' | 'pausado' | 'reservado' | 'vendido' | 'concluido' | 'removido'

interface BadgeProps {
  status: BadgeStatus
}

export function Badge({ status }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[status]}`}>{ROTULO_ESTADO[status]}</span>
}
