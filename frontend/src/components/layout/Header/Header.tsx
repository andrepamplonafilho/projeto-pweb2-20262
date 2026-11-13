import { NavLink } from 'react-router'
import styles from './Header.module.css'

type HeaderProps = {
  onLogout: () => void
}

const links = [
  { to: '/vendas', label: 'Vendas' },
  { to: '/doacoes', label: 'Doações' },
  { to: '/perfil', label: 'Perfil' },
]

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className={styles.header}>
      <NavLink to="/vendas" className={styles.brand}>
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