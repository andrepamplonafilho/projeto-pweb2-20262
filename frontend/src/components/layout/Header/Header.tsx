import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useSearchParams } from 'react-router'
import { FiltrosBusca } from '../../../features/busca/FiltrosBusca'
import {
  lerFiltrosBusca,
  modalidadeDaRota,
  ROTAS_DE_BUSCA,
} from '../../../features/busca/useFiltrosBusca'
import styles from './Header.module.css'

type HeaderProps = {
  onLogout: () => void
}

const links = [
  { to: '/pagos', label: 'Aulas pagas' },
  { to: '/doacoes', label: 'Aulas gratuitas' },
  { to: '/anuncios/novo', label: 'Nova aula' },
  { to: '/perfil', label: 'Perfil' },
]

const ID_MENU = 'menu-principal'

export function Header({ onLogout }: HeaderProps) {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  // Guarda em qual rota o menu foi aberto: ao navegar, ele fecha sozinho.
  const [abertoEm, setAbertoEm] = useState<string | null>(null)
  const botaoRef = useRef<HTMLButtonElement>(null)

  const aberto = abertoEm === pathname
  const ehBusca = ROTAS_DE_BUSCA.includes(pathname)

  // Quantidade de filtros diferentes do padrão (mostrada no botão do menu)
  const filtros = lerFiltrosBusca(searchParams)
  const filtrosAtivos = ehBusca
    ? [
        filtros.categoria !== undefined,
        filtros.precoMin !== undefined,
        filtros.precoMax !== undefined,
        filtros.ordem !== 'data' || filtros.direcao !== 'desc',
      ].filter(Boolean).length
    : 0

  useEffect(() => {
    if (!aberto) return

    const aoPressionarTecla = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAbertoEm(null)
        botaoRef.current?.focus()
      }
    }

    document.addEventListener('keydown', aoPressionarTecla)
    return () => document.removeEventListener('keydown', aoPressionarTecla)
  }, [aberto])

  const fechar = () => setAbertoEm(null)

  return (
    <header className={styles.header}>
      <NavLink to="/pagos" className={styles.brand}>
        Cursos e Aulas
      </NavLink>

      <button
        ref={botaoRef}
        type="button"
        className={styles.toggle}
        aria-expanded={aberto}
        aria-controls={ID_MENU}
        aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setAbertoEm(aberto ? null : pathname)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {aberto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
        {filtrosAtivos > 0 && !aberto && (
          <span className={styles.badge} aria-label={`${filtrosAtivos} filtros ativos`}>
            {filtrosAtivos}
          </span>
        )}
      </button>

      <div id={ID_MENU} className={aberto ? `${styles.panel} ${styles.panelOpen}` : styles.panel}>
        <nav aria-label="Principal" className={styles.nav}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={fechar}
              className={({ isActive }) =>
                isActive ? `${styles.item} ${styles.active}` : styles.item
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Só no celular: filtros da busca dentro do menu, acima do "Sair" */}
        {ehBusca && aberto && (
          <section className={styles.filtrosMenu} aria-labelledby="filtros-menu-titulo">
            <h2 id="filtros-menu-titulo">Filtros</h2>
            <FiltrosBusca modalidade={modalidadeDaRota(pathname)} />
            <button type="button" className={styles.verResultados} onClick={fechar}>
              Ver resultados
            </button>
          </section>
        )}

        <button type="button" className={`${styles.item} ${styles.sair}`} onClick={onLogout}>
          Sair
        </button>
      </div>
    </header>
  )
}