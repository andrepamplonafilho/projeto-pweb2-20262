import { useDispatch } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import type { AppDispatch } from '../../../app/store'
import { logout } from '../../../features/auth/authSlice'
import { Header } from '../Header/Header'
import styles from './Layout.module.css'

export function Layout() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await dispatch(logout())
    navigate('/login', { replace: true })
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
