import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Alert, Avatar, Button, Field, Input, Select, Spinner } from '../../components/ui'
import { api } from '../../shared/api/client'
import { ApiError } from '../../shared/api/errors'
import type { AtualizarUsuarioRequest, UsuarioLogado } from '../../shared/api/tipos'
import { usuarioAtualizado } from '../auth/authSlice'
import { useCursos } from '../auth/useCursos'
import styles from './PerfilEditarPage.module.css'

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp']
const TAMANHO_MAXIMO_BYTES = 5 * 1024 * 1024 // 5 MB

export default function PerfilEditarPage() {
  const usuario = useAppSelector((state) => state.auth.usuario)

  if (!usuario) {
    return (
      <div className={styles.container}>
        <Spinner label="Carregando perfil..." />
      </div>
    )
  }

  return <PerfilEditarForm key={usuario.id} usuario={usuario} />
}

interface PerfilEditarFormProps {
  usuario: UsuarioLogado
}

function PerfilEditarForm({ usuario }: PerfilEditarFormProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { cursos, carregando: carregandoCursos, erro: erroCursos } = useCursos()

  const [nome, setNome] = useState(usuario.nome)
  const [cursoId, setCursoId] = useState(usuario.curso?.id ? String(usuario.curso.id) : '')
  const [telefone, setTelefone] = useState(usuario.telefone ?? '')

  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)

  const [salvando, setSalvando] = useState(false)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)
  const [errosCampos, setErrosCampos] = useState<Record<string, string>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Revoga URL criada pelo createObjectURL quando componente desmontar ou foto mudar
  useEffect(() => {
    return () => {
      if (fotoPreview) {
        URL.revokeObjectURL(fotoPreview)
      }
    }
  }, [fotoPreview])

  function aoSelecionarFoto(ev: ChangeEvent<HTMLInputElement>) {
    setMensagemErro(null)
    setMensagemSucesso(null)
    const arquivo = ev.target.files?.[0]
    if (!arquivo) return

    if (!TIPOS_ACEITOS.includes(arquivo.type)) {
      setMensagemErro('Formato de foto inválido. Use JPEG, PNG ou WebP.')
      return
    }

    if (arquivo.size > TAMANHO_MAXIMO_BYTES) {
      setMensagemErro('A foto deve ter no máximo 5 MB.')
      return
    }

    if (fotoPreview) {
      URL.revokeObjectURL(fotoPreview)
    }

    const previewUrl = URL.createObjectURL(arquivo)
    setFotoArquivo(arquivo)
    setFotoPreview(previewUrl)
  }

  function cancelarFoto() {
    if (fotoPreview) {
      URL.revokeObjectURL(fotoPreview)
    }
    setFotoArquivo(null)
    setFotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function validar(): Record<string, string> {
    const erros: Record<string, string> = {}
    if (!nome.trim()) {
      erros.nome = 'Informe seu nome.'
    } else if (nome.trim().length > 100) {
      erros.nome = 'O nome deve ter no máximo 100 caracteres.'
    }

    if (!cursoId) {
      erros.cursoId = 'Selecione seu curso.'
    }

    return erros
  }

  async function aoSalvar(ev: FormEvent) {
    ev.preventDefault()
    setMensagemSucesso(null)
    setMensagemErro(null)

    const erros = validar()
    setErrosCampos(erros)
    if (Object.keys(erros).length > 0) return

    setSalvando(true)

    // Indica que a foto já foi enviada com sucesso nesta tentativa.
    // Se a segunda chamada falhar, o usuário precisa saber que a foto mudou.
    let fotoAtualizada = false

    try {
      let resultadoUsuario: UsuarioLogado = usuario

      if (fotoArquivo) {
        const formData = new FormData()
        formData.append('foto', fotoArquivo)

        resultadoUsuario = await api<UsuarioLogado>('/usuarios/eu/foto', {
          method: 'PUT',
          body: formData,
        })

        dispatch(usuarioAtualizado(resultadoUsuario))
        cancelarFoto()
        fotoAtualizada = true
      }

      const dadosAtualizados: AtualizarUsuarioRequest = {
        nome: nome.trim(),
        cursoId: Number(cursoId),
        telefone: telefone.trim() || null,
      }

      resultadoUsuario = await api<UsuarioLogado>('/usuarios/eu', {
        method: 'PUT',
        body: dadosAtualizados,
      })

      dispatch(usuarioAtualizado(resultadoUsuario))
      setMensagemSucesso('Perfil atualizado com sucesso!')
    } catch (erro: unknown) {
      const mensagem =
        erro instanceof ApiError
          ? erro.message
          : 'Não foi possível salvar as alterações. Tente novamente.'

      setMensagemErro(
        fotoAtualizada
          ? `A foto foi atualizada, mas os dados não foram salvos: ${mensagem}`
          : mensagem,
      )
      setErrosCampos(erro instanceof ApiError ? (erro.campos ?? {}) : {})
    } finally {
      setSalvando(false)
    }
  }

  const fotoExibida = fotoPreview ?? usuario.fotoUrl

  return (
    <div className={styles.container}>
      <Link to="/perfil" className={styles.backLink}>
        ← Voltar para o perfil
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>Editar perfil</h1>
        <p className={styles.subtitle}>Atualize suas informações públicas e foto de perfil.</p>
      </header>

      {mensagemSucesso && (
        <Alert variant="success" onClose={() => setMensagemSucesso(null)}>
          {mensagemSucesso}
        </Alert>
      )}

      {mensagemErro && (
        <Alert variant="error" onClose={() => setMensagemErro(null)}>
          {mensagemErro}
        </Alert>
      )}

      <div className={styles.card}>
        <section className={styles.fotoSection} aria-label="Foto de perfil">
          <Avatar name={nome.trim() || usuario.nome} src={fotoExibida} size="xl" />

          <div className={styles.fotoActions}>
            <h2 className={styles.sectionTitle}>Foto de perfil</h2>
            <p className={styles.hint}>Formatos aceitos: JPEG, PNG ou WebP (máximo 5 MB).</p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={aoSelecionarFoto}
              className={styles.fileInput}
              id="foto-input"
            />

            <div className={styles.fotoButtons}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={salvando}
              >
                {fotoArquivo ? 'Escolher outra foto' : 'Trocar foto'}
              </Button>

              {fotoArquivo && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={cancelarFoto}
                  disabled={salvando}
                >
                  Cancelar foto
                </Button>
              )}
            </div>
          </div>
        </section>

        <form onSubmit={aoSalvar} className={styles.form} noValidate>
          <Field label="Nome completo" required error={errosCampos.nome}>
            <Input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              maxLength={100}
              disabled={salvando}
            />
          </Field>

          <Field label="E-mail institucional">
            <Input
              type="email"
              value={usuario.email}
              disabled
              readOnly
              title="O e-mail não pode ser alterado"
            />
          </Field>

          <Field label="Curso" required error={errosCampos.cursoId || erroCursos || undefined}>
            <Select
              value={cursoId}
              onChange={(e) => setCursoId(e.target.value)}
              disabled={salvando || carregandoCursos}
            >
              <option value="">Selecione seu curso</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nome}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Telefone / WhatsApp" error={errosCampos.telefone}>
            <Input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(83) 99999-9999"
              disabled={salvando}
            />
          </Field>

          <div className={styles.formActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/perfil')}
              disabled={salvando}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
