import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Badge } from '../Badge'
import type { BadgeStatus } from '../Badge'
import styles from './Card.module.css'

interface CardProps {
  title: string
  modality: 'venda' | 'doacao'
  price?: number
  coverUrl?: string | null
  status?: BadgeStatus
  to?: string
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function Card({ title, modality, price, coverUrl, status, to }: CardProps) {
  const content: ReactNode = (
    <>
      <div className={styles.cover}>
        {coverUrl ? (
          <img className={styles.image} src={coverUrl} alt="" />
        ) : (
          <span className={styles.placeholder}>Sem foto</span>
        )}
        {status && (
          <span className={styles.badge}>
            <Badge status={status} />
          </span>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {modality === 'doacao' ? (
          <p className={styles.donation}>Doação</p>
        ) : (
          <p className={styles.price}>{price !== undefined ? currency.format(price) : ''}</p>
        )}
      </div>
    </>
  )

  if (to) {
    return (
      <Link to={to} className={styles.card}>
        {content}
      </Link>
    )
  }

  return <div className={styles.card}>{content}</div>
}
