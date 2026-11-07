import type { InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export function Input({ invalid = false, className, ...rest }: InputProps) {
  const classes = [styles.input, invalid && styles.invalid, className].filter(Boolean).join(' ')

  return <input className={classes} aria-invalid={invalid || undefined} {...rest} />
}
