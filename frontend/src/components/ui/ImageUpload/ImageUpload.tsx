import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import styles from './ImageUpload.module.css'

const TIPOS_IMAGEM_ACEITOS: ReadonlySet<string> = new Set(['image/jpeg', 'image/png', 'image/webp'])

export const ACCEPT_IMAGENS = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp'

interface ImageUploadProps {
  id: string
  name?: string
  multiple?: boolean
  required?: boolean
  hint?: string
  error?: string | null
  onFiles: (files: File[]) => void
}

function separarImagensPorTipo(arquivos: File[]) {
  const validas: File[] = []
  const invalidas: string[] = []

  for (const arquivo of arquivos) {
    if (TIPOS_IMAGEM_ACEITOS.has(arquivo.type)) validas.push(arquivo)
    else invalidas.push(arquivo.name)
  }

  return { validas, invalidas }
}

function mensagemFormatoInvalido(nomes: string[]) {
  if (nomes.length === 0) return ''
  return `Formato não aceito: ${nomes.join(', ')}. Use JPEG, PNG ou WebP.`
}

export function ImageUpload({
  id,
  name,
  multiple = false,
  required = false,
  hint = 'JPEG, PNG ou WebP.',
  error = '',
  onFiles,
}: ImageUploadProps) {
  const [arrastando, setArrastando] = useState(false)
  const [erroFormato, setErroFormato] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const mensagemErro = [erroFormato, error].filter(Boolean)
  const idDica = `${id}-dica`
  const idErroFormato = `${id}-erro-formato`
  const idErro = `${id}-erro`
  const describedBy = [idDica, erroFormato ? idErroFormato : '', error ? idErro : '']
    .filter(Boolean)
    .join(' ')

  function processar(arquivos: File[]) {
    const { validas, invalidas } = separarImagensPorTipo(arquivos)
    setErroFormato(mensagemFormatoInvalido(invalidas))
    if (validas.length > 0) onFiles(multiple ? validas : validas.slice(0, 1))
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    processar(Array.from(input.files ?? []))
    input.value = ''
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setArrastando(true)
  }

  function handleDragLeave(event: DragEvent<HTMLLabelElement>) {
    const relatedTarget = event.relatedTarget
    if (!(relatedTarget instanceof Node) || !event.currentTarget.contains(relatedTarget)) {
      setArrastando(false)
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setArrastando(false)
    processar(Array.from(event.dataTransfer.files))
  }

  return (
    <div className={styles.container}>
      <label
        htmlFor={id}
        className={`${styles.zone} ${arrastando ? styles.dragging : ''} ${
          mensagemErro.length > 0 ? styles.invalid : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={ACCEPT_IMAGENS}
          multiple={multiple}
          required={required}
          onChange={handleChange}
          aria-invalid={mensagemErro.length > 0 || undefined}
          aria-describedby={describedBy}
          className={styles.input}
        />
        <span className={styles.icon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14.5v4A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={styles.copy}>
          <span className={styles.title}>
            {arrastando
              ? 'Solte para adicionar'
              : multiple
                ? 'Arraste as imagens ou clique para selecionar'
                : 'Arraste a imagem ou clique para selecionar'}
          </span>
          <span id={idDica} className={styles.hint}>
            {hint}
          </span>
        </span>
      </label>

      {erroFormato && (
        <p id={idErroFormato} className={styles.error} role="alert">
          {erroFormato}
        </p>
      )}
      {error && (
        <p id={idErro} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
