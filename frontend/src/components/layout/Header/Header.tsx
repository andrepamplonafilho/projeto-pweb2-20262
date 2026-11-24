import { NavLink } from 'react-router'
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

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className={styles.header}>
      <NavLink to="/pagos" className={styles.brand}>
        Cursos e Aulas
      </NavLink>

      <nav aria-label="Principal" className={styles.nav}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? `${styles.item} ${styles.active}` : styles.item
            }
          >
            {link.label}
          </NavLink>
        ))}

        <button type="button" className={styles.item} onClick={onLogout}>
          Sair
        </button>
      </nav>
    </header>
  )
}
