import { Navigate, useNavigate, useParams } from 'react-router'
import { useAppSelector } from '../../app/hooks'
import { Avatar, EmptyState, ErrorMessage, Spinner } from '../../components/ui'
import ListaAnunciosPerfil from './ListaAnunciosPerfil'
import { useAnunciosDoUsuario } from './useAnunciosDoUsuario'
import { usePerfil } from './usePerfil'
import styles from './PerfilUsuarioPage.module.css'

function PerfilUsuarioConteudo() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const usuarioId = Number(id)
  const idValido = Number.isSafeInteger(usuarioId) && usuarioId > 0

  const {
    perfil,
    carregando: carregandoPerfil,
    erro: erroPerfil,
    recarregar: recarregarPerfil,
  } = usePerfil(idValido ? usuarioId : undefined)

  const anuncios = useAnunciosDoUsuario(idValido ? usuarioId : undefined)

  if (!idValido) {
    return (
      <ErrorMessage
        title="Usuário inválido"
        message="O identificador do estudante informado não é válido."
      />
    )
  }

  if (carregandoPerfil) {
    return (
      <div className={styles.loading}>
        <Spinner label="Carregando perfil do estudante..." />
      </div>
    )
  }

  if (erroPerfil) {
    return (
      <ErrorMessage
        title="Não foi possível carregar o perfil"
        message={erroPerfil}
        onRetry={recarregarPerfil}
      />
    )
  }

  if (!perfil) {
    return null
  }

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className={styles.backLink}
        aria-label="Voltar para a página anterior"
      >
        ← Voltar
      </button>

      <header className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <Avatar name={perfil.nome} src={perfil.fotoUrl} size="xl" />

          <div className={styles.details}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>{perfil.nome}</h1>
              <span className={styles.roleBadge}>Estudante</span>
            </div>
            <p className={styles.course}>{perfil.curso.nome}</p>
            <p className={styles.contact}>
              Contato:{' '}
              {perfil.telefone ? (
                <a
                  href={`https://wa.me/55${perfil.telefone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.contactLink}
                >
                  {perfil.telefone}
                </a>
              ) : (
                'Não informado'
              )}
            </p>
          </div>
        </div>
      </header>

      <section className={styles.anunciosSection} aria-label="Anúncios do estudante">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Anúncios publicados</h2>
          <span className={styles.anunciosCount}>
            {anuncios.dados ? `${anuncios.dados.total} anúncio(s) ativo(s)` : ''}
          </span>
        </div>

        <ListaAnunciosPerfil
          dados={anuncios.dados}
          erro={anuncios.erro}
          carregando={anuncios.carregando}
          pagina={anuncios.pagina}
          tamanho={anuncios.tamanho}
          onPaginaChange={anuncios.setPagina}
          onTamanhoChange={anuncios.alterarTamanho}
          onRetry={anuncios.recarregar}
          rotuloCarregando="Carregando anúncios do estudante..."
          tituloErro="Não foi possível carregar os anúncios"
          estadoVazio={
            <EmptyState
              title="Nenhum anúncio disponível"
              description="Este estudante não possui aulas ativas no momento."
            />
          }
        />
      </section>
    </div>
  )
}

export default function PerfilUsuarioPage() {
  const { id } = useParams<{ id: string }>()
  const meuId = useAppSelector((s) => s.auth.usuario?.id)

  if (meuId !== undefined && Number(id) === meuId) {
    return <Navigate to="/perfil" replace />
  }

  return <PerfilUsuarioConteudo key={id} />
}
