import styles from './ErrorMessage.module.css'
import { Button } from './Button'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ title = 'Algo deu errado', message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
