import { cloneElement, useId } from 'react'
import type { ReactElement } from 'react'
import styles from './Field.module.css'

type ControlProps = {
  id?: string
  invalid?: boolean
  required?: boolean
  'aria-describedby'?: string
}

type FieldProps = {
  label: string
  error?: string
  required?: boolean
  children: ReactElement<ControlProps>
}

export function Field({ label, error, required = false, children }: FieldProps) {
  const id = useId()
  const errorId = `${id}-error`

  const control = cloneElement(children, {
    id,
    invalid: Boolean(error),
    required: required || children.props.required,
    'aria-describedby': error ? errorId : undefined,
  })

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {control}
      {error && (
        <p id={errorId} role="alert" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
