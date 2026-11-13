import { Button } from '../Button'
import styles from './ImagePreviewCard.module.css'

interface ImagePreviewCardProps {
  src: string
  alt: string
  selectionName: string
  selectionValue: string
  selectionLabel: string
  selected: boolean
  onSelect: () => void
  onRemove: () => void
  removeLabel?: string
}

export function ImagePreviewCard({
  src,
  alt,
  selectionName,
  selectionValue,
  selectionLabel,
  selected,
  onSelect,
  onRemove,
  removeLabel = 'Remover',
}: ImagePreviewCardProps) {
  return (
    <article className={styles.card}>
      <img className={styles.image} src={src} alt={alt} />
      <label className={styles.selection}>
        <input
          type="radio"
          name={selectionName}
          value={selectionValue}
          checked={selected}
          onChange={onSelect}
        />
        {selectionLabel}
      </label>
      <Button type="button" variant="danger" size="sm" onClick={onRemove}>
        {removeLabel}
      </Button>
    </article>
  )
}
