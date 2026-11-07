import type { TextareaHTMLAttributes } from 'react'
import styles from './Textarea.module.css'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean
}

export function Textarea({ invalid = false, className, ...rest }: TextareaProps) {
  const classes = [styles.textarea, invalid && styles.invalid, className].filter(Boolean).join(' ')

  return <textarea className={classes} aria-invalid={invalid || undefined} {...rest} />
}
