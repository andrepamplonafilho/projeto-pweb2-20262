import styles from './Spinner.module.css'

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export function Spinner({ size = 'md', label = 'Carregando' }: SpinnerProps) {
  return (
    <span role="status" className={`${styles.spinner} ${styles[size]}`}>
      <span className={styles.circle} aria-hidden="true" />
      <span className={styles.visuallyHidden}>{label}</span>
    </span>
  )
}
