import { useEffect, useState } from 'react'
import { api } from '../../shared/api/client'
import { ApiError } from '../../shared/api/errors'
import type { Curso } from '../../shared/api/tipos'

export function useCursos() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    let ativo = true

    api<Curso[]>('/cursos')
      .then((lista) => {
        if (ativo) setCursos(lista)
      })
      .catch((e) => {
        if (ativo) setErro(e instanceof ApiError ? e.message : 'Não foi possível carregar os cursos.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  return { cursos, carregando, erro }
}