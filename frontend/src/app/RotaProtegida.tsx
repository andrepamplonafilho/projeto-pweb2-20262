import { Navigate, Outlet, useLocation } from 'react-router'
import { useAppSelector } from './hooks'

export default function RotaProtegida({ admin = false }: { admin?: boolean }) {
  const token = useAppSelector((s) => s.auth.token)
  const location = useLocation()

  if (!token) {
    const destino = admin ? '/admin/login' : '/login'
    const from = location.pathname + location.search
    return <Navigate to={destino} replace state={{ from }} />
  }
  return <Outlet />
}