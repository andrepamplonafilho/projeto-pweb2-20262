import type { SelectHTMLAttributes } from 'react'
import styles from './Select.module.css'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean
}

export function Select({ invalid = false, className, ...rest }: SelectProps) {
  const classes = [styles.select, invalid && styles.invalid, className].filter(Boolean).join(' ')

  return <select className={classes} aria-invalid={invalid || undefined} {...rest} />
}
