import { Link, useNavigate } from 'react-router'
import { useAppSelector } from '../../app/hooks'
import { Avatar, Button, EmptyState, ErrorMessage, Spinner } from '../../components/ui'
import ListaAnunciosPerfil from './ListaAnunciosPerfil'
import { useAnunciosDoUsuario } from './useAnunciosDoUsuario'
import { usePerfil } from './usePerfil'
import styles from './PerfilPage.module.css'

export default function PerfilPage() {
  const navigate = useNavigate()
  const usuario = useAppSelector((state) => state.auth.usuario)

  const {
    perfil,
    carregando: carregandoPerfil,
    erro: erroPerfil,
    recarregar: recarregarPerfil,
  } = usePerfil(usuario?.id)

  const anuncios = useAnunciosDoUsuario(usuario?.id)

  if (carregandoPerfil) {
    return (
      <div className={styles.loading}>
        <Spinner label="Carregando dados do perfil..." />
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
    return (
      <div className={styles.loading}>
        <Spinner label="Carregando dados do perfil..." />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <Avatar name={perfil.nome} src={perfil.fotoUrl} size="xl" />

          <div className={styles.details}>
            <h1 className={styles.name}>{perfil.nome}</h1>
            <p className={styles.course}>{perfil.curso.nome}</p>
            <p className={styles.contact}>Contato: {perfil.telefone ?? 'Não informado'}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <Link to="/anuncios/novo">
            <Button>Novo anúncio</Button>
          </Link>
          <Link to="/perfil/editar">
            <Button variant="secondary">Editar perfil</Button>
          </Link>
        </div>
      </header>

      <section className={styles.anunciosSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Meus Anúncios</h2>
          <span className={styles.anunciosCount}>
            {anuncios.dados ? `${anuncios.dados.total} anúncio(s)` : ''}
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
          rotuloCarregando="Carregando anúncios..."
          tituloErro="Não foi possível carregar seus anúncios"
          estadoVazio={
            <EmptyState
              title="Nenhum anúncio publicado"
              description="Você ainda não publicou nenhuma aula, paga ou gratuita."
              actionLabel="Criar anúncio"
              onAction={() => navigate('/anuncios/novo')}
            />
          }
        />
      </section>
    </div>
  )
}
