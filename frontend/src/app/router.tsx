import { createBrowserRouter, Navigate } from 'react-router-dom'
import Pagina from './Pagina'
import RotaProtegida from './RotaProtegida'

export const router = createBrowserRouter([
  { path: '/login', element: <Pagina titulo="Login" /> },
  { path: '/cadastro', element: <Pagina titulo="Cadastro" /> },
  { path: '/admin/login', element: <Pagina titulo="Login do administrador" /> },
  {
    element: <RotaProtegida />,
    children: [
      { path: '/', element: <Navigate to="/vendas" replace /> },
      { path: '/vendas', element: <Pagina titulo="Vendas" /> },
      { path: '/doacoes', element: <Pagina titulo="Doações" /> },
      { path: '/perfil', element: <Pagina titulo="Meu perfil" /> },
      { path: '/perfil/editar', element: <Pagina titulo="Editar perfil" /> },
      { path: '/usuarios/:id', element: <Pagina titulo="Perfil do usuário" /> },
      { path: '/anuncios/novo', element: <Pagina titulo="Novo anúncio" /> },
      { path: '/anuncios/:id', element: <Pagina titulo="Anúncio" /> },
      { path: '/anuncios/:id/editar', element: <Pagina titulo="Editar anúncio" /> },
    ],
  },
  {
    element: <RotaProtegida admin />,
    children: [{ path: '/admin', element: <Pagina titulo="Administração" /> }],
  },
])
