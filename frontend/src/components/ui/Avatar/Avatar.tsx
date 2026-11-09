import { useState } from 'react'
import styles from './Avatar.module.css'

interface AvatarProps {
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export function Avatar({ name, src, size = 'md' }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showImage = Boolean(src) && failedSrc !== src

  return (
    <span className={`${styles.avatar} ${styles[size]}`}>
      {showImage ? (
        <img
          className={styles.image}
          src={src ?? undefined}
          alt={name}
          onError={() => setFailedSrc(src ?? null)}
        />
      ) : (
        <span className={styles.fallback} role="img" aria-label={name}>
          {getInitials(name)}
        </span>
      )}
    </span>
  )
}
