import { Navigate, Outlet, useLocation } from 'react-router'
import { ErrorMessage, Spinner } from '../components/ui'
import { restaurarSessao } from '../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from './hooks'

export default function RotaProtegida({ admin = false }: { admin?: boolean }) {
  const dispatch = useAppDispatch()
  const token = useAppSelector((s) => s.auth.token)
  const usuario = useAppSelector((s) => s.auth.usuario)
  const restaurando = useAppSelector((s) => s.auth.restaurando)
  const location = useLocation()

  if (!token) {
    const destino = admin ? '/admin/login' : '/login'
    const from = location.pathname + location.search
    return <Navigate to={destino} replace state={{ from }} />
  }

  if (restaurando) {
    return <Spinner label="Carregando sessão" />
  }

  if (!usuario) {
    return (
      <ErrorMessage
        message="Não foi possível carregar sua sessão."
        onRetry={() => void dispatch(restaurarSessao())}
      />
    )
  }

  if (admin && usuario.papel !== 'administrador') {
    return <Navigate to="/vendas" replace />
  }

  return <Outlet />
}
