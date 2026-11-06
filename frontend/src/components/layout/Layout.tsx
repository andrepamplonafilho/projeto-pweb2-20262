import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import styles from './Layout.module.css'

export function Layout() {
  const handleLogout = () => {
    // será ligado ao thunk de logout no próximo passo
  }

  return (
    <div className={styles.layout}>
      <Header onLogout={handleLogout} />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
