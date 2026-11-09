import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Alert } from '../Alert'
import styles from './Toast.module.css'

interface ToastProps {
  variant?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  children: ReactNode
  duration?: number
  onClose: () => void
}

export function Toast({ variant = 'info', title, children, duration = 5000, onClose }: ToastProps) {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!duration) return
    const timer = setTimeout(() => onCloseRef.current(), duration)
    return () => clearTimeout(timer)
  }, [duration])

  return (
    <div className={styles.toast}>
      <Alert variant={variant} title={title} onClose={onClose}>
        {children}
      </Alert>
    </div>
  )
}

interface ToastViewportProps {
  children: ReactNode
}

export function ToastViewport({ children }: ToastViewportProps) {
  return <div className={styles.viewport}>{children}</div>
}
