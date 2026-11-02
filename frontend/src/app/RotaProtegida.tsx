import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from './hooks'

export default function RotaProtegida({ admin = false }: { admin?: boolean }) {
  const token = useAppSelector((s) => s.auth.token)
  if (!token) return <Navigate to={admin ? '/admin/login' : '/login'} replace />
  return <Outlet />
}
