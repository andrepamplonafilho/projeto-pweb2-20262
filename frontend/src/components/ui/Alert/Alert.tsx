import type { ReactNode } from 'react'
import styles from './Alert.module.css'

type AlertProps = {
  variant?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  children: ReactNode
  onClose?: () => void
}

export function Alert({ variant = 'info', title, children, onClose }: AlertProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`${styles.alert} ${styles[variant]}`}
    >
      <div className={styles.body}>
        {title && <strong className={styles.title}>{title}</strong>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
          ×
        </button>
      )}
    </div>
  )
}
