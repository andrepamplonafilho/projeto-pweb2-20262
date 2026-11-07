import styles from './EmptyState.module.css'
import { Button } from './Button.tsx'

type EmptyStateProps = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      {description && <p className={styles.description}>{description}</p>}
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}{' '}
    </div>
  )
}
