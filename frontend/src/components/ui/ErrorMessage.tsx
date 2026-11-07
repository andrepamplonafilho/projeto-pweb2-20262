import styles from './ErrorMessage.module.css'
import { Button } from './Button.tsx'

type ErrorMessageProps = {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorMessage({ title = 'Algo deu errado', message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className="{styles.container}">
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
