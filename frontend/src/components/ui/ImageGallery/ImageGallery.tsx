import { useState } from 'react'
import styles from './ImageGallery.module.css'

export interface ImageGalleryItem {
  id: string | number
  src: string
}

interface ImageGalleryProps {
  images: ImageGalleryItem[]
  selectedSrc?: string
  alt: string
  ariaLabel: string
  emptyMessage?: string
  onSelect: (src: string) => void
}

export function ImageGallery({
  images,
  selectedSrc,
  alt,
  ariaLabel,
  emptyMessage = 'Nenhuma imagem disponível.',
  onSelect,
}: ImageGalleryProps) {
  const imagemSelecionada = images.find((imagem) => imagem.src === selectedSrc) ?? images[0]
  // Guarda as URLs que falharam (ex.: URL assinada expirada). Se a URL mudar, a imagem volta a ser tentada.
  const [falhas, setFalhas] = useState<Set<string>>(new Set())
  const marcarFalha = (src: string) => setFalhas((atual) => new Set(atual).add(src))

  return (
    <section className={styles.gallery} aria-label={ariaLabel}>
      <div className={styles.mainPhoto}>
        {imagemSelecionada && !falhas.has(imagemSelecionada.src) ? (
          <img
            src={imagemSelecionada.src}
            alt={alt}
            onError={() => marcarFalha(imagemSelecionada.src)}
          />
        ) : (
          <span>{imagemSelecionada ? 'Imagem indisponível.' : emptyMessage}</span>
        )}
      </div>
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((imagem, indice) => (
            <button
              key={imagem.id}
              type="button"
              className={`${styles.thumbnail} ${
                imagemSelecionada?.src === imagem.src ? styles.selected : ''
              }`}
              onClick={() => onSelect(imagem.src)}
              aria-label={`Exibir imagem ${indice + 1}`}
              aria-pressed={imagemSelecionada?.src === imagem.src}
            >
              {!falhas.has(imagem.src) && (
                <img src={imagem.src} alt="" onError={() => marcarFalha(imagem.src)} />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
